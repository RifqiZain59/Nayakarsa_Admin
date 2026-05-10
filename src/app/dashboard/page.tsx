"use client";

import { motion } from "framer-motion";
import { Users, Calendar, CheckCircle, Clock, Activity } from "lucide-react";

const stats = [
  { name: "Total Pengguna", value: "1,234", icon: Users, color: "#6366f1", trend: "+12%" },
  { name: "Jadwal Aktif", value: "42", icon: Calendar, color: "#10b981", trend: "+5" },
  { name: "Selesai", value: "89%", icon: CheckCircle, color: "#f59e0b", trend: "+2%" },
  { name: "Waktu Rata-rata", value: "12m", icon: Clock, color: "#ec4899", trend: "-1m" },
];

export default function DashboardPage() {
  return (
    <div style={{ width: '100%', animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        {/* KOTAK JUDUL - Tinggi persis 48px agar rata dengan logo sidebar */}
        <div style={{ height: '48px', display: 'flex', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '2.15rem', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.03em', lineHeight: 1 }}>
            Dashboard Overview
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
          <Activity size={16} color="#4f46e5" />
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem', fontWeight: 500 }}>
            <span style={{ color: '#4f46e5', fontWeight: 700 }}>Sistem Live</span> • Ringkasan aktivitas administrasi hari ini.
          </p>
        </div>
      </header>

      {/* Grid Statistik */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card"
            style={{ padding: '1.5rem', background: '#fff', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ background: `${stat.color}15`, padding: '0.75rem', borderRadius: '1rem', color: stat.color }}>
                <stat.icon size={24} />
              </div>
              <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700, background: '#f0fdf4', padding: '0.25rem 0.6rem', borderRadius: '1rem' }}>{stat.trend}</span>
            </div>
            <p style={{ margin: '0 0 0.25rem 0', color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>{stat.name}</p>
            <h3 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#1e293b' }}>{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card" style={{ height: '350px', background: '#fff', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Activity size={48} color="#e2e8f0" style={{ marginBottom: '1rem' }} />
          <p style={{ margin: 0, color: '#94a3b8', fontWeight: 500 }}>Grafik Aktivitas Terbaru</p>
        </div>
        <div className="glass-card" style={{ height: '350px', background: '#fff', padding: '2rem' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.15rem', fontWeight: 700, color: '#1e293b' }}>Log Notifikasi</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2, 3].map(n => (
              <div key={n} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #f1f5f9' }}>
                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#334155', fontWeight: 600 }}>Pembaruan sistem berhasil</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>Baru saja</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}