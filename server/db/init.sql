-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum Types
DO $$ BEGIN
  CREATE TYPE job_status_enum AS ENUM ('wishlist', 'applied', 'assessment', 'interview', 'offer', 'rejected', 'withdrawn');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE work_type_enum AS ENUM ('Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE work_location_enum AS ENUM ('Remote', 'Hybrid', 'On-site');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE job_source_enum AS ENUM ('LinkedIn', 'JobStreet', 'Glints', 'Kalibrr', 'Website Perusahaan', 'Referral', 'Deel', 'Lainnya');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE priority_enum AS ENUM ('Low', 'Medium', 'High');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE timeline_type_enum AS ENUM ('status_change', 'interview', 'assessment', 'note', 'followup', 'created', 'applied', 'offer', 'rejected', 'withdrawn', 'wishlist');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE reminder_type_enum AS ENUM ('interview', 'assessment', 'followup', 'deadline');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 1. Table Users
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Table Job Applications
CREATE TABLE IF NOT EXISTS job_applications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name      VARCHAR(200) NOT NULL,
  company_logo      TEXT,
  position          VARCHAR(200) NOT NULL,
  status            job_status_enum NOT NULL DEFAULT 'applied',
  source            job_source_enum NOT NULL DEFAULT 'LinkedIn',
  work_type         work_type_enum NOT NULL DEFAULT 'Full-time',
  work_location     work_location_enum NOT NULL DEFAULT 'Hybrid',
  location_name     VARCHAR(200),
  salary_range      VARCHAR(200),
  job_url           TEXT,
  applied_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  deadline_date     DATE,
  priority          priority_enum NOT NULL DEFAULT 'Medium',
  notes             TEXT,
  recruiter_name    VARCHAR(100),
  recruiter_title   VARCHAR(100),
  recruiter_email   VARCHAR(255),
  recruiter_phone   VARCHAR(50),
  recruiter_linkedin TEXT,
  resume_version    VARCHAR(200),
  cover_letter      TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Table Timeline Activities
CREATE TABLE IF NOT EXISTS timeline_activities (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id     UUID NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
  date       DATE NOT NULL DEFAULT CURRENT_DATE,
  type       timeline_type_enum NOT NULL,
  title      VARCHAR(300) NOT NULL,
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Table Reminders
CREATE TABLE IF NOT EXISTS reminders (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id       UUID NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
  title        VARCHAR(300) NOT NULL,
  due_date     DATE NOT NULL,
  due_time     VARCHAR(10),
  type         reminder_type_enum NOT NULL DEFAULT 'followup',
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE reminders ADD COLUMN IF NOT EXISTS due_time VARCHAR(10);

-- Indexes for optimal querying
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_jobs_applied_date ON job_applications(applied_date);
CREATE INDEX IF NOT EXISTS idx_timeline_job_id ON timeline_activities(job_id);
CREATE INDEX IF NOT EXISTS idx_reminders_job_id ON reminders(job_id);
CREATE INDEX IF NOT EXISTS idx_reminders_due_date ON reminders(due_date);

-- Auto Update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_jobs_updated_at ON job_applications;
CREATE TRIGGER trigger_jobs_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed initial demo user and jobs if users table is empty
-- Default password for demo user is 'password123' (bcrypt hash)
INSERT INTO users (id, name, email, password_hash, created_at)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Budi Pratama',
  'budi.pratama@example.com',
  '$2b$10$pbHOxv4nzEUc3YwdAaukKes.UkzacdSMJAOZJ6ZAl6oOjFlIZQKta', -- hash for 'password123'
  '2026-01-01 08:00:00+00'
) ON CONFLICT (email) DO NOTHING;

-- Seed Sample Job Applications
INSERT INTO job_applications (
  id, user_id, company_name, company_logo, position, status, source, work_type, work_location, location_name, salary_range, job_url, applied_date, deadline_date, priority, recruiter_name, recruiter_title, recruiter_email, recruiter_phone, recruiter_linkedin, resume_version, cover_letter, notes, created_at, updated_at
) VALUES 
(
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Tokopedia',
  'https://logo.clearbit.com/tokopedia.com',
  'Senior Frontend Engineer',
  'interview',
  'LinkedIn',
  'Full-time',
  'Hybrid',
  'Jakarta Selatan',
  'Rp 22.000.000 - Rp 30.000.000 / bulan',
  'https://www.tokopedia.com/careers/job/frontend-engineer',
  '2026-07-10',
  '2026-08-05',
  'High',
  'Rina Wijaya',
  'Tech Talent Acquisition',
  'rina.wijaya@tokopedia.com',
  '+62 812-3456-7890',
  'https://linkedin.com/in/rina-wijaya-recruiter',
  'Resume_Frontend_2026_v2.pdf',
  'Saya sangat tertarik dengan posisi Senior Frontend Engineer di Tokopedia...',
  'Sudah selesai User Interview dengan VP Engineering. Menunggu panggilan HR / Management Interview pekan depan.',
  '2026-07-10 10:00:00+00',
  '2026-07-24 15:30:00+00'
),
(
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'GoTo Financial',
  'https://logo.clearbit.com/gotocompany.com',
  'Lead React Developer',
  'assessment',
  'Kalibrr',
  'Full-time',
  'Hybrid',
  'Jakarta Pusat',
  'Rp 28.000.000 - Rp 35.000.000 / bulan',
  'https://gotocompany.com/careers',
  '2026-07-15',
  '2026-08-01',
  'High',
  'Aditya Perkasa',
  'Senior Recruiter',
  'aditya.perkasa@goto.com',
  NULL,
  NULL,
  'Resume_Frontend_2026_v2.pdf',
  NULL,
  'Online coding test di HackerRank jatuh pada tanggal 1 Agustus 2026.',
  '2026-07-15 11:00:00+00',
  '2026-07-22 09:00:00+00'
),
(
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Traveloka',
  'https://logo.clearbit.com/traveloka.com',
  'Full Stack Engineer (TypeScript)',
  'offer',
  'Referral',
  'Full-time',
  'Remote',
  'Tangerang / Remote',
  'Rp 25.000.000 - Rp 32.000.000 / bulan',
  'https://traveloka.com/careers',
  '2026-06-20',
  '2026-08-03',
  'High',
  'Siti Rahmawati',
  'Talent Acquisition Partner',
  'siti.r@traveloka.com',
  NULL,
  'https://linkedin.com/in/siti-rahma',
  'Resume_Fullstack_2026.pdf',
  'Rekomendasi dari mantan kawan tim di Traveloka...',
  'Offering letter resmi sudah dikirim via email. Batas waktu konfirmasi / negosiasi akhir adalah 3 Agustus 2026.',
  '2026-06-20 08:00:00+00',
  '2026-07-28 16:00:00+00'
) ON CONFLICT (id) DO NOTHING;

-- Seed Sample Timeline
INSERT INTO timeline_activities (id, job_id, date, type, title, notes) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', '2026-07-10', 'applied', 'Lamaran Dikirim', 'Mengirimkan resume via LinkedIn Easy Apply.'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', '2026-07-14', 'assessment', 'Lolos Screening & Diberikan Take-home Assessment', 'Tugas berupa refactoring komponen React dan optimasi rendering performance.'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', '2026-07-24', 'interview', 'Technical User Interview', 'Sesi live coding 90 menit bersama Tech Lead & Engineering Manager.')
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Reminders
INSERT INTO reminders (id, job_id, title, due_date, type, is_completed) VALUES
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Follow-up HR Interview Tokopedia', '2026-08-02', 'followup', false),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Kerjakan HackerRank Assessment GoTo', '2026-08-01', 'assessment', false)
ON CONFLICT (id) DO NOTHING;
