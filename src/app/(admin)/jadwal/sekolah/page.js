const DATA = [
  {id:'S001',nama:'SMK Negeri 1 Jakarta',     jenjang:'SMK',tgl:'2025-06-09',waktu:'07:00–13:00',kota:'Jakarta',   kepsek:'Drs. Bambang S.',  status:'Terjadwal',siswa:180,kelas:5},
  {id:'S002',nama:'SMA Negeri 5 Bandung',     jenjang:'SMA',tgl:'2025-06-11',waktu:'07:00–12:00',kota:'Bandung',  kepsek:'Ibu Sari Dewi',    status:'Selesai',   siswa:210,kelas:6},
  {id:'S003',nama:'SMP Negeri 3 Surabaya',    jenjang:'SMP',tgl:'2025-06-13',waktu:'07:30–12:30',kota:'Surabaya', kepsek:'Bpk. Hendra P.',   status:'Terjadwal', siswa:155,kelas:4},
  {id:'S004',nama:'SMK Muhammadiyah 2',       jenjang:'SMK',tgl:'2025-06-16',waktu:'07:00–13:00',kota:'Yogyakarta',kepsek:'Ibu Fatimah R.',  status:'Terjadwal', siswa:120,kelas:3},
  {id:'S005',nama:'SMA Al-Azhar Syifa',       jenjang:'SMA',tgl:'2025-06-19',waktu:'07:00–12:00',kota:'Depok',    kepsek:'Bpk. Ridwan M.',   status:'Dibatalkan',siswa:95, kelas:3},
  {id:'S006',nama:'SMP Islam Terpadu Harapan',jenjang:'SMP',tgl:'2025-06-21',waktu:'07:30–12:00',kota:'Bekasi',   kepsek:'Ibu Nurul Huda',   status:'Terjadwal', siswa:140,kelas:4},
  {id:'S007',nama:'SMK PGRI 1 Medan',         jenjang:'SMK',tgl:'2025-06-23',waktu:'07:00–13:00',kota:'Medan',    kepsek:'Bpk. Andi Saputra',status:'Terjadwal', siswa:160,kelas:5},
  {id:'S008',nama:'SMA Negeri 2 Makassar',    jenjang:'SMA',tgl:'2025-06-25',waktu:'07:00–12:00',kota:'Makassar', kepsek:'Ibu Rahmawati',    status:'Selesai',   siswa:195,kelas:6},
];

const JB = { SMK:'b-indigo', SMA:'b-cyan', SMP:'b-amber' };
const SB = { Terjadwal:'b-indigo', Selesai:'b-emerald', Dibatalkan:'b-rose' };

export const metadata = { title:'Jadwal Sekolah — Nayakarsa Admin' };

export default function JadwalSekolahPage() {
  const smk = DATA.filter(d=>d.jenjang==='SMK').length;
  const sma = DATA.filter(d=>d.jenjang==='SMA').length;
  const smp = DATA.filter(d=>d.jenjang==='SMP').length;
  const selesai = DATA.filter(d=>d.status==='Selesai').length;

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="chip">🏫 Sekolah</div>
          <h1>Jadwal Sekolah</h1>
          <p>Kelola jadwal untuk seluruh sekolah SMP, SMA, dan SMK yang terdaftar.</p>
        </div>
        <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
          <button className="btn btn-outline btn-sm">⬇ Export Excel</button>
          <button className="btn btn-primary btn-sm">＋ Tambah Jadwal</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{gridTemplateColumns:'repeat(4,1fr)',marginBottom:'20px'}}>
        {[
          {icon:'🏫',label:'Total Sekolah', value:DATA.length,cls:'ico-cyan'},
          {icon:'🔧',label:'SMK',           value:smk,        cls:'ico-indigo'},
          {icon:'📚',label:'SMA',           value:sma,        cls:'ico-violet'},
          {icon:'🎒',label:'SMP',           value:smp,        cls:'ico-amber'},
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

      {/* Progress per jenjang */}
      <div className="g3" style={{marginBottom:'20px'}}>
        {[
          {label:'SMK',val:smk,total:DATA.length,color:'#4f46e5',desc:'Sekolah Menengah Kejuruan'},
          {label:'SMA',val:sma,total:DATA.length,color:'#0891b2',desc:'Sekolah Menengah Atas'},
          {label:'SMP',val:smp,total:DATA.length,color:'#d97706',desc:'Sekolah Menengah Pertama'},
        ].map(d=>{
          const pct = Math.round(d.val/d.total*100);
          return (
            <div className="card" style={{padding:'20px 24px'}} key={d.label}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'8px'}}>
                <div>
                  <div style={{fontSize:'15px',fontWeight:'700',color:'#0f172a'}}>{d.label}</div>
                  <div style={{fontSize:'12px',color:'#94a3b8'}}>{d.desc}</div>
                </div>
                <div style={{fontSize:'22px',fontWeight:'800',color:d.color}}>{d.val}</div>
              </div>
              <div className="prog-wrap">
                <div className="prog-bar" style={{width:`${pct}%`,background:d.color}}/>
              </div>
              <div style={{fontSize:'12px',color:'#94a3b8',marginTop:'6px'}}>{pct}% dari total sekolah</div>
            </div>
          );
        })}
      </div>

      {/* Filter tabs + table */}
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Daftar Jadwal Sekolah</div>
            <div className="card-sub">{DATA.length} sekolah — {selesai} sudah selesai</div>
          </div>
          <div style={{display:'flex',gap:'10px',alignItems:'center',flexWrap:'wrap'}}>
            <div className="tab-bar">
              {['Semua','SMK','SMA','SMP'].map((t,i)=>(
                <button key={t} className={`tab ${i===0?'on':''}`}>{t}</button>
              ))}
            </div>
            <div className="search-box">
              <span style={{color:'#94a3b8'}}>⌕</span>
              <input placeholder="Cari sekolah..." />
            </div>
          </div>
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Sekolah</th>
                <th>Jenjang</th>
                <th>Kepala Sekolah</th>
                <th>Tanggal</th>
                <th>Waktu</th>
                <th>Kota</th>
                <th>Siswa</th>
                <th>Kelas</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {DATA.map(r=>(
                <tr key={r.id}>
                  <td style={{fontFamily:'monospace',fontSize:'12px',color:'#94a3b8'}}>{r.id}</td>
                  <td style={{fontWeight:600}}>{r.nama}</td>
                  <td><span className={`badge ${JB[r.jenjang]}`}>{r.jenjang}</span></td>
                  <td style={{color:'#475569'}}>{r.kepsek}</td>
                  <td style={{color:'#475569',whiteSpace:'nowrap'}}>{r.tgl}</td>
                  <td style={{color:'#475569',whiteSpace:'nowrap'}}>{r.waktu}</td>
                  <td style={{color:'#475569'}}>{r.kota}</td>
                  <td><strong>{r.siswa}</strong> <span style={{color:'#94a3b8',fontSize:'12px'}}>siswa</span></td>
                  <td><strong>{r.kelas}</strong> <span style={{color:'#94a3b8',fontSize:'12px'}}>kelas</span></td>
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
