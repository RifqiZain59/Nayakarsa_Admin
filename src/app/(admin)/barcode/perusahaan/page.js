// CSS barcode visual — no SVG
function BarVis({ id = 1 }) {
  const bars = [2,1,3,1,2,1,1,3,2,1,2,3,1,2,1,3,1,2,1,2,3,1,2,1];
  return (
    <div className="barcode-visual">
      {bars.map((w,i)=>(
        <div key={i} className="bar" style={{
          width:`${w * (id%2===0?1.5:1.2)}px`,
          opacity: i%3===0 ? 0.7 : 1
        }}/>
      ))}
    </div>
  );
}

const DATA = [
  {id:'BC-P001',kode:'8991234567890',nama:'PT Maju Bersama',      divisi:'HR & Rekrutmen',tgl:'2025-06-10',terbit:'2025-05-01',status:'Aktif',   jumlah:45},
  {id:'BC-P002',kode:'8990987654321',nama:'CV Tekno Mandiri',     divisi:'Engineering',   tgl:'2025-06-12',terbit:'2025-05-03',status:'Aktif',   jumlah:28},
  {id:'BC-P003',kode:'8991122334455',nama:'PT Sinar Abadi',       divisi:'Keuangan',      tgl:'2025-06-15',terbit:'2025-05-05',status:'Nonaktif',jumlah:35},
  {id:'BC-P004',kode:'8995544332211',nama:'PT Global Teknindo',   divisi:'Pemasaran',     tgl:'2025-06-18',terbit:'2025-05-07',status:'Aktif',   jumlah:20},
  {id:'BC-P005',kode:'8996677889900',nama:'PT Karya Unggul',      divisi:'Operasional',   tgl:'2025-06-20',terbit:'2025-05-09',status:'Aktif',   jumlah:50},
  {id:'BC-P006',kode:'8997766554433',nama:'PT Bintang Timur',     divisi:'Logistik',      tgl:'2025-06-22',terbit:'2025-05-11',status:'Aktif',   jumlah:38},
  {id:'BC-P007',kode:'8998855443322',nama:'CV Mitra Sejahtera',   divisi:'Administrasi',  tgl:'2025-06-25',terbit:'2025-05-13',status:'Aktif',   jumlah:24},
  {id:'BC-P008',kode:'8999944332211',nama:'PT Nusantara Digital', divisi:'IT & Teknologi', tgl:'2025-06-27',terbit:'2025-05-15',status:'Nonaktif',jumlah:60},
];

export const metadata = { title:'Barcode Perusahaan — Nayakarsa Admin' };

export default function BarcodePerusahaanPage() {
  const aktif    = DATA.filter(d=>d.status==='Aktif').length;
  const nonaktif = DATA.filter(d=>d.status==='Nonaktif').length;
  const totalCetak = DATA.reduce((a,d)=>a+d.jumlah,0);

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="chip">🏢 Barcode Perusahaan</div>
          <h1>Barcode Perusahaan</h1>
          <p>Kelola dan cetak barcode identitas untuk seluruh perusahaan yang terdaftar.</p>
        </div>
        <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
          <button className="btn btn-outline btn-sm">🖨 Cetak Semua</button>
          <button className="btn btn-primary btn-sm">＋ Generate Barcode</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{gridTemplateColumns:'repeat(4,1fr)',marginBottom:'24px'}}>
        {[
          {icon:'📊',label:'Total Barcode',  value:DATA.length,  cls:'ico-indigo'},
          {icon:'✅',label:'Aktif',          value:aktif,        cls:'ico-emerald'},
          {icon:'🔒',label:'Nonaktif',       value:nonaktif,     cls:'ico-rose'},
          {icon:'🖨',label:'Total Dicetak',  value:totalCetak,   cls:'ico-amber'},
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

      {/* Grid / Table toggle */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px',flexWrap:'wrap',gap:'12px'}}>
        <div className="tab-bar">
          <button className="tab on">Grid</button>
          <button className="tab">Tabel</button>
        </div>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          <div className="search-box">
            <span style={{color:'#94a3b8'}}>⌕</span>
            <input placeholder="Cari perusahaan..." />
          </div>
          <select className="form-select">
            <option>Semua Status</option>
            <option>Aktif</option>
            <option>Nonaktif</option>
          </select>
        </div>
      </div>

      {/* Barcode Grid */}
      <div className="barcode-grid">
        {DATA.map((item,i)=>(
          <div className="barcode-card" key={item.id}>
            <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <span style={{fontFamily:'monospace',fontSize:'11px',color:'#94a3b8'}}>{item.id}</span>
              <span className={`badge ${item.status==='Aktif'?'b-emerald':'b-slate'}`} style={{fontSize:'10px'}}>
                {item.status}
              </span>
            </div>

            <BarVis id={i+1}/>

            <div style={{textAlign:'center',width:'100%'}}>
              <div style={{fontWeight:700,fontSize:'13px',color:'#0f172a',marginBottom:'3px'}}>{item.nama}</div>
              <div style={{fontSize:'11.5px',color:'#64748b',marginBottom:'2px'}}>{item.divisi}</div>
              <div style={{fontFamily:'monospace',fontSize:'11px',color:'#94a3b8',letterSpacing:'.05em'}}>{item.kode}</div>
              <div style={{fontSize:'11px',color:'#94a3b8',marginTop:'4px'}}>
                Terbit: {item.terbit} &nbsp;|&nbsp; {item.jumlah} lembar
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

      {/* Table view */}
      <div className="card" style={{marginTop:'24px'}}>
        <div className="card-head">
          <div className="card-title">Daftar Lengkap Barcode</div>
          <div className="card-sub">{DATA.length} total barcode perusahaan</div>
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>ID Barcode</th>
                <th>Nama Perusahaan</th>
                <th>Divisi</th>
                <th>Kode Barcode</th>
                <th>Tgl Jadwal</th>
                <th>Tgl Terbit</th>
                <th>Jumlah</th>
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
