"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  Calendar, 
  QrCode, 
  Database, 
  Users, 
  Settings, 
  LogOut 
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Jadwal", icon: Calendar, path: "/dashboard/jadwal" },
  { name: "Barcode", icon: QrCode, path: "/dashboard/barcode" },
  { name: "Rekap Data", icon: Database, path: "/dashboard/rekap-data" },
  { name: "Kelola Akun", icon: Users, path: "/dashboard/kelola-akun" },
  { name: "Pengaturan", icon: Settings, path: "/dashboard/pengaturan" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("user_role");
    if (storedRole) setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_id");
    router.push("/login");
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="glass-card" style={{ 
        width: '260px', 
        borderRadius: '0', 
        borderLeft: 'none', 
        borderTop: 'none', 
        borderBottom: 'none',
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem 1rem'
      }}>
        <div style={{ marginBottom: '2.5rem', padding: '0 1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>NAYAKARSA</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {role} PANEL
          </p>
        </div>

        <nav style={{ flex: 1 }}>
          {menuItems.map((item) => (
            <div 
              key={item.name}
              onClick={() => router.push(item.path)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                padding: '0.75rem 1rem', 
                marginBottom: '0.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                color: 'var(--text-secondary)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <item.icon size={20} />
              <span style={{ fontSize: '0.925rem' }}>{item.name}</span>
            </div>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            padding: '0.75rem 1rem', 
            background: 'transparent',
            border: 'none',
            color: '#f87171',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
