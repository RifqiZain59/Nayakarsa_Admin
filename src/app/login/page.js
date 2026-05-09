'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, collection, getDocs, limit, query } from 'firebase/firestore';

export default function LoginPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');

  useEffect(() => {
    if (err) setErr('');
  }, [form]);

  /**
   * Mendeteksi Role berdasarkan Struktur Sub-collection:
   * Path: superadmin (collection) -> [UID] (doc) -> [perusahaan/sekolah/universitas] (sub-collection)
   */
  const findUserCategory = async (uid) => {
    const categories = ['perusahaan', 'sekolah', 'universitas'];
    
    // 1. Ambil data utama dari dokumen superadmin/[UID]
    try {
      const mainDocRef = doc(db, 'superadmin', uid);
      const mainDocSnap = await getDoc(mainDocRef);
      const mainData = mainDocSnap.exists() ? mainDocSnap.data() : {};

      // 2. Cek eksistensi sub-collection untuk menentukan kategori
      for (const cat of categories) {
        try {
          // Kita coba ambil 1 dokumen dari sub-collection tersebut
          const subColRef = collection(db, 'superadmin', uid, cat);
          const q = query(subColRef, limit(1));
          const subSnap = await getDocs(q);
          
          // Jika sub-collection memiliki isi, berarti itu adalah rolenya
          if (!subSnap.empty) {
            return { 
              category: cat, 
              data: { ...mainData, ...(subSnap.docs[0].data()) } 
            };
          }
        } catch (e) {
          console.error(`Gagal mengecek sub-koleksi ${cat}:`, e);
        }
      }

      // 3. Fallback: Jika tidak ada sub-koleksi spesifik, cek jika dokumen utamanya ada
      if (mainDocSnap.exists()) {
        return { category: mainData.role || 'superadmin', data: mainData };
      }
    } catch (e) {
      console.error("Gagal melakukan verifikasi dokumen superadmin:", e);
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setErr('Email dan password wajib diisi.');
      return;
    }

    setLoading(true);

    try {
      // 1. Login via Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
      
      // 2. Deteksi Kategori dari Sub-collection
      const userCategory = await findUserCategory(user.uid);

      if (userCategory) {
        localStorage.setItem('nyk_auth', '1');
        localStorage.setItem('nyk_category', userCategory.category);
        localStorage.setItem('nyk_user_data', JSON.stringify(userCategory.data));
        router.push('/dashboard');
      } else {
        setErr('Akun terdeteksi, namun data institusi tidak ditemukan di sub-collection superadmin.');
      }
    } catch (error) {
      console.error("Login Error:", error.code);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        setErr('Email atau password salah. Silakan periksa kembali.');
      } else {
        setErr('Gagal masuk. Pastikan akun terdaftar di Firebase Authentication.');
      }
    } finally {
      setLoading(false);
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
            Sistem cerdas yang otomatis mendeteksi role Anda melalui struktur sub-collection <b>superadmin</b> yang terorganisir.
          </p>

          <div className="login-features">
            {['Analisis Sub-collection Otomatis','Multi-tenant Architecture','Keamanan Firebase Auth','Data Terenkripsi'].map(f=>(
              <div className="login-feat" key={f}>
                <div className="login-feat-dot" />
                <span className="login-feat-text">{f}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '60px', display: 'flex', gap: '50px' }}>
            {[['3', 'Kategori'], ['Cloud', 'Database'], ['Safe', 'Security']].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontSize: '36px', fontWeight: '800', color: '#fff', letterSpacing: '-.03em' }}>{v}</div>
                <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '.05em' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-wrap">
          <div style={{ marginBottom: '40px' }}>
            <div className="login-form-title">Pintu Masuk Admin</div>
            <div className="login-form-sub">Sistem akan otomatis mendeteksi kategori institusi Anda</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Alamat Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="email@institusi.ac.id"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type={show ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{ paddingRight: '48px' }}
                  required
                />
                <button type="button" onClick={() => setShow(!show)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#94a3b8' }}>
                  {show ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {err && (
              <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)',
                borderRadius: '8px', color: '#dc2626', fontSize: '13px', fontWeight: '600', marginBottom: '24px' }}>
                ⚠️ {err}
              </div>
            )}

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? 'Memverifikasi...' : 'Masuk ke Sistem'}
            </button>
          </form>

          <p style={{ marginTop: '48px', fontSize: '12px', color: '#94a3b8', textAlign: 'center', lineHeight: '1.6' }}>
            Pastikan akun Anda sudah terdaftar di koleksi <b>superadmin</b>.<br />
            Gunakan kredensial yang valid untuk akses.
          </p>
        </div>
      </div>
    </div>
  );
}
