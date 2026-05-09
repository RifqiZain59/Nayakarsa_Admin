function BarVis({ id = 1 }) {
  const bars = [2,1,3,2,1,3,1,2,3,1,2,1,3,2,1,2,3,1,2,1,3,1,2,3];
  return (
    <div className="barcode-visual">
      {bars.map((w,i)=>(
        <div key={i} className="bar" style={{
          width:`${w*(id%2===0?1.3:1.0)}px`,
          opacity: i%5===0?0.6:1
        }}/>
      ))}
    </div>
  );
}

const DATA = [
  {id:'BC-U001',kode:'8991234560001',nama:'Universitas Indonesia',       fak:'Teknik',       tgl:'2025-06-10',terbit:'2025-05-01',status:'Aktif',   jumlah:350},
  {id:'BC-U002',kode:'8990987650002',nama:'Institut Teknologi Bandung',  fak:'Informatika',  tgl:'2025-06-13',terbit:'2025-05-03',status:'Aktif',   jumlah:280},
  {id:'BC-U003',kode:'8991122330003',nama:'Universitas Gadjah Mada',     fak:'Ekonomika',    tgl:'2025-06-15',terbit:'2025-05-05',status:'Aktif',   jumlah:420},
  {id:'BC-U004',kode:'8995544330004',nama:'Universitas Airlangga',       fak:'Kedokteran',   tgl:'2025-06-17',terbit:'2025-05-07',status:'Nonaktif',jumlah:200},
  {id:'BC-U005',kode:'8996677880005',nama:'Universitas Brawijaya',       fak:'Pertanian',    tgl:'2025-06-20',terbit:'2025-05-09',status:'Aktif',   jumlah:175},
  {id:'BC-U006',kode:'8997766550006',nama:'Universitas Diponegoro',      fak:'Hukum',        tgl:'2025-06-23',terbit:'2025-05-11',status:'Aktif',   jumlah:240},
  {id:'BC-U007',kode:'8998855440007',nama:'Universitas Padjadjaran',     fak:'Ilmu Sosial',  tgl:'2025-06-25',terbit:'2025-05-13',status:'Aktif',   jumlah:310},
  {id:'BC-U008',kode:'8999944330008',nama:'Universitas Hasanuddin',      fak:'Teknik Sipil', tgl:'2025-06-28',terbit:'2025-05-15',status:'Aktif',   jumlah:190},
];

export const metadata = { title:'Barcode Universitas — Nayakarsa Admin' };

export default function BarcodeUniversitasPage() {
  const aktif    = DATA.filter(d=>d.status==='Aktif').length;
  const nonaktif = DATA.filter(d=>d.status==='Nonaktif').length;
  const totalLbr = DATA.reduce((a,d)=>a+d.jumlah,0);

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="chip">🎓 Barcode Universitas</div>
          <h1>Barcode Universitas</h1>
          <p>Kelola dan cetak barcode identitas untuk seluruh perguruan tinggi yang terdaftar.</p>
        </div>
        <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
          <button className="btn btn-outline btn-sm">🖨 Cetak Semua</button>
          <button className="btn btn-primary btn-sm">＋ Generate Barcode</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{gridTemplateColumns:'repeat(4,1fr)',marginBottom:'24px'}}>
        {[
          {icon:'📊',label:'Total Barcode',  value:DATA.length, cls:'ico-violet'},
          {icon:'✅',label:'Aktif',          value:aktif,       cls:'ico-emerald'},
          {icon:'🔒',label:'Nonaktif',       value:nonaktif,    cls:'ico-rose'},
          {icon:'📄',label:'Total Lembar',   value:totalLbr.toLocaleString('id'),cls:'ico-amber'},
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

      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px',flexWrap:'wrap',gap:'12px'}}>
        <div className="tab-bar">
          <button className="tab on">Grid</button>
          <button className="tab">Tabel</button>
        </div>
        <div className="search-box">
          <span style={{color:'#94a3b8'}}>⌕</span>
          <input placeholder="Cari universitas..." />
        </div>
      </div>

      <div className="barcode-grid">
        {DATA.map((item,i)=>(
          <div className="barcode-card" key={item.id}>
            <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <span style={{fontFamily:'monospace',fontSize:'11px',color:'#94a3b8'}}>{item.id}</span>
              <span className={`badge ${item.status==='Aktif'?'b-emerald':'b-slate'}`} style={{fontSize:'10px'}}>
                {item.status}
              </span>
            </div>
            <BarVis id={i+3}/>
            <div style={{textAlign:'center',width:'100%'}}>
              <div style={{fontWeight:700,fontSize:'12.5px',color:'#0f172a',marginBottom:'3px'}}>{item.nama}</div>
              <div style={{fontSize:'11.5px',color:'#64748b',marginBottom:'2px'}}>{item.fak}</div>
              <div style={{fontFamily:'monospace',fontSize:'11px',color:'#94a3b8',letterSpacing:'.05em'}}>{item.kode}</div>
              <div style={{fontSize:'11px',color:'#94a3b8',marginTop:'4px'}}>
                {item.tgl} &nbsp;|&nbsp; {item.jumlah} mhs
              </div>
            </div>
            <div style={{display:'flex',gap:'7px',width:'100%'}}>
              <button className="btn btn-outline btn-sm" style={{flex:1}}>🖨 Cetak</button>
              <button className="btn btn-outline btn-sm">⬇</button>
              <button className="btn btn-danger btn-sm">✕</button>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{marginTop:'24px'}}>
        <div className="card-head">
          <div className="card-title">Daftar Lengkap Barcode Universitas</div>
          <div className="card-sub">{DATA.length} barcode — {aktif} aktif</div>
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>ID</th><th>Nama Universitas</th><th>Fakultas</th>
                <th>Kode Barcode</th><th>Tgl Jadwal</th><th>Terbit</th>
                <th>Lembar</th><th>Status</th><th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {DATA.map(r=>(
                <tr key={r.id}>
                  <td style={{fontFamily:'monospace',fontSize:'12px',color:'#94a3b8'}}>{r.id}</td>
                  <td style={{fontWeight:600}}>{r.nama}</td>
                  <td style={{color:'#475569'}}>{r.fak}</td>
                  <td style={{fontFamily:'monospace',fontSize:'12px'}}>{r.kode}</td>
                  <td style={{color:'#475569'}}>{r.tgl}</td>
                  <td style={{color:'#475569'}}>{r.terbit}</td>
                  <td><strong>{r.jumlah}</strong></td>
                  <td><span className={`badge ${r.status==='Aktif'?'b-emerald':'b-slate'}`}>{r.status}</span></td>
                  <td>
                    <div style={{display:'flex',gap:'5px'}}>
                      <button className="btn btn-outline btn-sm">🖨 Cetak</button>
                      <button className="btn btn-danger btn-sm">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
