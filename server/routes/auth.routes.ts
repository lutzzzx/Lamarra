import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { query } from '../db/pool.js';
import { authenticateToken, getJwtSecret, AuthRequest } from '../middleware/auth.js';
import {
  RegisterSchema,
  LoginSchema,
  ProfileUpdateSchema,
  AccountDeleteSchema
} from '../validators/schemas.js';

const router = Router();
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Rate Limiter for Authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Terlalu banyak percobaan autentikasi dari IP ini. Silakan coba lagi dalam 15 menit.'
  }
});

// Helper to set HttpOnly Cookie
function setAuthCookie(res: Response, token: string) {
  res.cookie('lamarra_auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
}

// Register User with Password
router.post('/register', authLimiter, async (req, res) => {
  try {
    const parseResult = RegisterSchema.safeParse(req.body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || 'Data registrasi tidak valid.';
      return res.status(400).json({ success: false, error: firstError });
    }

    const { name, email, password } = parseResult.data;

    // Check existing email
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
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
      [name, email, passwordHash]
    );

    const user = result.rows[0];

    // Generate JWT
    const secret = getJwtSecret();
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      secret,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    setAuthCookie(res, token);

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
router.post('/login', authLimiter, async (req, res) => {
  try {
    const parseResult = LoginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, error: 'Email atau kata sandi tidak valid.' });
    }

    const { email, password } = parseResult.data;

    // Unified error message to prevent Account Enumeration (H-02)
    const GENERIC_AUTH_ERROR = 'Email atau kata sandi tidak valid.';

    // Find user
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: GENERIC_AUTH_ERROR });
    }

    const user = result.rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: GENERIC_AUTH_ERROR });
    }

    // Generate JWT
    const secret = getJwtSecret();
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      secret,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    setAuthCookie(res, token);

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

// Logout User (Clear Cookie)
router.post('/logout', (req, res) => {
  res.clearCookie('lamarra_auth', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
  return res.json({ success: true, message: 'Berhasil keluar.' });
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
    const parseResult = ProfileUpdateSchema.safeParse(req.body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || 'Data profil tidak valid.';
      return res.status(400).json({ success: false, error: firstError });
    }

    const { name, email, currentPassword, newPassword } = parseResult.data;

    // Check user existing record
    const userRes = await query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Pengguna tidak ditemukan.' });
    }
    const currentUser = userRes.rows[0];

    // Check email uniqueness if changed
    if (email !== currentUser.email) {
      const emailCheck = await query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, userId]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ success: false, error: 'Email tersebut sudah digunakan oleh akun lain.' });
      }
    }

    let updatedHash = null;
    if (newPassword) {
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
      [name, email, updatedHash, userId]
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

// Delete Account & Cascading Data
router.delete('/account', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const parseResult = AccountDeleteSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, error: 'Mohon masukkan kata sandi Anda untuk konfirmasi penghapusan.' });
    }

    const { password } = parseResult.data;

    const userRes = await query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Pengguna tidak ditemukan.' });
    }
    const user = userRes.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Kata sandi konfirmasi tidak sesuai. Penghapusan dibatalkan.' });
    }

    // Delete user
    await query('DELETE FROM users WHERE id = $1', [userId]);

    res.clearCookie('lamarra_auth');
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
