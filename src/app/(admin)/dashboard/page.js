'use client';
import { useState, useEffect } from 'react';

const STATS = [
  { id:'perusahaan', icon:'🏢', label:'Total Perusahaan', value:'128', chg:'+12%', up:true,  cls:'ico-indigo' },
  { id:'sekolah',    icon:'🏫', label:'Total Sekolah',    value:'87',  chg:'+5%',  up:true,  cls:'ico-cyan'   },
  { id:'universitas',icon:'🎓', label:'Total Universitas',value:'34',  chg:'+3%',  up:true,  cls:'ico-violet' },
  { id:'jadwal',     icon:'📅', label:'Jadwal Aktif',     value:'249', chg:'+18%', up:true,  cls:'ico-emerald'},
  { id:'barcode',    icon:'📊', label:'Barcode Dicetak',  value:'1.842',chg:'-2%', up:false, cls:'ico-amber'  },
  { id:'rekap',      icon:'📋', label:'Data Rekap',       value:'320', chg:'+9%',  up:true,  cls:'ico-rose'   },
];

const ACTIVITY = [
  { text:'Jadwal baru ditambahkan untuk PT Maju Bersama',  time:'5 menit lalu',  color:'#4f46e5', cat:'perusahaan' },
  { text:'Barcode dicetak untuk SMK Negeri 1 Jakarta',    time:'20 menit lalu', color:'#0891b2', cat:'sekolah' },
  { text:'Data rekap Universitas Indonesia diperbarui',   time:'1 jam lalu',    color:'#059669', cat:'universitas' },
  { text:'Pengaturan sistem disimpan oleh Super Admin',   time:'2 jam lalu',    color:'#d97706', cat:'superadmin' },
  { text:'Jadwal Universitas Gadjah Mada ditambahkan',    time:'3 jam lalu',    color:'#4f46e5', cat:'universitas' },
  { text:'Barcode Universitas Airlangga digenerate',      time:'5 jam lalu',    color:'#0891b2', cat:'universitas' },
];

const CHART = [
  { m:'Jan', p:35, s:55, u:25 },
  { m:'Feb', p:50, s:60, u:30 },
  { m:'Mar', p:45, s:75, u:40 },
  { m:'Apr', p:70, s:65, u:35 },
  { m:'Mei', p:85, s:80, u:50 },
  { m:'Jun', p:60, s:70, u:45 },
];

const TABEL = [
  { name:'PT Maju Bersama',        type:'Perusahaan', cat:'perusahaan', jadwal:12, barcode:45, status:'Aktif' },
  { name:'SMK Negeri 1 Jakarta',   type:'Sekolah',    cat:'sekolah',    jadwal:8,  barcode:30, status:'Aktif' },
  { name:'Universitas Indonesia',  type:'Universitas',cat:'universitas',jadwal:5,  barcode:22, status:'Aktif' },
  { name:'CV Tekno Mandiri',       type:'Perusahaan', cat:'perusahaan', jadwal:3,  barcode:15, status:'Aktif' },
  { name:'SMA Negeri 5 Bandung',   type:'Sekolah',    cat:'sekolah',    jadwal:6,  barcode:18, status:'Nonaktif' },
  { name:'Institut Teknologi Bdg', type:'Universitas',cat:'universitas',jadwal:4,  barcode:20, status:'Aktif' },
];

const typeBadge = { Perusahaan:'b-indigo', Sekolah:'b-cyan', Universitas:'b-violet' };

