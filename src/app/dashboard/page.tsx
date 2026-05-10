"use client";

import { motion } from "framer-motion";
import { Users, Calendar, CheckCircle, Clock } from "lucide-react";

const stats = [
  { name: "Total Pengguna", value: "1,234", icon: Users, color: "#6366f1" },
  { name: "Jadwal Aktif", value: "42", icon: Calendar, color: "#10b981" },
  { name: "Selesai", value: "89%", icon: CheckCircle, color: "#f59e0b" },
  { name: "Waktu Rata-rata", value: "12m", icon: Clock, color: "#ec4899" },
];

export default function DashboardPage() {
  return (
    <div>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Dashboard Overview</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome back to your administration panel.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card"
            style={{ padding: '1.5rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{stat.name}</p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stat.value}</h3>
              </div>
              <div style={{ background: `${stat.color}20`, padding: '0.75rem', borderRadius: '0.75rem', color: stat.color }}>
                <stat.icon size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="glass-card" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Aktivitas Terbaru Chart (Recharts Placeholder)</p>
        </div>
        <div className="glass-card" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Notifikasi Sistem</p>
        </div>
      </div>
    </div>
  );
}
