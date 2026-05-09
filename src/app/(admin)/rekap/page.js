const REKAP = [
  {no:'01',nama:'PT Maju Bersama',       tipe:'Perusahaan', jadwal:12,selesai:10,barcode:45,peserta:420,hadir:398,pct:95},
  {no:'02',nama:'SMK Negeri 1 Jakarta',  tipe:'Sekolah',    jadwal:8, selesai:6, barcode:30,peserta:180,hadir:162,pct:90},
  {no:'03',nama:'Universitas Indonesia', tipe:'Universitas',jadwal:5, selesai:5, barcode:22,peserta:350,hadir:350,pct:100},
  {no:'04',nama:'CV Tekno Mandiri',      tipe:'Perusahaan', jadwal:3, selesai:2, barcode:15,peserta:85, hadir:57, pct:67},
  {no:'05',nama:'SMA Negeri 5 Bandung',  tipe:'Sekolah',    jadwal:6, selesai:6, barcode:18,peserta:210,hadir:210,pct:100},
  {no:'06',nama:'ITB',                   tipe:'Universitas',jadwal:4, selesai:3, barcode:20,peserta:280,hadir:210,pct:75},
  {no:'07',nama:'PT Sinar Abadi',        tipe:'Perusahaan', jadwal:7, selesai:5, barcode:35,peserta:195,hadir:175,pct:90},
  {no:'08',nama:'SMP Negeri 3 Surabaya', tipe:'Sekolah',    jadwal:4, selesai:3, barcode:12,peserta:155,hadir:124,pct:80},
  {no:'09',nama:'Universitas Brawijaya', tipe:'Universitas',jadwal:3, selesai:2, barcode:15,peserta:175,hadir:140,pct:80},
  {no:'10',nama:'PT Karya Unggul',       tipe:'Perusahaan', jadwal:5, selesai:4, barcode:25,peserta:130,hadir:117,pct:90},
];

const BULANAN = [
  {m:'Jan',p:18,s:22,u:8},
  {m:'Feb',p:24,s:28,u:10},
  {m:'Mar',p:30,s:32,u:12},
  {m:'Apr',p:26,s:35,u:9},
  {m:'Mei',p:35,s:40,u:15},
  {m:'Jun',p:28,s:38,u:11},
];

const TB = { Perusahaan:'b-indigo', Sekolah:'b-cyan', Universitas:'b-violet' };

function pctColor(p) {
  if (p===100) return '#10b981';
  if (p>=80) return '#4f46e5';
  if (p>=60) return '#f59e0b';
  return '#ef4444';
}

export const metadata = { title:'Data Rekap — Nayakarsa Admin' };

