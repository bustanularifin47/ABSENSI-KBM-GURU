import type { 
  User, Guru, Kelas, Siswa, MataPelajaran, JamPelajaran, 
  JadwalMengajar, Absensi, JurnalKegiatan, Nilai, Setting 
} from '@/types';

const DB_KEYS = {
  USERS: 'ejurnal_users',
  GURU: 'ejurnal_guru',
  KELAS: 'ejurnal_kelas',
  SISWA: 'ejurnal_siswa',
  MAPEL: 'ejurnal_mapel',
  JAM_PELAJARAN: 'ejurnal_jam_pelajaran',
  JADWAL: 'ejurnal_jadwal',
  ABSENSI: 'ejurnal_absensi',
  JURNAL: 'ejurnal_jurnal',
  NILAI: 'ejurnal_nilai',
  SETTING: 'ejurnal_setting',
  CURRENT_USER: 'ejurnal_current_user'
};

class Database {
  private getItem<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private setItem<T>(key: string, data: T[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
  }

  getUsers(): User[] { return this.getItem<User>(DB_KEYS.USERS); }
  getUserById(id: string): User | undefined { return this.getUsers().find(u => u.id === id); }
  getUserByUsername(username: string): User | undefined { return this.getUsers().find(u => u.username === username); }
  saveUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) users[index] = user;
    else users.push(user);
    this.setItem(DB_KEYS.USERS, users);
  }

  getGuru(): Guru[] { return this.getItem<Guru>(DB_KEYS.GURU); }
  getGuruById(id: string): Guru | undefined { return this.getGuru().find(g => g.id === id); }
  getGuruByUserId(userId: string): Guru | undefined { return this.getGuru().find(g => g.userId === userId); }
  saveGuru(guru: Guru): void {
    const list = this.getGuru();
    const index = list.findIndex(g => g.id === guru.id);
    if (index >= 0) list[index] = guru;
    else list.push(guru);
    this.setItem(DB_KEYS.GURU, list);
  }
  deleteGuru(id: string): void { this.setItem(DB_KEYS.GURU, this.getGuru().filter(g => g.id !== id)); }

  getKelas(): Kelas[] { return this.getItem<Kelas>(DB_KEYS.KELAS); }
  getKelasById(id: string): Kelas | undefined { return this.getKelas().find(k => k.id === id); }
  saveKelas(kelas: Kelas): void {
    const list = this.getKelas();
    const index = list.findIndex(k => k.id === kelas.id);
    if (index >= 0) list[index] = kelas;
    else list.push(kelas);
    this.setItem(DB_KEYS.KELAS, list);
  }
  deleteKelas(id: string): void { this.setItem(DB_KEYS.KELAS, this.getKelas().filter(k => k.id !== id)); }

  getSiswa(): Siswa[] { return this.getItem<Siswa>(DB_KEYS.SISWA); }
  getSiswaById(id: string): Siswa | undefined { return this.getSiswa().find(s => s.id === id); }
  getSiswaByKelas(kelasId: string): Siswa[] { return this.getSiswa().filter(s => s.kelasId === kelasId); }
  saveSiswa(siswa: Siswa): void {
    const list = this.getSiswa();
    const index = list.findIndex(s => s.id === siswa.id);
    if (index >= 0) list[index] = siswa;
    else list.push(siswa);
    this.setItem(DB_KEYS.SISWA, list);
  }
  deleteSiswa(id: string): void { this.setItem(DB_KEYS.SISWA, this.getSiswa().filter(s => s.id !== id)); }

  getMapel(): MataPelajaran[] { return this.getItem<MataPelajaran>(DB_KEYS.MAPEL); }
  getMapelById(id: string): MataPelajaran | undefined { return this.getMapel().find(m => m.id === id); }
  saveMapel(mapel: MataPelajaran): void {
    const list = this.getMapel();
    const index = list.findIndex(m => m.id === mapel.id);
    if (index >= 0) list[index] = mapel;
    else list.push(mapel);
    this.setItem(DB_KEYS.MAPEL, list);
  }
  deleteMapel(id: string): void { this.setItem(DB_KEYS.MAPEL, this.getMapel().filter(m => m.id !== id)); }

  getJamPelajaran(): JamPelajaran[] { return this.getItem<JamPelajaran>(DB_KEYS.JAM_PELAJARAN).sort((a, b) => a.jamKe - b.jamKe); }
  saveJamPelajaran(jam: JamPelajaran): void {
    const list = this.getJamPelajaran();
    const index = list.findIndex(j => j.id === jam.id);
    if (index >= 0) list[index] = jam;
    else list.push(jam);
    this.setItem(DB_KEYS.JAM_PELAJARAN, list);
  }
  deleteJamPelajaran(id: string): void { this.setItem(DB_KEYS.JAM_PELAJARAN, this.getJamPelajaran().filter(j => j.id !== id)); }

  getJadwal(): JadwalMengajar[] { return this.getItem<JadwalMengajar>(DB_KEYS.JADWAL); }
  getJadwalByGuru(guruId: string): JadwalMengajar[] { return this.getJadwal().filter(j => j.guruId === guruId); }
  saveJadwal(jadwal: JadwalMengajar): void {
    const list = this.getJadwal();
    const index = list.findIndex(j => j.id === jadwal.id);
    if (index >= 0) list[index] = jadwal;
    else list.push(jadwal);
    this.setItem(DB_KEYS.JADWAL, list);
  }
  deleteJadwal(id: string): void { this.setItem(DB_KEYS.JADWAL, this.getJadwal().filter(j => j.id !== id)); }

  getAbsensi(): Absensi[] { return this.getItem<Absensi>(DB_KEYS.ABSENSI); }
  getAbsensiByGuru(guruId: string): Absensi[] { return this.getAbsensi().filter(a => a.guruId === guruId); }
  saveAbsensi(absensi: Absensi): void {
    const list = this.getAbsensi();
    const index = list.findIndex(a => a.id === absensi.id);
    if (index >= 0) list[index] = absensi;
    else list.push(absensi);
    this.setItem(DB_KEYS.ABSENSI, list);
  }

  getJurnal(): JurnalKegiatan[] { return this.getItem<JurnalKegiatan>(DB_KEYS.JURNAL); }
  getJurnalByGuru(guruId: string): JurnalKegiatan[] { return this.getJurnal().filter(j => j.guruId === guruId); }
  saveJurnal(jurnal: JurnalKegiatan): void {
    const list = this.getJurnal();
    const index = list.findIndex(j => j.id === jurnal.id);
    if (index >= 0) list[index] = jurnal;
    else list.push(jurnal);
    this.setItem(DB_KEYS.JURNAL, list);
  }

  getNilai(): Nilai[] { return this.getItem<Nilai>(DB_KEYS.NILAI); }
  saveNilai(nilai: Nilai): void {
    const list = this.getNilai();
    const index = list.findIndex(n => n.id === nilai.id);
    if (index >= 0) list[index] = nilai;
    else list.push(nilai);
    this.setItem(DB_KEYS.NILAI, list);
  }

  getSetting(): Setting {
    if (typeof window === 'undefined') return this.getDefaultSetting();
    const setting = localStorage.getItem(DB_KEYS.SETTING);
    return setting ? JSON.parse(setting) : this.getDefaultSetting();
  }
  saveSetting(setting: Setting): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(DB_KEYS.SETTING, JSON.stringify(setting));
  }
  private getDefaultSetting(): Setting {
    return {
      id: '1',
      namaSekolah: 'SMK Negeri 1 Tekung',
      deskripsiAplikasi: 'Sistem E-Jurnal dan Absensi KBM Guru',
      tahunAjaranDefault: '2024/2025',
      semesterDefault: 'Ganjil',
      updatedAt: new Date().toISOString()
    };
  }

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(DB_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  }
  setCurrentUser(user: User | null): void {
    if (typeof window === 'undefined') return;
    if (user) localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user));
    else localStorage.removeItem(DB_KEYS.CURRENT_USER);
  }

  initializeDefaultData(): void {
    if (typeof window === 'undefined') return;
    const users = this.getUsers();
    if (users.length === 0) {
      const adminUser: User = {
        id: 'admin-1', username: 'admin', password: 'admin123', role: 'admin',
        nama: 'Administrator', email: 'admin@smkn1tekung.sch.id', createdAt: new Date().toISOString()
      };
      this.saveUser(adminUser);

      const guruUser: User = {
        id: 'guru-user-1', username: 'guru', password: 'guru123', role: 'guru',
        nama: 'Budi Santoso, S.Pd.', email: 'budi@smkn1tekung.sch.id', createdAt: new Date().toISOString()
      };
      this.saveUser(guruUser);

      const guru: Guru = {
        id: 'guru-1', userId: 'guru-user-1', nip: '198501152010011002',
        nama: 'Budi Santoso, S.Pd.', email: 'budi@smkn1tekung.sch.id',
        jenisKelamin: 'L', status: 'aktif', createdAt: new Date().toISOString()
      };
      this.saveGuru(guru);

      const defaultJam = [
        { id: 'jam-1', jamKe: 1, jamMulai: '07:00', jamSelesai: '07:45', createdAt: new Date().toISOString() },
        { id: 'jam-2', jamKe: 2, jamMulai: '07:45', jamSelesai: '08:30', createdAt: new Date().toISOString() },
        { id: 'jam-3', jamKe: 3, jamMulai: '08:30', jamSelesai: '09:15', createdAt: new Date().toISOString() },
        { id: 'jam-4', jamKe: 4, jamMulai: '09:15', jamSelesai: '10:00', createdAt: new Date().toISOString() },
        { id: 'jam-5', jamKe: 5, jamMulai: '10:15', jamSelesai: '11:00', createdAt: new Date().toISOString() },
        { id: 'jam-6', jamKe: 6, jamMulai: '11:00', jamSelesai: '11:45', createdAt: new Date().toISOString() },
        { id: 'jam-7', jamKe: 7, jamMulai: '11:45', jamSelesai: '12:30', createdAt: new Date().toISOString() },
        { id: 'jam-8', jamKe: 8, jamMulai: '12:30', jamSelesai: '13:15', createdAt: new Date().toISOString() },
        { id: 'jam-9', jamKe: 9, jamMulai: '13:15', jamSelesai: '14:00', createdAt: new Date().toISOString() },
        { id: 'jam-10', jamKe: 10, jamMulai: '14:00', jamSelesai: '14:45', createdAt: new Date().toISOString() }
      ];
      defaultJam.forEach(j => this.saveJamPelajaran(j));

      this.saveSetting(this.getDefaultSetting());
    }
  }
}

export const db = new Database();
