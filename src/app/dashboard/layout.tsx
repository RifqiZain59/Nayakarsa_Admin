"use client";

import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  QrCode,
  Database,
  Users,
  Settings,
  LogOut,
  ShieldCheck,
  ChevronRight
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
  const pathname = usePathname();
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("user_role") || localStorage.getItem("nyk_category");
    if (storedRole) setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar memanggil class dashboard-sidebar */}
      <aside className="dashboard-sidebar">

        {/* HEADER LOGO SIDEBAR - Terkunci dengan .sync-header */}
        <div className="sync-header" style={{ marginBottom: '3rem', gap: '0.85rem' }}>
          <div style={{ background: '#4f46e5', height: '48px', width: '48px', borderRadius: '0.75rem', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={28} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em', lineHeight: 1 }}>NAYAKARSA</h2>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.65rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1 }}>
              • {role || "Admin"} Panel
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <div
                key={item.name}
                onClick={() => router.push(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: isActive ? '#4f46e5' : 'transparent',
                  color: isActive ? '#ffffff' : '#64748b',
                  boxShadow: isActive ? '0 10px 15px -3px rgba(79, 70, 229, 0.3)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span style={{ fontSize: '0.9rem', fontWeight: isActive ? 600 : 500 }}>{item.name}</span>
                </div>
                {isActive && <ChevronRight size={16} />}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.85rem 1rem',
              background: 'rgba(239, 68, 68, 0.05)',
              border: 'none',
              borderRadius: '0.85rem',
              color: '#ef4444',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            <LogOut size={20} />
            <span>Keluar Aplikasi</span>
          </button>
        </div>
      </aside>

      {/* Main Content memanggil class dashboard-main */}
      <main className="dashboard-main">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}