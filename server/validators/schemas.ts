import { z } from 'zod';

export const JobStatusEnum = z.enum([
  'wishlist',
  'applied',
  'assessment',
  'interview',
  'offer',
  'rejected',
  'withdrawn'
]);

export const WorkTypeEnum = z.enum([
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Freelance'
]);

export const WorkLocationEnum = z.enum([
  'Remote',
  'Hybrid',
  'On-site'
]);

export const JobSourceEnum = z.enum([
  'LinkedIn',
  'JobStreet',
  'Glints',
  'Kalibrr',
  'Website Perusahaan',
  'Referral',
  'Deel',
  'Lainnya'
]);

export const PriorityEnum = z.enum([
  'Low',
  'Medium',
  'High'
]);

export const TimelineTypeEnum = z.enum([
  'status_change',
  'interview',
  'assessment',
  'note',
  'followup',
  'created',
  'applied',
  'offer',
  'rejected',
  'withdrawn',
  'wishlist'
]);

export const ReminderTypeEnum = z.enum([
  'interview',
  'assessment',
  'followup',
  'deadline'
]);

// Auth Schemas
export const RegisterSchema = z.object({
  name: z.string().trim().min(1, 'Nama wajib diisi').max(100, 'Nama maksimal 100 karakter'),
  email: z.string().trim().toLowerCase().email('Format email tidak valid').max(255, 'Email maksimal 255 karakter'),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter').max(100, 'Kata sandi maksimal 100 karakter')
});

export const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Format email tidak valid').max(255),
  password: z.string().min(1, 'Kata sandi wajib diisi').max(100)
});

export const ProfileUpdateSchema = z.object({
  name: z.string().trim().min(1, 'Nama wajib diisi').max(100),
  email: z.string().trim().toLowerCase().email('Format email tidak valid').max(255),
  currentPassword: z.string().max(100).optional(),
  newPassword: z.string().min(6, 'Kata sandi baru minimal 6 karakter').max(100).optional()
});

export const AccountDeleteSchema = z.object({
  password: z.string().min(1, 'Kata sandi wajib diisi').max(100)
});

// Recruiter & Document Schemas
export const RecruiterSchema = z.object({
  name: z.string().max(100).optional().nullable(),
  title: z.string().max(100).optional().nullable(),
  email: z.string().email().max(255).optional().nullable().or(z.literal('')),
  phone: z.string().max(50).optional().nullable(),
  linkedin: z.string().max(500).optional().nullable()
}).optional().nullable();

export const DocumentsSchema = z.object({
  resumeVersion: z.string().max(200).optional().nullable(),
  coverLetter: z.string().max(10000).optional().nullable()
}).optional().nullable();

// Job Schemas
export const CreateJobSchema = z.object({
  companyName: z.string().trim().min(1, 'Nama Perusahaan wajib diisi').max(200),
  companyLogo: z.string().max(1000).optional().nullable(),
  position: z.string().trim().min(1, 'Posisi wajib diisi').max(200),
  status: JobStatusEnum.default('applied'),
  source: JobSourceEnum.default('LinkedIn'),
  workType: WorkTypeEnum.default('Full-time'),
  workLocation: WorkLocationEnum.default('Hybrid'),
  locationName: z.string().max(200).optional().nullable(),
  salaryRange: z.string().max(200).optional().nullable(),
  jobUrl: z.string().max(1000).optional().nullable(),
  appliedDate: z.string().max(20).optional(),
  deadlineDate: z.string().max(20).optional().nullable(),
  priority: PriorityEnum.default('Medium'),
  notes: z.string().max(5000).optional().nullable(),
  recruiter: RecruiterSchema,
  documents: DocumentsSchema,
  initialReminderDate: z.string().max(20).optional().nullable()
});

export const UpdateJobSchema = z.object({
  companyName: z.string().trim().min(1, 'Nama Perusahaan wajib diisi').max(200),
  companyLogo: z.string().max(1000).optional().nullable(),
  position: z.string().trim().min(1, 'Posisi wajib diisi').max(200),
  status: JobStatusEnum,
  source: JobSourceEnum,
  workType: WorkTypeEnum,
  workLocation: WorkLocationEnum,
  locationName: z.string().max(200).optional().nullable(),
  salaryRange: z.string().max(200).optional().nullable(),
  jobUrl: z.string().max(1000).optional().nullable(),
  appliedDate: z.string().max(20),
  deadlineDate: z.string().max(20).optional().nullable(),
  priority: PriorityEnum,
  notes: z.string().max(5000).optional().nullable(),
  recruiter: RecruiterSchema,
  documents: DocumentsSchema
});

export const PatchStatusSchema = z.object({
  status: JobStatusEnum
});

// Reminder Schemas
export const ReminderSchema = z.object({
  title: z.string().trim().min(1, 'Judul pengingat wajib diisi').max(300),
  dueDate: z.string().trim().min(1, 'Tanggal jatuh tempo wajib diisi').max(20),
  dueTime: z.string().max(10).optional().nullable(),
  type: ReminderTypeEnum
});

// Timeline Schema
export const TimelineSchema = z.object({
  date: z.string().trim().min(1, 'Tanggal wajib diisi').max(20),
  type: TimelineTypeEnum,
  title: z.string().trim().min(1, 'Judul aktivitas wajib diisi').max(300),
  notes: z.string().max(2000).optional().nullable()
});

// Data Import Schema
export const ImportPayloadSchema = z.array(
  z.object({
    companyName: z.string().max(200).optional(),
    companyLogo: z.string().max(1000).optional().nullable(),
    position: z.string().max(200).optional(),
    status: JobStatusEnum.optional(),
    source: JobSourceEnum.optional(),
    workType: WorkTypeEnum.optional(),
    workLocation: WorkLocationEnum.optional(),
    locationName: z.string().max(200).optional().nullable(),
    salaryRange: z.string().max(200).optional().nullable(),
    jobUrl: z.string().max(1000).optional().nullable(),
    appliedDate: z.string().max(20).optional(),
    deadlineDate: z.string().max(20).optional().nullable(),
    priority: PriorityEnum.optional(),
    notes: z.string().max(5000).optional().nullable(),
    recruiter: RecruiterSchema,
    documents: DocumentsSchema,
    timeline: z.array(z.any()).optional(),
    reminders: z.array(z.any()).optional()
  })
).max(500, 'Maksimal 500 item lamaran per impor');
