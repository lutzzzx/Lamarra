import { Router, Response } from 'express';
import { query } from '../db/pool.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { ReminderSchema } from '../validators/schemas.js';

const router = Router();

// GET /api/v1/reminders — Get all reminders for current user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const result = await query(
      `SELECT 
        r.id,
        r.job_id AS "jobId",
        r.title,
        to_char(r.due_date, 'YYYY-MM-DD') AS "dueDate",
        r.due_time AS "dueTime",
        r.type,
        r.is_completed AS "isCompleted",
        j.position AS "jobTitle",
        j.company_name AS "companyName"
       FROM reminders r
       JOIN job_applications j ON j.id = r.job_id
       WHERE j.user_id = $1
       ORDER BY r.due_date ASC`,
      [userId]
    );

    return res.json({ success: true, data: result.rows });
  } catch (error: any) {
    console.error('Error fetching reminders:', error);
    return res.status(500).json({ success: false, error: 'Gagal mengambil data pengingat.' });
  }
});

// POST /api/v1/jobs/:jobId/reminders — Add reminder to job
router.post('/jobs/:jobId/reminders', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { jobId } = req.params;

    const parseResult = ReminderSchema.safeParse(req.body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || 'Data pengingat tidak valid.';
      return res.status(400).json({ success: false, error: firstError });
    }

    const { title, dueDate, dueTime, type } = parseResult.data;

    const check = await query('SELECT id, position, company_name FROM job_applications WHERE id = $1 AND user_id = $2', [jobId, userId]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Data lamaran tidak ditemukan.' });
    }

    const job = check.rows[0];

    const result = await query(
      `INSERT INTO reminders (job_id, title, due_date, due_time, type, is_completed)
       VALUES ($1, $2, $3, $4, $5, FALSE)
       RETURNING id, job_id, title, due_date, due_time, type, is_completed`,
      [jobId, title, dueDate, dueTime || null, type]
    );

    await query('UPDATE job_applications SET updated_at = NOW() WHERE id = $1', [jobId]);

    const row = result.rows[0];
    return res.status(201).json({
      success: true,
      data: {
        id: row.id,
        jobId: row.job_id,
        title: row.title,
        dueDate: new Date(row.due_date).toISOString().split('T')[0],
        dueTime: row.due_time || undefined,
        type: row.type,
        isCompleted: row.is_completed,
        jobTitle: job.position,
        companyName: job.company_name
      }
    });
  } catch (error: any) {
    console.error('Error adding reminder:', error);
    return res.status(500).json({ success: false, error: 'Gagal menambahkan pengingat.' });
  }
});

// PATCH /api/v1/reminders/:id/toggle — Toggle completion status
router.patch('/reminders/:id/toggle', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    // Check ownership via job_applications
    const check = await query(
      `SELECT r.id, r.is_completed, r.job_id
       FROM reminders r
       JOIN job_applications j ON j.id = r.job_id
       WHERE r.id = $1 AND j.user_id = $2`,
      [id, userId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Pengingat tidak ditemukan.' });
    }

    const currentStatus = check.rows[0].is_completed;
    const newStatus = !currentStatus;

    await query('UPDATE reminders SET is_completed = $1 WHERE id = $2', [newStatus, id]);
    await query('UPDATE job_applications SET updated_at = NOW() WHERE id = $1', [check.rows[0].job_id]);

    return res.json({ success: true, isCompleted: newStatus });
  } catch (error: any) {
    console.error('Error toggling reminder:', error);
    return res.status(500).json({ success: false, error: 'Gagal merubah status pengingat.' });
  }
});

// PUT /api/v1/reminders/:id — Update reminder
router.put('/reminders/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const parseResult = ReminderSchema.safeParse(req.body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || 'Data pengingat tidak valid.';
      return res.status(400).json({ success: false, error: firstError });
    }

    const { title, dueDate, dueTime, type } = parseResult.data;

    const check = await query(
      `SELECT r.id, r.job_id
       FROM reminders r
       JOIN job_applications j ON j.id = r.job_id
       WHERE r.id = $1 AND j.user_id = $2`,
      [id, userId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Pengingat tidak ditemukan.' });
    }

    await query(
      `UPDATE reminders
       SET title = $1, due_date = $2, due_time = $3, type = $4
       WHERE id = $5`,
      [title, dueDate, dueTime || null, type, id]
    );

    await query('UPDATE job_applications SET updated_at = NOW() WHERE id = $1', [check.rows[0].job_id]);

    return res.json({ success: true, message: 'Pengingat berhasil diperbarui.' });
  } catch (error: any) {
    console.error('Error updating reminder:', error);
    return res.status(500).json({ success: false, error: 'Gagal memperbarui pengingat.' });
  }
});

// DELETE /api/v1/reminders/:id — Delete reminder
router.delete('/reminders/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const check = await query(
      `SELECT r.id, r.job_id
       FROM reminders r
       JOIN job_applications j ON j.id = r.job_id
       WHERE r.id = $1 AND j.user_id = $2`,
      [id, userId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Pengingat tidak ditemukan.' });
    }

    await query('DELETE FROM reminders WHERE id = $1', [id]);
    await query('UPDATE job_applications SET updated_at = NOW() WHERE id = $1', [check.rows[0].job_id]);

    return res.json({ success: true, message: 'Pengingat berhasil dihapus.' });
  } catch (error: any) {
    console.error('Error deleting reminder:', error);
    return res.status(500).json({ success: false, error: 'Gagal menghapus pengingat.' });
  }
});

export default router;
