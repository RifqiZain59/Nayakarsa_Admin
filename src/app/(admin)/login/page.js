'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collectionGroup, getDocs } from 'firebase/firestore';
import CryptoJS from 'crypto-js';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Masuk ke Sistem');
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');

  useEffect(() => {
    if (err) setErr('');
  }, [form]);

  // Fungsi Dekripsi
  const decryptValue = (cipherText) => {
    const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'KUNCI_RAHASIA_ANDA';
    if (!cipherText || typeof cipherText !== 'string') return cipherText;

    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      return originalText ? originalText : cipherText;
    } catch (e) {
      return cipherText;
    }
  };

  // Fungsi Jeda Waktu (Artificial Delay)
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setErr('Email dan password wajib diisi.');
      return;
    }

    setLoading(true);
    setErr('');

    try {
      // --- TAHAP 1: KONEKSI (Estimasi: 0.8 Detik) ---
      setLoadingText('Menghubungkan ke server... (1/4)');
      await delay(800);

      const inputEmail = String(form.email).trim().toLowerCase();
      const inputPassword = String(form.password).trim();

      let userFound = null;
      let foundCategory = '';
      const targetCollections = ['perusahaan', 'sekolah', 'universitas'];

      // --- TAHAP 2: PEMINDAIAN DATABASE (Estimasi: 1 Detik) ---
      setLoadingText('Memindai koleksi database... (2/4)');

      const fetchPromises = targetCollections.map(catName =>
        getDocs(collectionGroup(db, catName)).then(snap => ({
          category: catName,
          docs: snap.docs
        }))
      );
      const results = await Promise.all(fetchPromises);

      await delay(1000);

      // --- TAHAP 3: DEKRIPSI & PENCOCOKAN (Estimasi: 1 Detik) ---
      setLoadingText('Mencocokkan enkripsi data... (3/4)');

      for (const result of results) {
        for (const doc of result.docs) {
          const data = doc.data();

          const rawEmail = data.email || data.Email || "";
          const dbEmail = String(decryptValue(rawEmail)).trim().toLowerCase();

          if (dbEmail === inputEmail) {
            const rawPassword = data.password || data.Password || "";
            const dbPassword = String(decryptValue(rawPassword)).trim();

            if (dbPassword === inputPassword) {
              userFound = data;
              foundCategory = result.category;
              break;
            }
          }
        }
        if (userFound) break;
      }

      await delay(1000);

      // --- TAHAP 4: EKSEKUSI (Estimasi: 1.2 Detik) ---
      if (userFound) {
        setLoadingText('Login Berhasil! Mengalihkan... (4/4)');

        const finalData = {};
        for (const [key, val] of Object.entries(userFound)) {
          finalData[key] = typeof val === 'string' ? decryptValue(val) : val;
        }

        localStorage.setItem('nyk_auth', '1');
        localStorage.setItem('nyk_category', foundCategory);
        localStorage.setItem('nyk_user_data', JSON.stringify(finalData));

        await delay(1200);
        router.push('/dashboard');
      } else {
        setErr('Data tidak ditemukan. Pastikan email dan password Anda sudah benar.');
        setLoading(false);
        setLoadingText('Masuk ke Sistem');
      }

    } catch (error) {
      console.error("Sistem Error:", error);

      if (error.code === 'permission-denied') {
        setErr('Akses Ditolak: Silakan buka Firebase Console dan pastikan Rules mengizinkan "read".');
      } else {
        setErr(`Gagal Sistem: ${error.message}`);
      }

      setLoading(false);
      setLoadingText('Masuk ke Sistem');
    }
  };

  return (
    <div className="login-page">
      <div className="deco-circle deco-1" />
      <div className="deco-circle deco-2" />
      <div className="deco-circle deco-3" />

      <div className="login-left">
        <div style={{ maxWidth: '540px' }}>
          <div className="login-brand">
            <div className="login-brand-icon">N</div>
            <div>
              <div className="login-brand-name">Nayakarsa</div>
              <div className="login-brand-tagline">Sistem Administrasi Terpadu</div>
            </div>
          </div>

          <h1 className="login-headline">
            Kelola Data<br /><span>Sesuai Institusi</span><br />& Terintegrasi
          </h1>
          <p className="login-desc">
            Sistem memindai sub-koleksi database Anda dengan transisi yang interaktif dan informatif.
          </p>

          <div className="login-features">
            {['Indikator Waktu Jelas', 'Transisi Nyaman', 'Tanpa Firebase Auth', 'Validasi Terenkripsi'].map(f => (
              <div className="login-feat" key={f}>
                <div className="login-feat-dot" />
                <span className="login-feat-text">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-wrap">
          <div style={{ marginBottom: '40px' }}>
            <div className="login-form-title">Pintu Masuk Admin</div>
            <div className="login-form-sub">Masukkan kredensial Anda</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Alamat Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="Masukkan email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="Masukkan password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {err && (
              <div style={{
                padding: '12px 16px',
                background: 'rgba(239,68,68,.08)',
                border: '1px solid rgba(239,68,68,.2)',
                borderRadius: '8px',
                color: '#dc2626',
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '24px',
                wordWrap: 'break-word'
              }}>
                {err}
              </div>
            )}

            <button
              className="login-btn"
              type="submit"
              disabled={loading}
              style={{ transition: 'all 0.3s ease', position: 'relative' }}
            >
              {loadingText}
            </button>

            {/* Teks Penjelasan Estimasi Waktu (Muncul hanya saat loading) */}
            {loading && (
              <div style={{
                marginTop: '16px',
                fontSize: '12.5px',
                color: '#4f46e5',
                textAlign: 'center',
                fontWeight: '600',
                animation: 'pulse 1.5s infinite'
              }}>
                ⏳ Mohon tunggu sekitar 3-4 detik.<br />Sistem sedang melakukan verifikasi keamanan berlapis.
              </div>
            )}
          </form>

          <p style={{ marginTop: '48px', fontSize: '12px', color: '#94a3b8', textAlign: 'center', lineHeight: '1.6' }}>
            Sistem dilengkapi indikator proses langkah demi langkah.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}