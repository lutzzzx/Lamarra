import { Router, Response } from 'express';
import { query, pool } from '../db/pool.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { ImportPayloadSchema } from '../validators/schemas.js';

const router = Router();

// GET /api/v1/export — Export user data as JSON
router.get('/export', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const result = await query(
      `SELECT 
        j.*,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', t.id,
              'date', to_char(t.date, 'YYYY-MM-DD'),
              'type', t.type,
              'title', t.title,
              'notes', t.notes
            )
          ) FILTER (WHERE t.id IS NOT NULL), '[]'
        ) AS timeline,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', r.id,
              'jobId', r.job_id,
              'title', r.title,
              'dueDate', to_char(r.due_date, 'YYYY-MM-DD'),
              'type', r.type,
              'isCompleted', r.is_completed,
              'jobTitle', j.position,
              'companyName', j.company_name
            )
          ) FILTER (WHERE r.id IS NOT NULL), '[]'
        ) AS reminders
      FROM job_applications j
      LEFT JOIN timeline_activities t ON t.job_id = j.id
      LEFT JOIN reminders r ON r.job_id = j.id
      WHERE j.user_id = $1
      GROUP BY j.id
      ORDER BY j.created_at DESC`,
      [userId]
    );

    const formattedJobs = result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      companyName: row.company_name,
      companyLogo: row.company_logo,
      position: row.position,
      status: row.status,
      source: row.source,
      workType: row.work_type,
      workLocation: row.work_location,
      locationName: row.location_name,
      salaryRange: row.salary_range,
      jobUrl: row.job_url,
      appliedDate: row.applied_date ? new Date(row.applied_date).toISOString().split('T')[0] : '',
      deadlineDate: row.deadline_date ? new Date(row.deadline_date).toISOString().split('T')[0] : undefined,
      priority: row.priority,
      recruiter: (row.recruiter_name || row.recruiter_email) ? {
        name: row.recruiter_name || '',
        title: row.recruiter_title || '',
        email: row.recruiter_email || '',
        phone: row.recruiter_phone || '',
        linkedin: row.recruiter_linkedin || ''
      } : undefined,
      documents: (row.resume_version || row.cover_letter) ? {
        resumeVersion: row.resume_version,
        coverLetter: row.cover_letter
      } : undefined,
      notes: row.notes,
      timeline: row.timeline || [],
      reminders: row.reminders || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    const exportPayload = {
      app: 'Lamarra Job Application Tracker',
      version: '2.0-postgresql',
      exportedAt: new Date().toISOString(),
      jobsCount: formattedJobs.length,
      data: formattedJobs
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=lamarra_backup_${Date.now()}.json`);
    return res.json(exportPayload);
  } catch (error: any) {
    console.error('Error exporting data:', error);
    return res.status(500).json({ success: false, error: 'Gagal mengekspor data.' });
  }
});

// POST /api/v1/import — Import JSON backup into PostgreSQL
router.post('/import', authenticateToken, async (req: AuthRequest, res: Response) => {
  const client = await pool.connect();
  try {
    const userId = req.user?.id;
    const { data: rawJobs } = req.body;

    const jobsArray = Array.isArray(rawJobs) ? rawJobs : (req.body.jobs || (Array.isArray(req.body) ? req.body : []));
    
    const parseResult = ImportPayloadSchema.safeParse(jobsArray);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Format file JSON atau isi data lamaran tidak valid.',
        details: parseResult.error.issues[0]?.message
      });
    }

    const validatedJobs = parseResult.data;

    await client.query('BEGIN');

    let count = 0;
    for (const job of validatedJobs) {
      const jobResult = await client.query(
        `INSERT INTO job_applications (
          user_id, company_name, company_logo, position, status, source, work_type, work_location,
          location_name, salary_range, job_url, applied_date, deadline_date, priority, notes,
          recruiter_name, recruiter_title, recruiter_email, recruiter_phone, recruiter_linkedin,
          resume_version, cover_letter
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
        ) RETURNING id`,
        [
          userId,
          job.companyName || 'Tanpa Nama',
          job.companyLogo || null,
          job.position || 'Software Engineer',
          job.status || 'applied',
          job.source || 'LinkedIn',
          job.workType || 'Full-time',
          job.workLocation || 'Hybrid',
          job.locationName || null,
          job.salaryRange || null,
          job.jobUrl || null,
          job.appliedDate || new Date().toISOString().split('T')[0],
          job.deadlineDate || null,
          job.priority || 'Medium',
          job.notes || null,
          job.recruiter?.name || null,
          job.recruiter?.title || null,
          job.recruiter?.email || null,
          job.recruiter?.phone || null,
          job.recruiter?.linkedin || null,
          job.documents?.resumeVersion || null,
          job.documents?.coverLetter || null
        ]
      );

      const createdJobId = jobResult.rows[0].id;

      // Import timeline
      if (Array.isArray(job.timeline)) {
        for (const item of job.timeline) {
          await client.query(
            `INSERT INTO timeline_activities (job_id, date, type, title, notes)
             VALUES ($1, $2, $3, $4, $5)`,
            [createdJobId, item.date || new Date().toISOString().split('T')[0], item.type || 'applied', item.title || 'Aktivitas', item.notes || null]
          );
        }
      }

      // Import reminders
      if (Array.isArray(job.reminders)) {
        for (const rem of job.reminders) {
          await client.query(
            `INSERT INTO reminders (job_id, title, due_date, type, is_completed)
             VALUES ($1, $2, $3, $4, $5)`,
            [createdJobId, rem.title || 'Pengingat', rem.dueDate || new Date().toISOString().split('T')[0], rem.type || 'followup', !!rem.isCompleted]
          );
        }
      }

      count++;
    }

    await client.query('COMMIT');
    return res.json({ success: true, importedCount: count, message: `Berhasil mengimpor ${count} data lamaran.` });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error importing data:', error);
    return res.status(500).json({ success: false, error: 'Gagal mengimpor data.' });
  } finally {
    client.release();
  }
});

export default router;
