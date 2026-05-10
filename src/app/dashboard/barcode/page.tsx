import { QrCode, Scan } from "lucide-react";

export default function BarcodePage() {
  return (
    <div style={{ width: '100%' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#1e293b' }}>Scanner Barcode</h1>
        <p style={{ color: '#64748b' }}>Fungsi pemindaian dan pembuatan barcode institusi.</p>
      </header>
      <div className="glass-card" style={{ background: '#fff', padding: '3rem', textAlign: 'center', border: '1px solid #f1f5f9' }}>
        <div style={{ display: 'inline-flex', padding: '2rem', background: '#f5f3ff', color: '#7c3aed', borderRadius: '2rem', marginBottom: '1.5rem' }}>
          <QrCode size={64} />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>Siap Memindai</h2>
        <p style={{ color: '#94a3b8', maxWidth: '400px', margin: '0.5rem auto 2rem' }}>Arahkan kamera ke barcode untuk melakukan verifikasi data secara otomatis.</p>
        <button style={{ padding: '0.75rem 2rem', background: '#4f46e5', color: '#fff', borderRadius: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Buka Kamera</button>
      </div>
    </div>
  );
}