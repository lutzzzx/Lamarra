import { Router, Response } from 'express';
import { query } from '../db/pool.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Helper to auto-generate company logo URL from website domain or clearbit
function generateLogoUrl(companyName: string, jobUrl?: string): string {
  if (jobUrl) {
    try {
      const parsed = new URL(jobUrl);
      const host = parsed.hostname.replace('www.', '');
      return `https://logo.clearbit.com/${host}`;
    } catch {
      // Fallback if invalid URL
    }
  }
  // Try clean domain from company name
  const cleanName = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `https://logo.clearbit.com/${cleanName}.com`;
}

// GET /api/v1/jobs — Fetch user's jobs with filters, search, and sorting
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const {
      status,
      source,
      workType,
      workLocation,
      priority,
      search,
      sortBy = 'appliedDate_desc'
    } = req.query;

    let sql = `
      SELECT 
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
              'dueTime', r.due_time,
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
    `;

    const params: any[] = [userId];
    let paramIndex = 2;

    if (status && status !== 'all') {
      sql += ` AND j.status = $${paramIndex++}`;
      params.push(status);
    }
    if (source) {
      sql += ` AND j.source = $${paramIndex++}`;
      params.push(source);
    }
    if (workType) {
      sql += ` AND j.work_type = $${paramIndex++}`;
      params.push(workType);
    }
    if (workLocation) {
      sql += ` AND j.work_location = $${paramIndex++}`;
      params.push(workLocation);
    }
    if (priority) {
      sql += ` AND j.priority = $${paramIndex++}`;
      params.push(priority);
    }
    if (search) {
      sql += ` AND (
        LOWER(j.company_name) LIKE $${paramIndex} OR
        LOWER(j.position) LIKE $${paramIndex} OR
        LOWER(COALESCE(j.location_name, '')) LIKE $${paramIndex} OR
        LOWER(COALESCE(j.notes, '')) LIKE $${paramIndex}
      )`;
      params.push(`%${(search as string).toLowerCase()}%`);
      paramIndex++;
    }

    sql += ` GROUP BY j.id`;

    // Sorting
    if (sortBy === 'appliedDate_asc') {
      sql += ` ORDER BY j.applied_date ASC, j.created_at ASC`;
    } else if (sortBy === 'company_asc') {
      sql += ` ORDER BY j.company_name ASC`;
    } else if (sortBy === 'priority_desc') {
      sql += ` ORDER BY CASE j.priority WHEN 'High' THEN 3 WHEN 'Medium' THEN 2 WHEN 'Low' THEN 1 END DESC`;
    } else if (sortBy === 'deadline_asc') {
      sql += ` ORDER BY j.deadline_date ASC NULLS LAST`;
    } else {
      // Default: appliedDate_desc
      sql += ` ORDER BY j.applied_date DESC, j.created_at DESC`;
    }

    const result = await query(sql, params);

    // Format output to match frontend TypeScript types
    const formattedJobs = result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      companyName: row.company_name,
      companyLogo: row.company_logo || generateLogoUrl(row.company_name, row.job_url),
      position: row.position,
      status: row.status,
      source: row.source,
      workType: row.work_type,
      workLocation: row.work_location,
      locationName: row.location_name || row.work_location,
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

    return res.json({ success: true, data: formattedJobs });
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    return res.status(500).json({ success: false, error: 'Gagal mengambil data lamaran.' });
  }
});

// POST /api/v1/jobs — Create new job application
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const {
      companyName,
      companyLogo,
      position,
      status = 'applied',
      source = 'LinkedIn',
      workType = 'Full-time',
      workLocation = 'Hybrid',
      locationName,
      salaryRange,
      jobUrl,
      appliedDate = new Date().toISOString().split('T')[0],
      deadlineDate,
      priority = 'Medium',
      notes,
      recruiter,
      documents,
      initialReminderDate
    } = req.body;

    if (!companyName || !position) {
      return res.status(400).json({ success: false, error: 'Nama Perusahaan dan Posisi wajib diisi.' });
    }

    const logo = companyLogo || generateLogoUrl(companyName, jobUrl);

    // Insert job application
    const jobResult = await query(
      `INSERT INTO job_applications (
        user_id, company_name, company_logo, position, status, source, work_type, work_location,
        location_name, salary_range, job_url, applied_date, deadline_date, priority, notes,
        recruiter_name, recruiter_title, recruiter_email, recruiter_phone, recruiter_linkedin,
        resume_version, cover_letter
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
      ) RETURNING *`,
      [
        userId,
        companyName,
        logo,
        position,
        status,
        source,
        workType,
        workLocation,
        locationName || workLocation,
        salaryRange || null,
        jobUrl || null,
        appliedDate,
        deadlineDate || null,
        priority,
        notes || null,
        recruiter?.name || null,
        recruiter?.title || null,
        recruiter?.email || null,
        recruiter?.phone || null,
        recruiter?.linkedin || null,
        documents?.resumeVersion || null,
        documents?.coverLetter || null
      ]
    );

    const newJob = jobResult.rows[0];

    // Add initial timeline item
    const initialTimelineTitle = status === 'wishlist' ? 'Ditambahkan ke Wishlist' : 'Lamaran Dikirim';
    const initialTimelineType = status === 'wishlist' ? 'created' : 'applied';
    await query(
      `INSERT INTO timeline_activities (job_id, date, type, title, notes)
       VALUES ($1, $2, $3, $4, $5)`,
      [newJob.id, appliedDate, initialTimelineType, initialTimelineTitle, notes || 'Catatan awal lamaran.']
    );

    // Optional initial reminder
    if (initialReminderDate) {
      const reminderType = status === 'interview' ? 'interview' : status === 'assessment' ? 'assessment' : 'deadline';
      await query(
        `INSERT INTO reminders (job_id, title, due_date, type)
         VALUES ($1, $2, $3, $4)`,
        [newJob.id, `Follow-up / Deadline ${companyName}`, initialReminderDate, reminderType]
      );
    }

    return res.status(201).json({
      success: true,
      message: 'Lamaran berhasil ditambahkan.',
      data: { id: newJob.id }
    });
  } catch (error: any) {
    console.error('Error creating job:', error);
    return res.status(500).json({ success: false, error: 'Gagal membuat data lamaran baru.' });
  }
});

