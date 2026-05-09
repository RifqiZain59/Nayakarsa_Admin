const DATA = [
  {id:'U001',nama:'Universitas Indonesia',     fak:'Teknik',         tgl:'2025-06-10',waktu:'08:00–15:00',kota:'Depok',     rektor:'Prof. Ari Kuncoro',    status:'Terjadwal', mhs:350,prodi:12},
  {id:'U002',nama:'Institut Teknologi Bandung',fak:'Informatika',    tgl:'2025-06-13',waktu:'08:00–14:00',kota:'Bandung',   rektor:'Prof. Reini Wirahadikusumah',status:'Selesai',mhs:280,prodi:8},
  {id:'U003',nama:'Universitas Gadjah Mada',   fak:'Ekonomika',      tgl:'2025-06-15',waktu:'07:30–13:30',kota:'Yogyakarta',rektor:'Prof. Ova Emilia',     status:'Terjadwal', mhs:420,prodi:15},
  {id:'U004',nama:'Universitas Airlangga',     fak:'Kedokteran',     tgl:'2025-06-17',waktu:'09:00–15:00',kota:'Surabaya',  rektor:'Prof. Mohammad Nasih', status:'Terjadwal', mhs:200,prodi:6},
  {id:'U005',nama:'Universitas Brawijaya',     fak:'Pertanian',      tgl:'2025-06-20',waktu:'08:00–14:00',kota:'Malang',    rektor:'Prof. Widodo',         status:'Dibatalkan',mhs:175,prodi:5},
  {id:'U006',nama:'Universitas Diponegoro',    fak:'Hukum',          tgl:'2025-06-23',waktu:'08:00–13:00',kota:'Semarang',  rektor:'Prof. Yos Johan',      status:'Terjadwal', mhs:240,prodi:9},
  {id:'U007',nama:'Universitas Padjadjaran',   fak:'Ilmu Sosial',    tgl:'2025-06-25',waktu:'09:00–15:00',kota:'Bandung',   rektor:'Prof. Rina Indiastuti', status:'Selesai',  mhs:310,prodi:11},
  {id:'U008',nama:'Universitas Hasanuddin',    fak:'Teknik Sipil',   tgl:'2025-06-28',waktu:'08:00–14:00',kota:'Makassar',  rektor:'Prof. Jamaluddin Jompa',status:'Terjadwal',mhs:190,prodi:7},
];

const SB = { Terjadwal:'b-violet', Selesai:'b-emerald', Dibatalkan:'b-rose' };

export const metadata = { title:'Jadwal Universitas — Nayakarsa Admin' };

export default function JadwalUniversitasPage() {
  const selesai   = DATA.filter(d=>d.status==='Selesai').length;
  const terjadwal = DATA.filter(d=>d.status==='Terjadwal').length;
  const batal     = DATA.filter(d=>d.status==='Dibatalkan').length;
  const totalMhs  = DATA.reduce((a,d)=>a+d.mhs,0);

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="chip">🎓 Universitas</div>
          <h1>Jadwal Universitas</h1>
          <p>Kelola seluruh jadwal kegiatan perguruan tinggi yang terdaftar di sistem.</p>
        </div>
        <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
          <button className="btn btn-outline btn-sm">⬇ Export Excel</button>
          <button className="btn btn-primary btn-sm">＋ Tambah Jadwal</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{gridTemplateColumns:'repeat(4,1fr)',marginBottom:'24px'}}>
        {[
          {icon:'🎓',label:'Total Universitas', value:DATA.length, cls:'ico-violet'},
          {icon:'✅',label:'Selesai',           value:selesai,     cls:'ico-emerald'},
          {icon:'⏳',label:'Terjadwal',         value:terjadwal,   cls:'ico-indigo'},
          {icon:'👥',label:'Total Mahasiswa',   value:totalMhs.toLocaleString('id'), cls:'ico-cyan'},
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
            <div className="card-title">Daftar Jadwal Universitas</div>
            <div className="card-sub">{DATA.length} perguruan tinggi — {batal} dibatalkan</div>
          </div>
          <div style={{display:'flex',gap:'10px',alignItems:'center',flexWrap:'wrap'}}>
            <div className="search-box">
              <span style={{color:'#94a3b8'}}>⌕</span>
              <input placeholder="Cari universitas..." />
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
                <th>Nama Universitas</th>
                <th>Fakultas</th>
                <th>Rektor/PIC</th>
                <th>Tanggal</th>
                <th>Waktu</th>
                <th>Kota</th>
                <th>Mahasiswa</th>
                <th>Prodi</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {DATA.map(r=>(
                <tr key={r.id}>
                  <td style={{fontFamily:'monospace',fontSize:'12px',color:'#94a3b8'}}>{r.id}</td>
                  <td style={{fontWeight:600}}>{r.nama}</td>
                  <td style={{color:'#475569'}}>{r.fak}</td>
                  <td style={{color:'#475569',fontSize:'12.5px'}}>{r.rektor}</td>
                  <td style={{color:'#475569',whiteSpace:'nowrap'}}>{r.tgl}</td>
                  <td style={{color:'#475569',whiteSpace:'nowrap'}}>{r.waktu}</td>
                  <td style={{color:'#475569'}}>{r.kota}</td>
                  <td><strong>{r.mhs}</strong> <span style={{color:'#94a3b8',fontSize:'12px'}}>mhs</span></td>
                  <td><strong>{r.prodi}</strong> <span style={{color:'#94a3b8',fontSize:'12px'}}>prodi</span></td>
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
