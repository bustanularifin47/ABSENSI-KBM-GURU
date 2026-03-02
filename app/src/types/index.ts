// User Types
export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'guru';
  nama: string;
  email?: string;
  createdAt: string;
}

// Guru Types
export interface Guru {
  id: string;
  userId: string;
  nip: string;
  nama: string;
  email: string;
  noTelepon?: string;
  alamat?: string;
  jenisKelamin: 'L' | 'P';
  tanggalLahir?: string;
  pendidikan?: string;
  status: 'aktif' | 'nonaktif';
  createdAt: string;
}

// Kelas Types
export interface Kelas {
  id: string;
  nama: string;
  tingkat: 'X' | 'XI' | 'XII';
  jurusan?: string;
  tahunAjaran: string;
  waliKelasId?: string;
  waliKelasNama?: string;
  jumlahSiswa: number;
  createdAt: string;
}

// Siswa Types
export interface Siswa {
  id: string;
  nis: string;
  nama: string;
  kelasId: string;
  kelasNama?: string;
  jenisKelamin: 'L' | 'P';
  tanggalLahir?: string;
  alamat?: string;
  noTelepon?: string;
  namaOrtu?: string;
  status: 'aktif' | 'nonaktif' | 'lulus';
  createdAt: string;
}

// Mata Pelajaran Types
export interface MataPelajaran {
  id: string;
  kode: string;
  nama: string;
  deskripsi?: string;
  kelompok?: string;
  createdAt: string;
}

// Jam Pelajaran Types
export interface JamPelajaran {
  id: string;
  jamKe: number;
  jamMulai: string;
  jamSelesai: string;
  createdAt: string;
}

// Jadwal Mengajar Types
export interface JadwalMengajar {
  id: string;
  guruId: string;
  guruNama?: string;
  kelasId: string;
  kelasNama?: string;
  mapelId: string;
  mapelNama?: string;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  jamMulaiKe: number;
  jamSelesaiKe: number;
  ruangan?: string;
  tahunAjaran: string;
  semester: 'Ganjil' | 'Genap';
  createdAt: string;
}

// Absensi Types
export interface Absensi {
  id: string;
  guruId: string;
  guruNama?: string;
  jadwalId: string;
  kelasId: string;
  kelasNama?: string;
  mapelId: string;
  mapelNama?: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai?: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alpha';
  keterangan?: string;
  fotoSelfie?: string;
  lokasi?: {
    latitude: number;
    longitude: number;
    alamat?: string;
  };
  createdAt: string;
}

// Jurnal Kegiatan Types
export interface JurnalKegiatan {
  id: string;
  absensiId: string;
  guruId: string;
  kelasId: string;
  kelasNama?: string;
  mapelId: string;
  mapelNama?: string;
  tanggal: string;
  materi: string;
  deskripsiKegiatan: string;
  siswaTidakHadir: string[];
  jumlahSiswaHadir: number;
  jumlahSiswaTidakHadir: number;
  createdAt: string;
}

// Nilai Types
export interface Nilai {
  id: string;
  siswaId: string;
  siswaNama?: string;
  kelasId: string;
  mapelId: string;
  guruId: string;
  jenis: 'harian' | 'ulangan' | 'tugas' | 'uts' | 'uas' | 'semester';
  nilai: number;
  kkm?: number;
  semester: 'Ganjil' | 'Genap';
  tahunAjaran: string;
  keterangan?: string;
  createdAt: string;
}

// Setting Types
export interface Setting {
  id: string;
  namaSekolah: string;
  logoSekolah?: string;
  alamatSekolah?: string;
  teleponSekolah?: string;
  emailSekolah?: string;
  deskripsiAplikasi: string;
  tahunAjaranDefault: string;
  semesterDefault: 'Ganjil' | 'Genap';
  updatedAt: string;
}
