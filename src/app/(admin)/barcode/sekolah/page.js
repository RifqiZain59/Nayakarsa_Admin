function BarVis({ id = 1 }) {
  const bars = [1,3,2,1,3,1,2,1,3,2,1,2,1,3,1,2,3,1,2,1,2,3,1,2];
  return (
    <div className="barcode-visual">
      {bars.map((w,i)=>(
        <div key={i} className="bar" style={{
          width:`${w*(id%3===0?1.4:1.1)}px`,
          opacity: i%4===0?0.65:1
        }}/>
      ))}
    </div>
  );
}

const DATA = [
  {id:'BC-S001',kode:'8991234567001',nama:'SMK Negeri 1 Jakarta',     jenjang:'SMK',tgl:'2025-06-09',terbit:'2025-05-01',status:'Aktif',   jumlah:180},
  {id:'BC-S002',kode:'8990987654002',nama:'SMA Negeri 5 Bandung',     jenjang:'SMA',tgl:'2025-06-11',terbit:'2025-05-02',status:'Aktif',   jumlah:210},
  {id:'BC-S003',kode:'8991122334003',nama:'SMP Negeri 3 Surabaya',    jenjang:'SMP',tgl:'2025-06-13',terbit:'2025-05-03',status:'Nonaktif',jumlah:155},
  {id:'BC-S004',kode:'8995544332004',nama:'SMK Muhammadiyah 2',       jenjang:'SMK',tgl:'2025-06-16',terbit:'2025-05-05',status:'Aktif',   jumlah:120},
  {id:'BC-S005',kode:'8996677889005',nama:'SMA Al-Azhar Syifa',       jenjang:'SMA',tgl:'2025-06-19',terbit:'2025-05-07',status:'Aktif',   jumlah:95},
  {id:'BC-S006',kode:'8997766554006',nama:'SMP Islam Terpadu Harapan',jenjang:'SMP',tgl:'2025-06-21',terbit:'2025-05-09',status:'Aktif',   jumlah:140},
  {id:'BC-S007',kode:'8998855443007',nama:'SMK PGRI 1 Medan',         jenjang:'SMK',tgl:'2025-06-23',terbit:'2025-05-11',status:'Aktif',   jumlah:160},
  {id:'BC-S008',kode:'8999944332008',nama:'SMA Negeri 2 Makassar',    jenjang:'SMA',tgl:'2025-06-25',terbit:'2025-05-13',status:'Aktif',   jumlah:195},
];

const JC = {SMK:'#4f46e5', SMA:'#0891b2', SMP:'#d97706'};
const JB = {SMK:'b-indigo', SMA:'b-cyan', SMP:'b-amber'};

export const metadata = { title:'Barcode Sekolah — Nayakarsa Admin' };

export default function BarcodeSekolahPage() {
  const aktif = DATA.filter(d=>d.status==='Aktif').length;
  const smk   = DATA.filter(d=>d.jenjang==='SMK').length;
  const sma   = DATA.filter(d=>d.jenjang==='SMA').length;
  const smp   = DATA.filter(d=>d.jenjang==='SMP').length;

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="chip">🏫 Barcode Sekolah</div>
          <h1>Barcode Sekolah</h1>
          <p>Kelola dan cetak barcode identitas untuk seluruh sekolah yang terdaftar.</p>
        </div>
        <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
          <button className="btn btn-outline btn-sm">🖨 Cetak Semua</button>
          <button className="btn btn-primary btn-sm">＋ Generate Barcode</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{gridTemplateColumns:'repeat(4,1fr)',marginBottom:'24px'}}>
        {[
          {icon:'📊',label:'Total Barcode',value:DATA.length,cls:'ico-cyan'},
          {icon:'🔧',label:'SMK',          value:smk,        cls:'ico-indigo'},
          {icon:'📚',label:'SMA',          value:sma,        cls:'ico-violet'},
          {icon:'🎒',label:'SMP',          value:smp,        cls:'ico-amber'},
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

      {/* Filter + Grid */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px',flexWrap:'wrap',gap:'12px'}}>
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

      <div className="barcode-grid">
        {DATA.map((item,i)=>(
          <div className="barcode-card" key={item.id}>
            <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <span className={`badge ${JB[item.jenjang]}`} style={{fontSize:'10px'}}>{item.jenjang}</span>
              <span className={`badge ${item.status==='Aktif'?'b-emerald':'b-slate'}`} style={{fontSize:'10px'}}>
                {item.status}
              </span>
            </div>
            <BarVis id={i+2}/>
            <div style={{textAlign:'center',width:'100%'}}>
              <div style={{fontWeight:700,fontSize:'13px',color:'#0f172a',marginBottom:'3px'}}>{item.nama}</div>
              <div style={{fontFamily:'monospace',fontSize:'11px',color:'#94a3b8',letterSpacing:'.05em'}}>{item.kode}</div>
              <div style={{fontSize:'11px',color:'#94a3b8',marginTop:'4px'}}>
                {item.tgl} &nbsp;|&nbsp; {item.jumlah} lembar
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

      {/* Table */}
      <div className="card" style={{marginTop:'24px'}}>
        <div className="card-head">
          <div className="card-title">Daftar Lengkap Barcode Sekolah</div>
          <div className="card-sub">{DATA.length} barcode — {aktif} aktif</div>
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>ID</th><th>Nama Sekolah</th><th>Jenjang</th>
                <th>Kode Barcode</th><th>Tgl Jadwal</th><th>Terbit</th>
                <th>Jumlah</th><th>Status</th><th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {DATA.map(r=>(
                <tr key={r.id}>
                  <td style={{fontFamily:'monospace',fontSize:'12px',color:'#94a3b8'}}>{r.id}</td>
                  <td style={{fontWeight:600}}>{r.nama}</td>
                  <td><span className={`badge ${JB[r.jenjang]}`}>{r.jenjang}</span></td>
                  <td style={{fontFamily:'monospace',fontSize:'12px'}}>{r.kode}</td>
                  <td style={{color:'#475569'}}>{r.tgl}</td>
                  <td style={{color:'#475569'}}>{r.terbit}</td>
                  <td><strong>{r.jumlah}</strong> <span style={{color:'#94a3b8',fontSize:'12px'}}>lembar</span></td>
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
