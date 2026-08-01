import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db/pool.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'lamarra_jwt_secret_key_change_in_production_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Register User with Password
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Mohon lengkapi nama, email, dan kata sandi.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Kata sandi minimal 6 karakter.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check existing email
    const existing = await query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Email sudah terdaftar. Silakan masuk.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const result = await query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name.trim(), normalizedEmail, passwordHash]
    );

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    return res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.created_at
        },
        token
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, error: 'Terjadi kesalahan server saat pendaftaran.' });
  }
});

// Login User with Password
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Mohon masukkan email dan kata sandi.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user
    const result = await query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Email atau kata sandi tidak valid. Belum punya akun? Silakan daftar.' });
    }

    const user = result.rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Kata sandi tidak sesuai. Silakan coba lagi.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    return res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.created_at
        },
        token
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, error: 'Terjadi kesalahan server saat masuk.' });
  }
});

// Get Current User Profile
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const result = await query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Pengguna tidak ditemukan.' });
    }

    const user = result.rows[0];
    return res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Gagal mengambil data profil.' });
  }
});

// Update User Profile & Password
router.put('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, email, currentPassword, newPassword } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Nama dan email wajib diisi.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check user existing record
    const userRes = await query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Pengguna tidak ditemukan.' });
    }
    const currentUser = userRes.rows[0];

    // Check email uniqueness if changed
    if (normalizedEmail !== currentUser.email) {
      const emailCheck = await query('SELECT id FROM users WHERE email = $1 AND id != $2', [normalizedEmail, userId]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ success: false, error: 'Email tersebut sudah digunakan oleh akun lain.' });
      }
    }

    let updatedHash = null;
    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, error: 'Kata sandi baru minimal 6 karakter.' });
      }
      if (!currentPassword) {
        return res.status(400).json({ success: false, error: 'Mohon masukkan kata sandi lama Anda untuk konfirmasi.' });
      }
      const isMatch = await bcrypt.compare(currentPassword, currentUser.password_hash);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Kata sandi lama Anda tidak sesuai.' });
      }
      const salt = await bcrypt.genSalt(10);
      updatedHash = await bcrypt.hash(newPassword, salt);
    }

    const updateRes = await query(
      `UPDATE users 
       SET name = $1, email = $2, password_hash = COALESCE($3, password_hash)
       WHERE id = $4
       RETURNING id, name, email, created_at`,
      [name.trim(), normalizedEmail, updatedHash, userId]
    );

    const updatedUser = updateRes.rows[0];
    return res.json({
      success: true,
      message: 'Profil berhasil diperbarui.',
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        createdAt: updatedUser.created_at
      }
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, error: 'Gagal memperbarui data profil.' });
  }
});

// Delete Account & Cascading Data (Multi-layer Confirmation)
router.delete('/account', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, error: 'Mohon masukkan kata sandi Anda untuk konfirmasi penghapusan.' });
    }

    const userRes = await query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Pengguna tidak ditemukan.' });
    }
    const user = userRes.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Kata sandi konfirmasi tidak sesuai. Penghapusan dibatalkan.' });
    }

    // Delete user (PostgreSQL cascade deletes all related jobs, timelines, reminders)
    await query('DELETE FROM users WHERE id = $1', [userId]);

    return res.json({
      success: true,
      message: 'Akun Anda beserta seluruh data lamaran kerja telah berhasil dihapus secara permanen.'
    });
  } catch (error: any) {
    console.error('Delete account error:', error);
    return res.status(500).json({ success: false, error: 'Gagal menghapus akun.' });
  }
});

export default router;
