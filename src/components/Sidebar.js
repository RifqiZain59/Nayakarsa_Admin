'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const NAV = [
  { id:'dashboard', label:'Dashboard', href:'/dashboard', icon:'▦' },
  { id:'jadwal', label:'Jadwal', icon:'▤',
    children:[
      { id:'jadwal-p', label:'Perusahaan', href:'/jadwal/perusahaan', cat:'perusahaan' },
      { id:'jadwal-s', label:'Sekolah',    href:'/jadwal/sekolah',    cat:'sekolah' },
      { id:'jadwal-u', label:'Universitas',href:'/jadwal/universitas',cat:'universitas' },
    ]
  },
  { id:'barcode', label:'Barcode', icon:'▦▦',
    children:[
      { id:'barcode-p', label:'Perusahaan', href:'/barcode/perusahaan', cat:'perusahaan' },
      { id:'barcode-s', label:'Sekolah',    href:'/barcode/sekolah',    cat:'sekolah' },
      { id:'barcode-u', label:'Universitas',href:'/barcode/universitas',cat:'universitas' },
    ]
  },
  { id:'rekap',      label:'Data Rekap', href:'/rekap',      icon:'▣' },
  { id:'pengaturan', label:'Pengaturan', href:'/pengaturan', icon:'◈' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [userCat, setUserCat] = useState('superadmin');
  const [userData, setUserData] = useState(null);
  
  const [open, setOpen] = useState(() => {
    const o = {};
    NAV.forEach(item => {
      if (item.children?.some(c => pathname.startsWith(c.href))) o[item.id] = true;
    });
    return o;
  });

  useEffect(() => {
    const cat = localStorage.getItem('nyk_category') || 'superadmin';
    const data = localStorage.getItem('nyk_user_data');
    setUserCat(cat);
    if (data) setUserData(JSON.parse(data));
  }, []);

  const toggle = id => setOpen(p => ({ ...p, [id]: !p[id] }));
  const isAct  = href => pathname === href || pathname.startsWith(href + '/');

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  // Filter navigation based on user category
  const filteredNav = NAV.map(item => {
    if (item.children) {
      const filteredChildren = item.children.filter(child => 
        userCat === 'superadmin' || child.cat === userCat
      );
      
      if (filteredChildren.length === 0) return null;
      return { ...item, children: filteredChildren };
    }
    
    // Some pages might be restricted to superadmin only
    if (item.id === 'rekap' && userCat !== 'superadmin') return null;
    
    return item;
  }).filter(Boolean);

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          {userCat === 'perusahaan' ? '🏢' : userCat === 'sekolah' ? '🏫' : userCat === 'universitas' ? '🎓' : 'N'}
        </div>
        <div>
          <div className="logo-title">Nayakarsa</div>
          <div className="logo-sub">
            {userCat === 'superadmin' ? 'Super Admin Panel' : 
             `${userCat.charAt(0).toUpperCase() + userCat.slice(1)} Panel`}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <span className="nav-label">Menu Utama</span>

        {filteredNav.map(item => {
          const hasChild = !!item.children;
          const parentAct = hasChild && item.children.some(c => isAct(c.href));

          if (hasChild) return (
            <div key={item.id}>
              <div
                className={`nav-item ${parentAct ? 'active' : ''}`}
                onClick={() => toggle(item.id)}
              >
                <span className="nav-icon" style={{fontFamily:'monospace',fontWeight:'700'}}>{item.icon}</span>
                <span>{item.label}</span>
                <span className={`nav-chevron ${open[item.id] ? 'open' : ''}`}>▾</span>
              </div>
              {open[item.id] && (
                <div className="nav-sub">
                  {item.children.map(c => (
                    <Link key={c.id} href={c.href}
                      className={`nav-sub-item ${isAct(c.href) ? 'active' : ''}`}>
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );

          return (
            <Link key={item.id} href={item.href}
              className={`nav-item ${isAct(item.href) ? 'active' : ''}`}>
              <span className="nav-icon" style={{fontFamily:'monospace',fontWeight:'700'}}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}

        <span className="nav-label" style={{marginTop:'8px'}}>Akun</span>
        <div className="nav-item" onClick={handleLogout} style={{color:'#ef4444'}}>
          <span className="nav-icon">↩</span>
          <span>Keluar</span>
        </div>
      </nav>

      {/* User */}
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar" style={{background: userCat === 'perusahaan' ? '#4f46e5' : userCat === 'sekolah' ? '#0891b2' : userCat === 'universitas' ? '#7c3aed' : ''}}>
            {userData?.name ? userData.name.substring(0,2).toUpperCase() : 'AD'}
          </div>
          <div>
            <div className="user-name">{userData?.name || 'Administrator'}</div>
            <div className="user-role">{userCat.toUpperCase()}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
