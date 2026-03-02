import { useState, useEffect } from 'react'
import { db } from './data/db'
import type { User } from './types'

// Initialize data
db.initializeDefaultData()

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const currentUser = db.getCurrentUser()
    if (currentUser) setUser(currentUser)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const foundUser = db.getUserByUsername(username)
    if (foundUser && foundUser.password === password) {
      db.setCurrentUser(foundUser)
      setUser(foundUser)
      setError('')
    } else {
      setError('Username atau password salah')
    }
  }

  const handleLogout = () => {
    db.setCurrentUser(null)
    setUser(null)
    setUsername('')
    setPassword('')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">E-Jurnal & Absensi</h1>
            <p className="text-gray-600">SMK Negeri 1 Tekung</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Masuk
            </button>
          </form>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
            <p className="font-medium">Demo Account:</p>
            <p>Admin: admin / admin123</p>
            <p>Guru: guru / guru123</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">E-Jurnal & Absensi</h1>
            <p className="text-sm text-slate-400">SMK Negeri 1 Tekung</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">{user.nama}</span>
            <span className="bg-blue-600 px-2 py-1 rounded text-xs">{user.role}</span>
            <button
              onClick={handleLogout}
              className="text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded transition-colors"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {user.role === 'admin' ? <AdminDashboard /> : <GuruDashboard />}
      </main>
    </div>
  )
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [guru, setGuru] = useState(db.getGuru())
  const [kelas, setKelas] = useState(db.getKelas())
  const [siswa, setSiswa] = useState(db.getSiswa())
  const [mapel, setMapel] = useState(db.getMapel())
  const [jadwal, setJadwal] = useState(db.getJadwal())

  const stats = {
    totalGuru: guru.length,
    totalKelas: kelas.length,
    totalSiswa: siswa.length,
    totalMapel: mapel.length,
    totalJadwal: jadwal.length
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Dashboard Admin</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="Total Guru" value={stats.totalGuru} color="bg-blue-500" />
              <StatCard title="Total Kelas" value={stats.totalKelas} color="bg-emerald-500" />
              <StatCard title="Total Siswa" value={stats.totalSiswa} color="bg-violet-500" />
              <StatCard title="Mata Pelajaran" value={stats.totalMapel} color="bg-amber-500" />
            </div>
          </div>
        )
      case 'guru':
        return <GuruManager guru={guru} setGuru={setGuru} />
      case 'kelas':
        return <KelasManager kelas={kelas} setKelas={setKelas} />
      case 'siswa':
        return <SiswaManager siswa={siswa} setSiswa={setSiswa} kelas={kelas} />
      case 'mapel':
        return <MapelManager mapel={mapel} setMapel={setMapel} />
      case 'jadwal':
        return <JadwalManager jadwal={jadwal} setJadwal={setJadwal} guru={guru} kelas={kelas} mapel={mapel} />
      default:
        return <div>Fitur dalam pengembangan</div>
    }
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'guru', label: 'Manajemen Guru' },
    { id: 'kelas', label: 'Manajemen Kelas' },
    { id: 'siswa', label: 'Input Siswa' },
    { id: 'mapel', label: 'Mata Pelajaran' },
    { id: 'jadwal', label: 'Jadwal Mengajar' },
  ]

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar */}
      <nav className="w-full md:w-64 space-y-1">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
        {renderContent()}
      </div>
    </div>
  )
}