export default function DashboardPage() {
  const [userCat, setUserCat] = useState('superadmin');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cat = localStorage.getItem('nyk_category') || 'superadmin';
    setUserCat(cat);
    setLoading(false);
  }, []);

  if (loading) return <div style={{padding:'40px',textAlign:'center',color:'#94a3b8'}}>Memuat Dashboard...</div>;

  const filteredStats = STATS.filter(s => 
    userCat === 'superadmin' || s.id === userCat || s.id === 'jadwal' || s.id === 'barcode' || s.id === 'rekap'
  );

  const filteredActivity = ACTIVITY.filter(a => 
    userCat === 'superadmin' || a.cat === userCat || a.cat === 'superadmin'
  );

  const filteredTable = TABEL.filter(r => 
    userCat === 'superadmin' || r.cat === userCat
  );

  return (
    <div>
      {/* Header */}
      <div className="page-head">
        <div>
          <div className="chip">📊 Overview — {userCat.toUpperCase()}</div>
          <h1>Dashboard</h1>
          <p>
            {userCat === 'superadmin' 
              ? 'Ringkasan data seluruh institusi sistem Nayakarsa.' 
              : `Panel administrasi khusus kategori ${userCat.charAt(0).toUpperCase() + userCat.slice(1)}.`}
          </p>
        </div>
        <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
          <button className="btn btn-outline btn-sm">⬇ Export</button>
          <button className="btn btn-primary btn-sm">＋ Tambah Data</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {filteredStats.map(s => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-ico ${s.cls}`}>{s.icon}</div>
            <div>
              <div className="stat-val">{s.value}</div>
              <div className="stat-lbl">{s.label}</div>
              <div className={`stat-chg ${s.up?'chg-up':'chg-dn'}`}>
                {s.up?'↑':'↓'} {s.chg} bulan ini
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="g2" style={{marginBottom:'20px'}}>

        {/* Bar chart */}
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Tren Pendaftaran</div>
              <div className="card-sub">Statistik pendaftaran 6 bulan terakhir</div>
            </div>
            <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
              {(userCat === 'superadmin' || userCat === 'perusahaan') && <span className="badge b-indigo">Perusahaan</span>}
              {(userCat === 'superadmin' || userCat === 'sekolah') && <span className="badge b-cyan">Sekolah</span>}
              {(userCat === 'superadmin' || userCat === 'universitas') && <span className="badge b-violet">Universitas</span>}
            </div>
          </div>
          <div className="card-body">
            <div style={{display:'flex',gap:'8px',height:'190px',alignItems:'flex-end'}}>
              {CHART.map(d => (
                <div key={d.m} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'6px'}}>
                  <div style={{display:'flex',gap:'3px',alignItems:'flex-end',height:'160px'}}>
                    {(userCat === 'superadmin' || userCat === 'perusahaan') && 
                      <div style={{width:'11px',height:`${d.p}%`,background:'rgba(79,70,229,.75)',borderRadius:'3px 3px 0 0'}} title={`${d.p}`}/>}
                    {(userCat === 'superadmin' || userCat === 'sekolah') && 
                      <div style={{width:'11px',height:`${d.s}%`,background:'rgba(6,182,212,.75)',borderRadius:'3px 3px 0 0'}} title={`${d.s}`}/>}
                    {(userCat === 'superadmin' || userCat === 'universitas') && 
                      <div style={{width:'11px',height:`${d.u}%`,background:'rgba(139,92,246,.75)',borderRadius:'3px 3px 0 0'}} title={`${d.u}`}/>}
                  </div>
                  <span style={{fontSize:'11px',color:'#94a3b8',fontWeight:500}}>{d.m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity */}
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Aktivitas Terbaru</div>
              <div className="card-sub">Log aktivitas {userCat !== 'superadmin' ? 'kategori Anda' : 'sistem'}</div>
            </div>
            <span className="badge b-emerald">Live</span>
          </div>
          <div className="card-body">
            <div className="timeline">
              {filteredActivity.map((a,i)=>(
                <div className="tl-item" key={i}>
                  <div style={{position:'relative',display:'flex',flexDirection:'column',alignItems:'center'}}>
                    <div className="tl-dot" style={{background:a.color}}/>
                    {i < filteredActivity.length-1 && <div className="tl-line"/>}
                  </div>
                  <div>
                    <div className="tl-title">{a.text}</div>
                    <div className="tl-time">{a.time}</div>
                  </div>
                </div>
              ))}
              {filteredActivity.length === 0 && <div style={{fontSize:'13px',color:'#94a3b8',textAlign:'center'}}>Belum ada aktivitas.</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Distribusi - Only show for Superadmin */}
      {userCat === 'superadmin' && (
        <div className="g3" style={{marginBottom:'20px'}}>
          {[
            {label:'Perusahaan',val:128,total:249,color:'#4f46e5'},
            {label:'Sekolah',   val:87, total:249,color:'#0891b2'},
            {label:'Universitas',val:34,total:249,color:'#7c3aed'},
          ].map(d=>{
            const pct = Math.round(d.val/d.total*100);
            return (
              <div className="card" key={d.label} style={{padding:'20px 24px'}}>
                <div style={{fontSize:'12px',fontWeight:'700',color:'#94a3b8',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:'12px'}}>
                  {d.label}
                </div>
                <div style={{fontSize:'32px',fontWeight:'800',color:'#0f172a',letterSpacing:'-.03em',marginBottom:'4px'}}>{d.val}</div>
                <div style={{fontSize:'13px',color:'#94a3b8',marginBottom:'14px'}}>dari {d.total} institusi ({pct}%)</div>
                <div className="prog-wrap">
                  <div className="prog-bar" style={{width:`${pct}%`,background:d.color}}/>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tabel */}
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Institusi Terdaftar</div>
            <div className="card-sub">{userCat === 'superadmin' ? 'Daftar institusi terbaru' : `Daftar unit ${userCat} Anda`}</div>
          </div>
          <button className="btn btn-outline btn-sm">Lihat Semua</button>
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>#</th>
                <th>Nama Institusi</th>
                <th>Tipe</th>
                <th>Jadwal Aktif</th>
                <th>Barcode</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTable.map((r,i)=>(
                <tr key={i}>
                  <td style={{color:'#94a3b8',fontWeight:600,fontSize:'12px'}}>{String(i+1).padStart(2,'0')}</td>
                  <td style={{fontWeight:600}}>{r.name}</td>
                  <td><span className={`badge ${typeBadge[r.type]}`}>{r.type}</span></td>
                  <td><strong>{r.jadwal}</strong> jadwal</td>
                  <td><strong>{r.barcode}</strong> kode</td>
                  <td><span className={`badge ${r.status==='Aktif'?'b-emerald':'b-slate'}`}>{r.status}</span></td>
                  <td>
                    <div style={{display:'flex',gap:'6px'}}>
                      <button className="btn btn-outline btn-sm">Detail</button>
                      <button className="btn btn-outline btn-sm">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTable.length === 0 && <tr><td colSpan="7" style={{textAlign:'center',padding:'20px',color:'#94a3b8'}}>Tidak ada data ditemukan.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
