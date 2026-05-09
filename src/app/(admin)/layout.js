'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Topbar  from '@/components/Topbar';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('nyk_auth');
    const category = localStorage.getItem('nyk_category') || 'superadmin';
    
    if (!auth) {
      router.replace('/login');
      return;
    }

    // Role-based route protection
    // Check if the current path is allowed for this category
    const isRestrictedPath = (path, cat) => {
      if (cat === 'superadmin') return false; // Superadmin has access to everything
      
      const restrictedMap = {
        'perusahaan': ['/jadwal/sekolah', '/jadwal/universitas', '/barcode/sekolah', '/barcode/universitas'],
        'sekolah':    ['/jadwal/perusahaan', '/jadwal/universitas', '/barcode/perusahaan', '/barcode/universitas'],
        'universitas':['/jadwal/perusahaan', '/jadwal/sekolah', '/barcode/perusahaan', '/barcode/sekolah'],
      };

      const restricted = restrictedMap[cat] || [];
      return restricted.some(r => path.startsWith(r));
    };

    if (isRestrictedPath(pathname, category)) {
      // Redirect to the allowed dashboard or their specific category page
      router.replace('/dashboard');
      return;
    }

    setIsAuthorized(true);
    setLoading(false);
  }, [router, pathname]);

  if (loading) {
    return (
      <div style={{height:'100vh', width:'100vw', display:'flex', alignItems:'center', justifyContent:'center', background:'#f1f5f9'}}>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'24px', marginBottom:'10px', animation: 'spin 2s linear infinite'}}>💠</div>
          <div style={{fontSize:'13px', color:'#94a3b8', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.05em'}}>Memverifikasi Akses...</div>
          <style jsx>{`
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          `}</style>
        </div>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <div style={{display:'flex', minHeight:'100vh'}}>
      <Sidebar />
      <div className="main-wrap">
        <Topbar />
        <main className="page">{children}</main>
      </div>
    </div>
  );
}