export default function RekapPage() {
  const totalJadwal   = REKAP.reduce((a,d)=>a+d.jadwal,0);
  const totalSelesai  = REKAP.reduce((a,d)=>a+d.selesai,0);
  const totalPeserta  = REKAP.reduce((a,d)=>a+d.peserta,0);
  const totalHadir    = REKAP.reduce((a,d)=>a+d.hadir,0);
  const avgKehadiran  = Math.round(totalHadir/totalPeserta*100);
  const maxBul        = Math.max(...BULANAN.flatMap(d=>[d.p,d.s,d.u]));

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="chip">📋 Rekap</div>
          <h1>Data Rekap</h1>
          <p>Rekapitulasi lengkap data jadwal, barcode, dan kehadiran seluruh institusi.</p>
        </div>
        <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
          <button className="btn btn-outline btn-sm">📅 Filter Periode</button>
          <button className="btn btn-primary btn-sm">⬇ Export Rekap</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          {icon:'🏢',label:'Total Perusahaan', value:'128',chg:'+12%',up:true, cls:'ico-indigo'},
          {icon:'🏫',label:'Total Sekolah',    value:'87', chg:'+5%', up:true, cls:'ico-cyan'},
          {icon:'🎓',label:'Total Universitas',value:'34', chg:'+3%', up:true, cls:'ico-violet'},
          {icon:'📅',label:'Jadwal Selesai',   value:totalSelesai,chg:'+18%',up:true,cls:'ico-emerald'},
          {icon:'👥',label:'Total Peserta',    value:totalPeserta.toLocaleString('id'),chg:'+9%',up:true,cls:'ico-amber'},
          {icon:'✅',label:'Rata Kehadiran',   value:`${avgKehadiran}%`,chg:'+2%',up:true,cls:'ico-rose'},
        ].map(s=>(
          <div className="stat-card" key={s.label}>
            <div className={`stat-ico ${s.cls}`}>{s.icon}</div>
            <div>
              <div className="stat-val">{s.value}</div>
              <div className="stat-lbl">{s.label}</div>
              <div className={`stat-chg ${s.up?'chg-up':'chg-dn'}`}>{s.up?'↑':'↓'} {s.chg}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Distribusi */}
      <div className="g2" style={{margin:'20px 0'}}>
        {/* Bar Chart */}
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Rekap Jadwal Bulanan</div>
              <div className="card-sub">Jumlah jadwal 6 bulan terakhir per kategori</div>
            </div>
            <div style={{display:'flex',gap:'6px'}}>
              <span className="badge b-indigo">Perusahaan</span>
              <span className="badge b-cyan">Sekolah</span>
              <span className="badge b-violet">Universitas</span>
            </div>
          </div>
          <div className="card-body">
            <div style={{display:'flex',gap:'10px',height:'200px',alignItems:'flex-end'}}>
              {BULANAN.map(d=>(
                <div key={d.m} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'6px'}}>
                  <div style={{display:'flex',gap:'3px',alignItems:'flex-end',height:'170px'}}>
                    <div title={`Perusahaan: ${d.p}`} style={{width:'12px',height:`${d.p/maxBul*100}%`,background:'rgba(79,70,229,.75)',borderRadius:'3px 3px 0 0'}}/>
                    <div title={`Sekolah: ${d.s}`}    style={{width:'12px',height:`${d.s/maxBul*100}%`,background:'rgba(6,182,212,.75)',borderRadius:'3px 3px 0 0'}}/>
                    <div title={`Universitas: ${d.u}`} style={{width:'12px',height:`${d.u/maxBul*100}%`,background:'rgba(139,92,246,.75)',borderRadius:'3px 3px 0 0'}}/>
                  </div>
                  <span style={{fontSize:'11px',color:'#94a3b8',fontWeight:500}}>{d.m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Distribusi & Ringkasan */}
        <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
          {[
            {label:'Perusahaan',val:128,total:249,color:'#4f46e5'},
            {label:'Sekolah',   val:87, total:249,color:'#0891b2'},
            {label:'Universitas',val:34,total:249,color:'#7c3aed'},
          ].map(d=>{
            const pct=Math.round(d.val/d.total*100);
            return (
              <div className="card" key={d.label} style={{padding:'18px 22px'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                  <span style={{fontWeight:700,fontSize:'14px',color:'#0f172a'}}>{d.label}</span>
                  <span style={{fontWeight:800,fontSize:'14px',color:d.color}}>{d.val} ({pct}%)</span>
                </div>
                <div className="prog-wrap">
                  <div className="prog-bar" style={{width:`${pct}%`,background:d.color}}/>
                </div>
              </div>
            );
          })}

          <div className="card" style={{padding:'18px 22px',background:'linear-gradient(135deg,#4f46e5,#7c3aed)',border:'none'}}>
            <div style={{fontSize:'12px',fontWeight:'700',color:'rgba(255,255,255,.7)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:'8px'}}>Total Institusi</div>
            <div style={{fontSize:'36px',fontWeight:'900',color:'#fff',letterSpacing:'-.03em'}}>249</div>
            <div style={{fontSize:'13px',color:'rgba(255,255,255,.7)',marginTop:'4px'}}>Terdaftar di sistem Nayakarsa</div>
          </div>
        </div>
      </div>

      {/* Tabel Rekap */}
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Detail Rekap per Institusi</div>
            <div className="card-sub">Rincian kehadiran dan progres setiap institusi</div>
          </div>
          <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
            <select className="form-select">
              <option>Semua Tipe</option>
              <option>Perusahaan</option>
              <option>Sekolah</option>
              <option>Universitas</option>
            </select>
          </div>
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>#</th>
                <th>Nama Institusi</th>
                <th>Tipe</th>
                <th>Jadwal</th>
                <th>Selesai</th>
                <th>Barcode</th>
                <th>Peserta</th>
                <th>Hadir</th>
                <th>Kehadiran</th>
              </tr>
            </thead>
            <tbody>
              {REKAP.map(r=>(
                <tr key={r.no}>
                  <td style={{color:'#94a3b8',fontWeight:600,fontSize:'12px'}}>{r.no}</td>
                  <td style={{fontWeight:600}}>{r.nama}</td>
                  <td><span className={`badge ${TB[r.tipe]}`}>{r.tipe}</span></td>
                  <td>{r.jadwal}</td>
                  <td>
                    <span style={{color:r.selesai===r.jadwal?'#059669':'#475569',fontWeight:600}}>
                      {r.selesai}/{r.jadwal}
                    </span>
                  </td>
                  <td>{r.barcode}</td>
                  <td style={{fontWeight:600}}>{r.peserta.toLocaleString('id')}</td>
                  <td style={{fontWeight:600}}>{r.hadir.toLocaleString('id')}</td>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                      <div className="prog-wrap" style={{flex:1,minWidth:'60px'}}>
                        <div className="prog-bar" style={{width:`${r.pct}%`,background:pctColor(r.pct)}}/>
                      </div>
                      <span style={{fontSize:'12px',fontWeight:700,color:pctColor(r.pct),minWidth:'36px'}}>
                        {r.pct}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pager">
          <span className="pager-info">Menampilkan 1–{REKAP.length} dari {REKAP.length} data</span>
          <div className="pager-btns">
            {['‹','1','2','›'].map((p,i)=>(
              <button key={i} className={`pager-btn ${p==='1'?'on':''}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
