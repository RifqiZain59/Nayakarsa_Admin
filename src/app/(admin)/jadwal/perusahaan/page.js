const DATA = [
  {id:'P001',nama:'PT Maju Bersama',      divisi:'HR & Rekrutmen', tgl:'2025-06-10',waktu:'08:00–16:00',kota:'Jakarta Selatan', status:'Terjadwal',peserta:42,kontak:'Budi Santoso'},
  {id:'P002',nama:'CV Tekno Mandiri',     divisi:'Engineering',    tgl:'2025-06-12',waktu:'09:00–15:00',kota:'Bandung',         status:'Selesai',   peserta:28,kontak:'Rina Wati'},
  {id:'P003',nama:'PT Sinar Abadi',       divisi:'Keuangan',       tgl:'2025-06-15',waktu:'07:30–12:00',kota:'Surabaya',        status:'Terjadwal', peserta:35,kontak:'Ahmad Fauzi'},
  {id:'P004',nama:'PT Global Teknindo',   divisi:'Pemasaran',      tgl:'2025-06-18',waktu:'10:00–17:00',kota:'Yogyakarta',      status:'Dibatalkan',peserta:20,kontak:'Sri Mulyani'},
  {id:'P005',nama:'PT Karya Unggul',      divisi:'Operasional',    tgl:'2025-06-20',waktu:'08:00–14:00',kota:'Semarang',        status:'Terjadwal', peserta:50,kontak:'Hendra Gunawan'},
  {id:'P006',nama:'PT Bintang Timur',     divisi:'Logistik',       tgl:'2025-06-22',waktu:'07:00–13:00',kota:'Medan',           status:'Terjadwal', peserta:38,kontak:'Dewi Lestari'},
  {id:'P007',nama:'CV Mitra Sejahtera',   divisi:'Administrasi',   tgl:'2025-06-25',waktu:'08:30–15:30',kota:'Makassar',        status:'Selesai',   peserta:24,kontak:'Fajar Nugroho'},
  {id:'P008',nama:'PT Nusantara Digital', divisi:'IT & Teknologi',  tgl:'2025-06-27',waktu:'09:00–16:00',kota:'Bali',            status:'Terjadwal', peserta:60,kontak:'Citra Dewi'},
];

const SB = { Terjadwal:'b-indigo', Selesai:'b-emerald', Dibatalkan:'b-rose' };

export const metadata = { title:'Jadwal Perusahaan — Nayakarsa Admin' };

export default function JadwalPerusahaanPage() {
  const total    = DATA.length;
  const selesai  = DATA.filter(d=>d.status==='Selesai').length;
  const terjadwal= DATA.filter(d=>d.status==='Terjadwal').length;
  const batal    = DATA.filter(d=>d.status==='Dibatalkan').length;

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="chip">🏢 Perusahaan</div>
          <h1>Jadwal Perusahaan</h1>
          <p>Kelola seluruh jadwal kegiatan perusahaan dan instansi yang terdaftar.</p>
        </div>
        <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
          <button className="btn btn-outline btn-sm">⬇ Export Excel</button>
          <button className="btn btn-primary btn-sm">＋ Tambah Jadwal</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{gridTemplateColumns:'repeat(4,1fr)',marginBottom:'24px'}}>
        {[
          {icon:'📋',label:'Total Jadwal',   value:total,    cls:'ico-indigo'},
          {icon:'✅',label:'Selesai',        value:selesai,  cls:'ico-emerald'},
          {icon:'⏳',label:'Terjadwal',      value:terjadwal,cls:'ico-amber'},
          {icon:'❌',label:'Dibatalkan',     value:batal,    cls:'ico-rose'},
        ].map(s=>(
          <div className="stat-card" key={s.label}>
            <div className={`stat-ico ${s.cls}`}>{s.icon}</div>
            <div>
              <div className="stat-val">{s.value}</div>
              <div className="stat-lbl">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Daftar Jadwal</div>
            <div className="card-sub">{total} total jadwal perusahaan terdaftar</div>
          </div>
          <div style={{display:'flex',gap:'10px',alignItems:'center',flexWrap:'wrap'}}>
            <div className="search-box">
              <span style={{color:'#94a3b8'}}>⌕</span>
              <input placeholder="Cari perusahaan..." />
            </div>
            <select className="form-select">
              <option>Semua Status</option>
              <option>Terjadwal</option>
              <option>Selesai</option>
              <option>Dibatalkan</option>
            </select>
          </div>
        </div>

        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Perusahaan</th>
                <th>Divisi</th>
                <th>Tanggal</th>
                <th>Waktu</th>
                <th>Kota</th>
                <th>Kontak PIC</th>
                <th>Peserta</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {DATA.map(r=>(
                <tr key={r.id}>
                  <td style={{fontFamily:'monospace',fontSize:'12px',color:'#94a3b8'}}>{r.id}</td>
                  <td style={{fontWeight:600}}>{r.nama}</td>
                  <td style={{color:'#475569'}}>{r.divisi}</td>
                  <td style={{color:'#475569',whiteSpace:'nowrap'}}>{r.tgl}</td>
                  <td style={{color:'#475569',whiteSpace:'nowrap'}}>{r.waktu}</td>
                  <td style={{color:'#475569'}}>{r.kota}</td>
                  <td style={{color:'#475569'}}>{r.kontak}</td>
                  <td>
                    <strong>{r.peserta}</strong>
                    <span style={{color:'#94a3b8',fontSize:'12px'}}> org</span>
                  </td>
                  <td><span className={`badge ${SB[r.status]}`}>{r.status}</span></td>
                  <td>
                    <div style={{display:'flex',gap:'5px'}}>
                      <button className="btn btn-outline btn-sm">Detail</button>
                      <button className="btn btn-outline btn-sm">Edit</button>
                      <button className="btn btn-danger btn-sm">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pager">
          <span className="pager-info">Menampilkan 1–{DATA.length} dari {DATA.length} data</span>
          <div className="pager-btns">
            {['‹','1','2','3','›'].map((p,i)=>(
              <button key={i} className={`pager-btn ${p==='1'?'on':''}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
