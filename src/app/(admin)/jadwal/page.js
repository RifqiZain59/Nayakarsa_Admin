import Link from 'next/link';

export const metadata = {
  title: 'Jadwal — Nayakarsa Admin',
};

export default function JadwalPage() {
  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <div className="section-badge">📅 Jadwal</div>
          <h1>Manajemen Jadwal</h1>
          <p>Pilih kategori institusi untuk mengelola jadwal.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        {[
          { href: '/jadwal/perusahaan', icon: '🏢', label: 'Perusahaan', desc: 'Kelola jadwal untuk perusahaan dan instansi', color: '#4f46e5', count: '128 institusi' },
          { href: '/jadwal/sekolah', icon: '🏫', label: 'Sekolah', desc: 'Kelola jadwal untuk sekolah SMP/SMA/SMK', color: '#0891b2', count: '87 institusi' },
          { href: '/jadwal/universitas', icon: '🎓', label: 'Universitas', desc: 'Kelola jadwal untuk perguruan tinggi', color: '#7c3aed', count: '34 institusi' },
        ].map(item => (
          <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: '28px', cursor: 'pointer', borderTop: `4px solid ${item.color}` }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>{item.icon}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>{item.label}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>{item.desc}</div>
              <span className="badge" style={{ background: `${item.color}18`, color: item.color }}>{item.count}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
