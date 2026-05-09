'use client';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const CRUMBS = {
  '/dashboard':          ['Dashboard'],
  '/jadwal/perusahaan':  ['Jadwal','Perusahaan'],
  '/jadwal/sekolah':     ['Jadwal','Sekolah'],
  '/jadwal/universitas': ['Jadwal','Universitas'],
  '/barcode/perusahaan': ['Barcode','Perusahaan'],
  '/barcode/sekolah':    ['Barcode','Sekolah'],
  '/barcode/universitas':['Barcode','Universitas'],
  '/rekap':              ['Data Rekap'],
  '/pengaturan':         ['Pengaturan'],
};

export default function Topbar() {
  const pathname = usePathname();
  const crumbs   = CRUMBS[pathname] || [];
  const [userData, setUserData] = useState({ name: 'Admin', role: 'Superadmin' });

  useEffect(() => {
    const name = JSON.parse(localStorage.getItem('nyk_user_data') || '{}').name || 'Administrator';
    const cat = localStorage.getItem('nyk_category') || 'superadmin';
    setUserData({ 
      name: name, 
      role: cat.charAt(0).toUpperCase() + cat.slice(1) 
    });
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-breadcrumb">
        <span>Admin</span>
        {crumbs.map((c, i) => (
          <span key={i} style={{display:'flex',alignItems:'center',gap:'6px'}}>
            <span style={{fontSize:'12px',opacity:.4}}>›</span>
            <span className={i === crumbs.length - 1 ? 'current' : ''}>{c}</span>
          </span>
        ))}
      </div>

      <div className="topbar-search">
        <span style={{color:'#94a3b8',fontSize:'15px'}}>⌕</span>
        <input placeholder="Cari data..." />
      </div>

      <div className="topbar-notif">
        🔔
        <span className="notif-dot" />
      </div>

      <div style={{display:'flex',alignItems:'center',gap:'10px',
        padding:'6px 14px',borderRadius:'10px',border:'1.5px solid #e2e8f0',cursor:'pointer', background: '#fff'}}>
        <div style={{width:'32px',height:'32px',borderRadius:'50%',
          background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
          display:'flex',alignItems:'center',justifyContent:'center',
          fontSize:'12px',fontWeight:'700',color:'#fff', boxShadow: '0 2px 8px rgba(79,70,229,0.2)'}}>
          {userData.name.substring(0,2).toUpperCase()}
        </div>
        <div>
          <div style={{fontSize:'13px',fontWeight:'700',color:'#0f172a',lineHeight:'1.2'}}>{userData.name}</div>
          <div style={{fontSize:'11px',color:'#94a3b8',fontWeight:'600'}}>{userData.role}</div>
        </div>
        <span style={{fontSize:'11px',color:'#94a3b8',marginLeft:'4px'}}>▾</span>
      </div>
    </header>
  );
}