// PUT /api/v1/jobs/:id — Update existing job application
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const {
      companyName,
      companyLogo,
      position,
      status,
      source,
      workType,
      workLocation,
      locationName,
      salaryRange,
      jobUrl,
      appliedDate,
      deadlineDate,
      priority,
      notes,
      recruiter,
      documents
    } = req.body;

    // Check ownership
    const check = await query('SELECT status FROM job_applications WHERE id = $1 AND user_id = $2', [id, userId]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Data lamaran tidak ditemukan.' });
    }

    const previousStatus = check.rows[0].status;

    const logo = companyLogo || generateLogoUrl(companyName, jobUrl);

    await query(
      `UPDATE job_applications SET
        company_name = $1,
        company_logo = $2,
        position = $3,
        status = $4,
        source = $5,
        work_type = $6,
        work_location = $7,
        location_name = $8,
        salary_range = $9,
        job_url = $10,
        applied_date = $11,
        deadline_date = $12,
        priority = $13,
        notes = $14,
        recruiter_name = $15,
        recruiter_title = $16,
        recruiter_email = $17,
        recruiter_phone = $18,
        recruiter_linkedin = $19,
        resume_version = $20,
        cover_letter = $21,
        updated_at = NOW()
      WHERE id = $22 AND user_id = $23`,
      [
        companyName,
        logo,
        position,
        status,
        source,
        workType,
        workLocation,
        locationName,
        salaryRange || null,
        jobUrl || null,
        appliedDate,
        deadlineDate || null,
        priority,
        notes || null,
        recruiter?.name || null,
        recruiter?.title || null,
        recruiter?.email || null,
        recruiter?.phone || null,
        recruiter?.linkedin || null,
        documents?.resumeVersion || null,
        documents?.coverLetter || null,
        id,
        userId
      ]
    );

    // If status changed, record timeline entry
    if (previousStatus !== status) {
      const todayDate = new Date().toISOString().split('T')[0];
      await query(
        `INSERT INTO timeline_activities (job_id, date, type, title, notes)
         VALUES ($1, $2, 'status_change', $3, $4)`,
        [
          id,
          todayDate,
          `Status Diubah: ${previousStatus.toUpperCase()} -> ${status.toUpperCase()}`,
          `Status diperbarui menjadi ${status}`
        ]
      );
    }

    return res.json({ success: true, message: 'Data lamaran berhasil diperbarui.' });
  } catch (error: any) {
    console.error('Error updating job:', error);
    return res.status(500).json({ success: false, error: 'Gagal memperbarui data lamaran.' });
  }
});

// PATCH /api/v1/jobs/:id/status — Quick status change
router.patch('/:id/status', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, error: 'Status baru wajib ditentukan.' });
    }

    const check = await query('SELECT status FROM job_applications WHERE id = $1 AND user_id = $2', [id, userId]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Data lamaran tidak ditemukan.' });
    }

    const previousStatus = check.rows[0].status;
    if (previousStatus === status) {
      return res.json({ success: true, message: 'Status tidak berubah.' });
    }

    await query(
      'UPDATE job_applications SET status = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3',
      [status, id, userId]
    );

    // Log timeline
    const todayDate = new Date().toISOString().split('T')[0];
    await query(
      `INSERT INTO timeline_activities (job_id, date, type, title, notes)
       VALUES ($1, $2, 'status_change', $3, $4)`,
      [
        id,
        todayDate,
        `Status Diubah ke ${status.toUpperCase()}`,
        `Perubahan dari status ${previousStatus} ke ${status}`
      ]
    );

    return res.json({ success: true, message: `Status diperbarui ke ${status}` });
  } catch (error: any) {
    console.error('Error patching job status:', error);
    return res.status(500).json({ success: false, error: 'Gagal memperbarui status.' });
  }
});

// DELETE /api/v1/jobs/:id — Delete job application
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const result = await query('DELETE FROM job_applications WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Data lamaran tidak ditemukan.' });
    }

    return res.json({ success: true, message: 'Data lamaran berhasil dihapus.' });
  } catch (error: any) {
    console.error('Error deleting job:', error);
    return res.status(500).json({ success: false, error: 'Gagal menghapus data lamaran.' });
  }
});

export default router;
