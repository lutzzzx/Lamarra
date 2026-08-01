import { JobApplication, User } from '../types';

export const DEMO_USER: User = {
  id: 'usr_demo_101',
  name: 'Budi Pratama',
  email: 'budi.pratama@example.com',
  createdAt: '2026-01-01T08:00:00Z'
};

export const INITIAL_JOBS: JobApplication[] = [
  {
    id: 'job_001',
    userId: 'usr_demo_101',
    companyName: 'Tokopedia',
    position: 'Senior Frontend Engineer',
    status: 'interview',
    source: 'LinkedIn',
    workType: 'Full-time',
    workLocation: 'Hybrid',
    locationName: 'Jakarta Selatan',
    salaryRange: 'Rp 22.000.000 - Rp 30.000.000 / bulan',
    jobUrl: 'https://www.tokopedia.com/careers/job/frontend-engineer',
    appliedDate: '2026-07-10',
    deadlineDate: '2026-08-05',
    priority: 'High',
    recruiter: {
      name: 'Rina Wijaya',
      title: 'Tech Talent Acquisition',
      email: 'rina.wijaya@tokopedia.com',
      phone: '+62 812-3456-7890',
      linkedin: 'https://linkedin.com/in/rina-wijaya-recruiter'
    },
    documents: {
      resumeVersion: 'Resume_Frontend_2026_v2.pdf',
      coverLetter: 'Saya sangat tertarik dengan posisi Senior Frontend Engineer di Tokopedia karena pengalaman saya selama 4 tahun membangun aplikasi e-commerce berskala tinggi...',
      notes: 'Disarankan mempelajari Next.js SSR, Web Vitals optimization, dan micro-frontend design patterns.'
    },
    notes: 'Sudah selesai User Interview dengan VP Engineering. Menunggu panggilan HR / Management Interview pekan depan.',
    timeline: [
      {
        id: 'tl_001',
        date: '2026-07-10',
        type: 'applied',
        title: 'Lamaran Dikirim',
        notes: 'Mengirimkan resume via LinkedIn Easy Apply.'
      },
      {
        id: 'tl_002',
        date: '2026-07-14',
        type: 'assessment',
        title: 'Lolos Screening & Diberikan Take-home Assessment',
        notes: 'Tugas berupa refactoring komponen React dan optimasi rendering performance.'
      },
      {
        id: 'tl_003',
        date: '2026-07-18',
        type: 'assessment',
        title: 'Mengirimkan Hasil Assessment',
        notes: 'Selesai tepat waktu. Link repository GitHub dikirim ke recruiter.'
      },
      {
        id: 'tl_004',
        date: '2026-07-24',
        type: 'interview',
        title: 'Technical User Interview',
        notes: 'Sesi live coding 90 menit bersama Tech Lead & Engineering Manager.'
      }
    ],
    reminders: [
      {
        id: 'rem_001',
        jobId: 'job_001',
        title: 'Follow-up HR Interview Tokopedia',
        dueDate: '2026-08-02',
        type: 'followup',
        isCompleted: false,
        jobTitle: 'Senior Frontend Engineer',
        companyName: 'Tokopedia'
      }
    ],
    createdAt: '2026-07-10T10:00:00Z',
    updatedAt: '2026-07-24T15:30:00Z'
  },
  {
    id: 'job_002',
    userId: 'usr_demo_101',
    companyName: 'GoTo Financial',
    position: 'Lead React Developer',
    status: 'assessment',
    source: 'Kalibrr',
    workType: 'Full-time',
    workLocation: 'Hybrid',
    locationName: 'Jakarta Pusat',
    salaryRange: 'Rp 28.000.000 - Rp 35.000.000 / bulan',
    jobUrl: 'https://gotocompany.com/careers',
    appliedDate: '2026-07-15',
    deadlineDate: '2026-08-01',
    priority: 'High',
    recruiter: {
      name: 'Aditya Perkasa',
      title: 'Senior Recruiter',
      email: 'aditya.perkasa@goto.com'
    },
    documents: {
      resumeVersion: 'Resume_Frontend_2026_v2.pdf',
      notes: 'Fokus pada sistem pembayaran FinTech dan keamanan transaksi.'
    },
    notes: 'Online coding test di HackerRank jatuh pada tanggal 1 Agustus 2026.',
    timeline: [
      {
        id: 'tl_010',
        date: '2026-07-15',
        type: 'applied',
        title: 'Submit Application via Kalibrr'
      },
      {
        id: 'tl_011',
        date: '2026-07-22',
        type: 'assessment',
        title: 'Undangan Online Coding Assessment',
        notes: 'Ujian durasi 120 menit mencakup Algoritma, Data Structure, dan React Hooks Optimization.'
      }
    ],
    reminders: [
      {
        id: 'rem_002',
        jobId: 'job_002',
        title: 'Kerjakan HackerRank Assessment GoTo',
        dueDate: '2026-08-01',
        type: 'assessment',
        isCompleted: false,
        jobTitle: 'Lead React Developer',
        companyName: 'GoTo Financial'
      }
    ],
    createdAt: '2026-07-15T11:00:00Z',
    updatedAt: '2026-07-22T09:00:00Z'
  },
  {
    id: 'job_003',
    userId: 'usr_demo_101',
    companyName: 'Traveloka',
    position: 'Full Stack Engineer (TypeScript)',
    status: 'offer',
    source: 'Referral',
    workType: 'Full-time',
    workLocation: 'Remote',
    locationName: 'Tangerang / Remote',
    salaryRange: 'Rp 25.000.000 - Rp 32.000.000 / bulan',
    jobUrl: 'https://traveloka.com/careers',
    appliedDate: '2026-06-20',
    deadlineDate: '2026-08-03',
    priority: 'High',
    recruiter: {
      name: 'Siti Rahmawati',
      title: 'Talent Acquisition Partner',
      email: 'siti.r@traveloka.com',
      linkedin: 'https://linkedin.com/in/siti-rahma'
    },
    documents: {
      resumeVersion: 'Resume_Fullstack_2026.pdf',
      coverLetter: 'Rekomendasi dari mantan kawan tim di Traveloka...'
    },
    notes: 'Offering letter resmi sudah dikirim via email. Batas waktu konfirmasi / negosiasi akhir adalah 3 Agustus 2026.',
    timeline: [
      {
        id: 'tl_020',
        date: '2026-06-20',
        type: 'applied',
        title: 'Lamaran Dikirim via Referral Employee'
      },
      {
        id: 'tl_021',
        date: '2026-07-02',
        type: 'interview',
        title: 'Initial HR Screening & Technical Interview'
      },
      {
        id: 'tl_022',
        date: '2026-07-12',
        type: 'interview',
        title: 'System Design Interview & Culture Fit'
      },
      {
        id: 'tl_023',
        date: '2026-07-28',
        type: 'offer',
        title: 'Offering Letter Diterima',
        notes: 'Paket benefit mencakup asuransi kesehatan swasta, insentif harian, dan modal kerja remote.'
      }
    ],
    reminders: [
      {
        id: 'rem_003',
        jobId: 'job_003',
        title: 'Batas Akhir Respon Offering Traveloka',
        dueDate: '2026-08-03',
        type: 'deadline',
        isCompleted: false,
        jobTitle: 'Full Stack Engineer (TypeScript)',
        companyName: 'Traveloka'
      }
    ],
    createdAt: '2026-06-20T08:00:00Z',
    updatedAt: '2026-07-28T16:00:00Z'
  },
  {
    id: 'job_004',
    userId: 'usr_demo_101',
    companyName: 'Bank Mandiri (Digital Banking)',
    position: 'Frontend Specialist',
    status: 'applied',
    source: 'JobStreet',
    workType: 'Contract',
    workLocation: 'On-site',
    locationName: 'Jakarta Selatan',
    salaryRange: 'Rp 18.000.000 - Rp 23.000.000 / bulan',
    jobUrl: 'https://jobstreet.co.id',
    appliedDate: '2026-07-25',
    priority: 'Medium',
    recruiter: {
      name: 'Bambang Sudirman',
      email: 'recruitment.digital@bankmandiri.co.id'
    },
    documents: {
      resumeVersion: 'Resume_Frontend_2026_v2.pdf'
    },
    notes: 'Kontrak 12 bulan dengan kemungkinan konfirmasi pegawai tetap. Menunggu tanggapan awal.',
    timeline: [
      {
        id: 'tl_030',
        date: '2026-07-25',
        type: 'applied',
        title: 'Lamaran Dikirim via JobStreet'
      }
    ],
    reminders: [],
    createdAt: '2026-07-25T14:00:00Z',
    updatedAt: '2026-07-25T14:00:00Z'
  },
  {
    id: 'job_005',
    userId: 'usr_demo_101',
    companyName: 'Grab Indonesia',
    position: 'UI/UX Frontend Developer',
    status: 'wishlist',
    source: 'LinkedIn',
    workType: 'Full-time',
    workLocation: 'Hybrid',
    locationName: 'Jakarta Selatan',
    salaryRange: 'Rp 20.000.000 - Rp 26.000.000 / bulan',
    jobUrl: 'https://grab.careers',
    appliedDate: '2026-07-30',
    deadlineDate: '2026-08-15',
    priority: 'Medium',
    notes: 'Lowongan baru saja dibuka kemarin. Perlu menyesuaikan portofolio sebelum apply.',
    timeline: [
      {
        id: 'tl_040',
        date: '2026-07-30',
        type: 'created',
        title: 'Disimpan ke Wishlist',
        notes: 'Mempersiapkan portofolio studi kasus UI/UX React.'
      }
    ],
    reminders: [
      {
        id: 'rem_004',
        jobId: 'job_005',
        title: 'Submit Lamaran ke Grab Indonesia',
        dueDate: '2026-08-04',
        type: 'deadline',
        isCompleted: false,
        jobTitle: 'UI/UX Frontend Developer',
        companyName: 'Grab Indonesia'
      }
    ],
    createdAt: '2026-07-30T09:00:00Z',
    updatedAt: '2026-07-30T09:00:00Z'
  },
  {
    id: 'job_006',
    userId: 'usr_demo_101',
    companyName: 'Bukalapak',
    position: 'Software Engineer - Web',
    status: 'rejected',
    source: 'Website Perusahaan',
    workType: 'Full-time',
    workLocation: 'Hybrid',
    locationName: 'Jakarta Selatan',
    salaryRange: 'Rp 18.000.000 - Rp 24.000.000',
    jobUrl: 'https://careers.bukalapak.com',
    appliedDate: '2026-06-01',
    priority: 'Low',
    notes: 'Menerima email penolakan standar dari tim Talent Acquisition karena kualifikasi senioritas di fokus backend.',
    timeline: [
      {
        id: 'tl_050',
        date: '2026-06-01',
        type: 'applied',
        title: 'Submit Application'
      },
      {
        id: 'tl_051',
        date: '2026-06-15',
        type: 'status_change',
        title: 'Kualifikasi tidak sesuai kriteria saat ini',
        notes: 'Pesan penolakan diterima via email.'
      }
    ],
    reminders: [],
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-06-15T11:00:00Z'
  },
  {
    id: 'job_007',
    userId: 'usr_demo_101',
    companyName: 'Supabase (US Remote)',
    position: 'Frontend Engineer (React / Next.js)',
    status: 'applied',
    source: 'Deel',
    workType: 'Full-time',
    workLocation: 'Remote',
    locationName: 'Global Remote',
    salaryRange: '$4,000 - $6,000 / bulan',
    jobUrl: 'https://supabase.com/careers',
    appliedDate: '2026-07-28',
    deadlineDate: '2026-08-20',
    priority: 'High',
    recruiter: {
      name: 'David Miller',
      email: 'careers@supabase.io'
    },
    documents: {
      resumeVersion: 'Resume_Global_English_2026.pdf',
      coverLetter: 'I have been using Supabase for 2+ years in production React applications...'
    },
    notes: 'Posisi fully remote dibayar via Deel dalam USD.',
    timeline: [
      {
        id: 'tl_060',
        date: '2026-07-28',
        type: 'applied',
        title: 'Applied on Supabase Careers Page'
      }
    ],
    reminders: [],
    createdAt: '2026-07-28T18:00:00Z',
    updatedAt: '2026-07-28T18:00:00Z'
  }
];