function GuruManager({ guru, setGuru }: { guru: any[], setGuru: (g: any[]) => void }) {
  const [form, setForm] = useState({ nip: '', nama: '', email: '', jenisKelamin: 'L' as 'L' | 'P' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newGuru = {
      id: `guru-${Date.now()}`,
      userId: `user-${Date.now()}`,
      ...form,
      status: 'aktif',
      createdAt: new Date().toISOString()
    }
    db.saveGuru(newGuru)
    
    // Create user for guru
    db.saveUser({
      id: newGuru.userId,
      username: form.nip,
      password: form.nip,
      role: 'guru',
      nama: form.nama,
      email: form.email,
      createdAt: new Date().toISOString()
    })
    
    setGuru(db.getGuru())
    setForm({ nip: '', nama: '', email: '', jenisKelamin: 'L' })
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Manajemen Guru</h3>
      
      <form onSubmit={handleSubmit} className="grid md:grid-cols-4 gap-4">
        <input
          placeholder="NIP"
          value={form.nip}
          onChange={e => setForm({...form, nip: e.target.value})}
          className="px-3 py-2 border rounded-lg"
          required
        />
        <input
          placeholder="Nama"
          value={form.nama}
          onChange={e => setForm({...form, nama: e.target.value})}
          className="px-3 py-2 border rounded-lg"
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={e => setForm({...form, email: e.target.value})}
          className="px-3 py-2 border rounded-lg"
          required
        />
        <select
          value={form.jenisKelamin}
          onChange={e => setForm({...form, jenisKelamin: e.target.value as 'L' | 'P'})}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>
        <button type="submit" className="md:col-span-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Tambah Guru
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">NIP</th>
              <th className="px-4 py-2 text-left">Nama</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {guru.map(g => (
              <tr key={g.id} className="border-t">
                <td className="px-4 py-2">{g.nip}</td>
                <td className="px-4 py-2">{g.nama}</td>
                <td className="px-4 py-2">{g.email}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs ${g.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                    {g.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function KelasManager({ kelas, setKelas }: { kelas: any[], setKelas: (k: any[]) => void }) {
  const [form, setForm] = useState({ nama: '', tingkat: 'X' as 'X' | 'XI' | 'XII', tahunAjaran: '2024/2025' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newKelas = {
      id: `kelas-${Date.now()}`,
      ...form,
      jumlahSiswa: 0,
      createdAt: new Date().toISOString()
    }
    db.saveKelas(newKelas)
    setKelas(db.getKelas())
    setForm({ nama: '', tingkat: 'X', tahunAjaran: '2024/2025' })
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Manajemen Kelas</h3>
      
      <form onSubmit={handleSubmit} className="flex gap-4">
        <select
          value={form.tingkat}
          onChange={e => setForm({...form, tingkat: e.target.value as 'X' | 'XI' | 'XII'})}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="X">X</option>
          <option value="XI">XI</option>
          <option value="XII">XII</option>
        </select>
        <input
          placeholder="Nama Kelas"
          value={form.nama}
          onChange={e => setForm({...form, nama: e.target.value})}
          className="flex-1 px-3 py-2 border rounded-lg"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Tambah
        </button>
      </form>

      <div className="grid md:grid-cols-3 gap-4">
        {kelas.map(k => (
          <div key={k.id} className="border rounded-lg p-4">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Kelas {k.tingkat}</span>
            <h4 className="text-lg font-semibold mt-2">{k.nama}</h4>
            <p className="text-sm text-gray-600">{k.jumlahSiswa} siswa</p>
            <p className="text-xs text-gray-500">TA {k.tahunAjaran}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SiswaManager({ siswa, setSiswa, kelas }: { siswa: any[], setSiswa: (s: any[]) => void, kelas: any[] }) {
  const [form, setForm] = useState({ nis: '', nama: '', kelasId: '', jenisKelamin: 'L' as 'L' | 'P' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newSiswa = {
      id: `siswa-${Date.now()}`,
      ...form,
      status: 'aktif',
      createdAt: new Date().toISOString()
    }
    db.saveSiswa(newSiswa)
    
    // Update jumlah siswa in kelas
    const k = db.getKelasById(form.kelasId)
    if (k) {
      k.jumlahSiswa = db.getSiswaByKelas(form.kelasId).length
      db.saveKelas(k)
    }
    
    setSiswa(db.getSiswa())
    setForm({ nis: '', nama: '', kelasId: '', jenisKelamin: 'L' })
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Input Siswa</h3>
      
      <form onSubmit={handleSubmit} className="grid md:grid-cols-5 gap-4">
        <input
          placeholder="NIS"
          value={form.nis}
          onChange={e => setForm({...form, nis: e.target.value})}
          className="px-3 py-2 border rounded-lg"
          required
        />
        <input
          placeholder="Nama"
          value={form.nama}
          onChange={e => setForm({...form, nama: e.target.value})}
          className="md:col-span-2 px-3 py-2 border rounded-lg"
          required
        />
        <select
          value={form.kelasId}
          onChange={e => setForm({...form, kelasId: e.target.value})}
          className="px-3 py-2 border rounded-lg"
          required
        >
          <option value="">Pilih Kelas</option>
          {kelas.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
        </select>
        <select
          value={form.jenisKelamin}
          onChange={e => setForm({...form, jenisKelamin: e.target.value as 'L' | 'P'})}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>
        <button type="submit" className="md:col-span-5 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Tambah Siswa
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">NIS</th>
              <th className="px-4 py-2 text-left">Nama</th>
              <th className="px-4 py-2 text-left">Kelas</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {siswa.map(s => (
              <tr key={s.id} className="border-t">
                <td className="px-4 py-2">{s.nis}</td>
                <td className="px-4 py-2">{s.nama}</td>
                <td className="px-4 py-2">{kelas.find(k => k.id === s.kelasId)?.nama}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs ${s.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MapelManager({ mapel, setMapel }: { mapel: any[], setMapel: (m: any[]) => void }) {
  const [form, setForm] = useState({ kode: '', nama: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newMapel = {
      id: `mapel-${Date.now()}`,
      ...form,
      createdAt: new Date().toISOString()
    }
    db.saveMapel(newMapel)
    setMapel(db.getMapel())
    setForm({ kode: '', nama: '' })
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Mata Pelajaran</h3>
      
      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          placeholder="Kode"
          value={form.kode}
          onChange={e => setForm({...form, kode: e.target.value})}
          className="w-32 px-3 py-2 border rounded-lg"
          required
        />
        <input
          placeholder="Nama Mata Pelajaran"
          value={form.nama}
          onChange={e => setForm({...form, nama: e.target.value})}
          className="flex-1 px-3 py-2 border rounded-lg"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Tambah
        </button>
      </form>

      <div className="grid md:grid-cols-3 gap-4">
        {mapel.map(m => (
          <div key={m.id} className="border rounded-lg p-4 bg-amber-50">
            <span className="text-amber-700 text-sm font-medium">{m.kode}</span>
            <h4 className="text-lg font-semibold">{m.nama}</h4>
          </div>
        ))}
      </div>
    </div>
  )
}

function JadwalManager({ jadwal, setJadwal, guru, kelas, mapel }: { jadwal: any[], setJadwal: (j: any[]) => void, guru: any[], kelas: any[], mapel: any[] }) {
  const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const [form, setForm] = useState({
    guruId: '', kelasId: '', mapelId: '', hari: 'Senin', jamMulaiKe: 1, jamSelesaiKe: 2
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newJadwal = {
      id: `jadwal-${Date.now()}`,
      ...form,
      tahunAjaran: '2024/2025',
      semester: 'Ganjil',
      createdAt: new Date().toISOString()
    }
    db.saveJadwal(newJadwal)
    setJadwal(db.getJadwal())
    setForm({ guruId: '', kelasId: '', mapelId: '', hari: 'Senin', jamMulaiKe: 1, jamSelesaiKe: 2 })
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Jadwal Mengajar</h3>
      
      <form onSubmit={handleSubmit} className="grid md:grid-cols-6 gap-4">
        <select value={form.guruId} onChange={e => setForm({...form, guruId: e.target.value})} className="px-3 py-2 border rounded-lg" required>
          <option value="">Pilih Guru</option>
          {guru.map(g => <option key={g.id} value={g.id}>{g.nama}</option>)}
        </select>
        <select value={form.kelasId} onChange={e => setForm({...form, kelasId: e.target.value})} className="px-3 py-2 border rounded-lg" required>
          <option value="">Pilih Kelas</option>
          {kelas.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
        </select>
        <select value={form.mapelId} onChange={e => setForm({...form, mapelId: e.target.value})} className="px-3 py-2 border rounded-lg" required>
          <option value="">Pilih Mapel</option>
          {mapel.map(m => <option key={m.id} value={m.id}>{m.nama}</option>)}
        </select>
        <select value={form.hari} onChange={e => setForm({...form, hari: e.target.value})} className="px-3 py-2 border rounded-lg">
          {hariList.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
        <select value={form.jamMulaiKe} onChange={e => setForm({...form, jamMulaiKe: parseInt(e.target.value)})} className="px-3 py-2 border rounded-lg">
          {[1,2,3,4,5,6,7,8,9,10].map(j => <option key={j} value={j}>Ke-{j}</option>)}
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Tambah
        </button>
      </form>

      <div className="space-y-4">
        {hariList.map(hari => {
          const jadwalHari = jadwal.filter(j => j.hari === hari)
          if (jadwalHari.length === 0) return null
          return (
            <div key={hari} className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">{hari}</h4>
              <div className="space-y-2">
                {jadwalHari.map(j => (
                  <div key={j.id} className="flex items-center gap-4 bg-gray-50 p-2 rounded">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Ke-{j.jamMulaiKe} s/d {j.jamSelesaiKe}</span>
                    <span>{mapel.find(m => m.id === j.mapelId)?.nama}</span>
                    <span className="text-gray-600">{kelas.find(k => k.id === j.kelasId)?.nama}</span>
                    <span className="text-gray-500 text-sm">{guru.find(g => g.id === j.guruId)?.nama}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function GuruDashboard() {
  const [activeTab, setActiveTab] = useState('absensi')
  const guru = db.getGuruByUserId(db.getCurrentUser()?.id || '')
  const jadwal = guru ? db.getJadwalByGuru(guru.id) : []

  const renderContent = () => {
    switch (activeTab) {
      case 'absensi':
        return <AbsensiForm guru={guru} jadwal={jadwal} />
      case 'jurnal':
        return <JurnalForm guru={guru} />
      default:
        return <div>Fitur dalam pengembangan</div>
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <nav className="w-full md:w-64 space-y-1">
        {['absensi', 'jurnal', 'nilai', 'riwayat'].map(item => (
          <button
            key={item}
            onClick={() => setActiveTab(item)}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors capitalize ${
              activeTab === item ? 'bg-emerald-600 text-white' : 'bg-white hover:bg-gray-100'
            }`}
          >
            {item === 'absensi' ? 'Absensi KBM' : item === 'jurnal' ? 'Jurnal Kegiatan' : item === 'nilai' ? 'Input Nilai' : 'Riwayat Absensi'}
          </button>
        ))}
      </nav>
      <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
        {renderContent()}
      </div>
    </div>
  )
}

function AbsensiForm({ guru, jadwal }: { guru: any, jadwal: any[] }) {
  const [selectedJadwal, setSelectedJadwal] = useState('')
  const [foto, setFoto] = useState('')
  const [lokasi, setLokasi] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    if (!selectedJadwal || !foto) {
      alert('Lengkapi data absensi!')
      return
    }
    const j = jadwal.find(x => x.id === selectedJadwal)
    if (!j) return

    db.saveAbsensi({
      id: `absensi-${Date.now()}`,
      guruId: guru.id,
      jadwalId: j.id,
      kelasId: j.kelasId,
      mapelId: j.mapelId,
      tanggal: new Date().toISOString().split('T')[0],
      jamMulai: new Date().toTimeString().slice(0, 5),
      status: 'hadir',
      fotoSelfie: foto,
      lokasi: lokasi ? { latitude: 0, longitude: 0, alamat: lokasi } : undefined,
      createdAt: new Date().toISOString()
    })
    setMessage('Absensi berhasil disimpan!')
    setSelectedJadwal('')
    setFoto('')
    setLokasi('')
  }

  const jadwalHariIni = jadwal.filter(j => {
    const hari = new Date().toLocaleDateString('id-ID', { weekday: 'long' })
    const hariMap: Record<string, string> = { 'Monday': 'Senin', 'Tuesday': 'Selasa', 'Wednesday': 'Rabu', 'Thursday': 'Kamis', 'Friday': 'Jumat', 'Saturday': 'Sabtu', 'Sunday': 'Minggu' }
    return j.hari === hariMap[hari]
  })

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Absensi KBM</h3>
      {message && <div className="bg-green-50 text-green-600 p-3 rounded-lg">{message}</div>}
      
      <div className="space-y-4">
        <select 
          value={selectedJadwal} 
          onChange={e => setSelectedJadwal(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="">Pilih Jadwal Hari Ini</option>
          {jadwalHariIni.map(j => (
            <option key={j.id} value={j.id}>
              Ke-{j.jamMulaiKe} - {db.getMapelById(j.mapelId)?.nama} - {db.getKelasById(j.kelasId)?.nama}
            </option>
          ))}
        </select>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-2">Foto Selfie (simulasi)</p>
          <input 
            type="text" 
            placeholder="URL foto (simulasi)"
            value={foto}
            onChange={e => setFoto(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <input 
          type="text" 
          placeholder="Lokasi (opsional)"
          value={lokasi}
          onChange={e => setLokasi(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />

        <button 
          onClick={handleSubmit}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700"
        >
          Simpan Absensi
        </button>
      </div>
    </div>
  )
}

function JurnalForm({ guru }: { guru: any }) {
  const [absensi, setAbsensi] = useState<any[]>([])
  const [selectedAbsensi, setSelectedAbsensi] = useState('')
  const [materi, setMateri] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (guru) {
      const a = db.getAbsensiByGuru(guru.id)
        .filter(x => !db.getJurnal().find(j => j.absensiId === x.id))
      setAbsensi(a)
    }
  }, [guru])

  const handleSubmit = () => {
    if (!selectedAbsensi || !materi) {
      alert('Lengkapi data jurnal!')
      return
    }
    const a = absensi.find(x => x.id === selectedAbsensi)
    if (!a) return

    db.saveJurnal({
      id: `jurnal-${Date.now()}`,
      absensiId: a.id,
      guruId: guru.id,
      kelasId: a.kelasId,
      mapelId: a.mapelId,
      tanggal: a.tanggal,
      materi,
      deskripsiKegiatan: deskripsi,
      siswaTidakHadir: [],
      jumlahSiswaHadir: db.getSiswaByKelas(a.kelasId).length,
      jumlahSiswaTidakHadir: 0,
      createdAt: new Date().toISOString()
    })
    setMessage('Jurnal berhasil disimpan!')
    setSelectedAbsensi('')
    setMateri('')
    setDeskripsi('')
    setAbsensi(absensi.filter(x => x.id !== selectedAbsensi))
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Jurnal Kegiatan</h3>
      {message && <div className="bg-green-50 text-green-600 p-3 rounded-lg">{message}</div>}
      
      <div className="space-y-4">
        <select 
          value={selectedAbsensi} 
          onChange={e => setSelectedAbsensi(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="">Pilih Absensi</option>
          {absensi.map(a => (
            <option key={a.id} value={a.id}>
              {a.tanggal} - {db.getMapelById(a.mapelId)?.nama}
            </option>
          ))}
        </select>

        <input 
          type="text" 
          placeholder="Materi Pembelajaran"
          value={materi}
          onChange={e => setMateri(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />

        <textarea 
          placeholder="Deskripsi Kegiatan"
          value={deskripsi}
          onChange={e => setDeskripsi(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg min-h-[100px]"
        />

        <button 
          onClick={handleSubmit}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700"
        >
          Simpan Jurnal
        </button>
      </div>
    </div>
  )
}

function StatCard({ title, value, color }: { title: string, value: number, color: string }) {
  return (
    <div className={`${color} text-white rounded-xl p-4`}>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm opacity-90">{title}</p>
    </div>
  )
}

export default App
