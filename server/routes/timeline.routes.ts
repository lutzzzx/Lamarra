import { Router, Response } from 'express';
import { query } from '../db/pool.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/v1/jobs/:jobId/timeline — Add timeline activity
router.post('/:jobId/timeline', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { jobId } = req.params;
    const { date, type, title, notes } = req.body;

    if (!date || !type || !title) {
      return res.status(400).json({ success: false, error: 'Tanggal, tipe, dan judul wajib diisi.' });
    }

    // Check ownership
    const check = await query('SELECT id FROM job_applications WHERE id = $1 AND user_id = $2', [jobId, userId]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Data lamaran tidak ditemukan.' });
    }

    const result = await query(
      `INSERT INTO timeline_activities (job_id, date, type, title, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, date, type, title, notes`,
      [jobId, date, type, title, notes || null]
    );

    // Touch job updated_at
    await query('UPDATE job_applications SET updated_at = NOW() WHERE id = $1', [jobId]);

    const row = result.rows[0];
    return res.status(201).json({
      success: true,
      data: {
        id: row.id,
        date: new Date(row.date).toISOString().split('T')[0],
        type: row.type,
        title: row.title,
        notes: row.notes
      }
    });
  } catch (error: any) {
    console.error('Error adding timeline:', error);
    return res.status(500).json({ success: false, error: 'Gagal menambahkan riwayat timeline.' });
  }
});

export default router;
