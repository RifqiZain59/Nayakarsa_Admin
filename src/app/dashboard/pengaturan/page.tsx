"use client";

import React, { useEffect, useState } from "react";
import { Shield, User, Lock, CreditCard, ChevronRight, CheckCircle2, ShieldCheck, KeyRound, Save, Building2, UserCircle, AlertTriangle, CalendarClock, Mail, Eye, EyeOff } from "lucide-react";
import { decryptData } from "@/lib/crypto";
import { hashPassword } from "@/lib/db-utils";

// IMPORT FIREBASE UNTUK UPDATE DATABASE
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function PengaturanPage() {
  const [activeTab, setActiveTab] = useState("profil");

  // State Data Profil
  const [userData, setUserData] = useState({
    name: "Menerjemahkan...",
    institutionName: "Menerjemahkan...",
    institutionType: "Menerjemahkan...",
    email: "Menerjemahkan...",
    formattedRemaining: "Menghitung..."
  });

  // State Form Keamanan
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedDataStr = localStorage.getItem("nyk_user_data");
        const sessionRole = localStorage.getItem("user_role") || "Administrator";

        const translateData = (text: string | any) => {
          if (!text || typeof text !== 'string') return text || "";
          try {
            const decrypted = decryptData(text);
            if (decrypted && decrypted.trim() !== "") return decrypted;
            return text;
          } catch (e) {
            return text;
          }
        };

        if (storedDataStr) {
          const parsed = JSON.parse(storedDataStr);
          const targetData = parsed.data ? parsed.data : parsed;

          // Mengambil Durasi Langganan
          const rawDuration = translateData(targetData.subscription?.duration || targetData.duration || "1 Bulan");

          let totalDays = 30;
          if (typeof rawDuration === 'string') {
            const dur = rawDuration.toLowerCase();
            if (dur.includes("1 tahun") || dur.includes("12 bulan")) totalDays = 365;
            else if (dur.includes("6 bulan")) totalDays = 180;
            else if (dur.includes("3 bulan")) totalDays = 90;
            else if (dur.includes("1 bulan")) totalDays = 30;
          }

          let remainingDays = targetData.subscription?.remainingDays || totalDays;
          remainingDays = remainingDays > 0 ? remainingDays - 1 : 0;

          let rem1 = remainingDays % 365;
          let monthsLeft = Math.floor(rem1 / 30);
          let daysLeft = rem1 % 30;

          const targetDate = new Date();
          targetDate.setDate(targetDate.getDate() + remainingDays);
          const targetYear = targetDate.getFullYear();

          let formattedString = `Kurang ${daysLeft} Hari ${monthsLeft > 0 ? monthsLeft + ' Bulan ' : ''}Tahun ${targetYear}`;

          setUserData({
            name: translateData(targetData.name || targetData.institutionName || "Pengguna"),
            institutionName: translateData(targetData.institutionName || targetData.name || "Institusi Tidak Ditemukan"),
            institutionType: translateData(targetData.institutionType || targetData.role || targetData.category || sessionRole),
            email: translateData(targetData.email || "Email tidak ditemukan"),
            formattedRemaining: formattedString
          });
        }
      } catch (error) {
        console.error("Gagal memuat data user:", error);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // FUNGSI UPDATE KATA SANDI (100% TERHUBUNG KE FIRESTORE SEKARANG)
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      alert("Peringatan: Harap isi kata sandi lama dan baru terlebih dahulu!");
      return;
    }

    if (newPassword.length < 6) {
      alert("Peringatan: Kata sandi baru minimal harus 6 karakter.");
      return;
    }

    setIsUpdatingPass(true);

    try {
      const storedStr = localStorage.getItem("nyk_user_data");
      const userId = localStorage.getItem("user_id");
      const parentId = localStorage.getItem("user_parent_id");
      const category = localStorage.getItem("user_category");

      if (!storedStr || !userId || !category) {
        alert("Sesi tidak lengkap, silakan Logout dan Login ulang terlebih dahulu!");
        setIsUpdatingPass(false);
        return;
      }

      const parsed = JSON.parse(storedStr);
      const targetData = parsed.data ? parsed.data : parsed;
      const storedHash = targetData.passwordHash;

      // 1. Validasi Sandi Lama
      const hashedOld = hashPassword(oldPassword);
      if (hashedOld !== storedHash) {
        alert("Akses Ditolak: Kata sandi lama yang Anda masukkan salah.");
        setIsUpdatingPass(false);
        return;
      }

      // 2. Hash Sandi Baru
      const hashedNew = hashPassword(newPassword);

      // 3. UPDATE KE DATABASE FIRESTORE
      let userRef;
      if (parentId && parentId !== "") {
        // Jika user berada di subkoleksi (sekolah/perusahaan/universitas)
        userRef = doc(db, "superadmin", parentId, category, userId);
      } else {
        // Jika user berada di root
        userRef = doc(db, "superadmin", userId);
      }

      await updateDoc(userRef, {
        passwordHash: hashedNew
      });

      // 4. Update Local Storage agar sinkron tanpa perlu login ulang
      targetData.passwordHash = hashedNew;
      if (parsed.data) {
        parsed.data = targetData;
      } else {
        Object.assign(parsed, targetData);
      }
      localStorage.setItem("nyk_user_data", JSON.stringify(parsed));

      alert("Berhasil! Kata sandi Anda telah berhasil diperbarui di Database.");

      // Bersihkan form
      setOldPassword("");
      setNewPassword("");
      setShowOldPassword(false);
      setShowNewPassword(false);

    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem saat menghubungi database Firestore.");
    } finally {
      setIsUpdatingPass(false);
    }
  };

  const menuTabs = [
    { id: "profil", label: "Profil Akun", icon: UserCircle },
    { id: "keamanan", label: "Keamanan Sistem", icon: Lock },
    { id: "paket", label: "Status Langganan", icon: CreditCard },
  ];

  return (
    <div style={{ width: '100%', animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <div className="sync-header">
          <h1 style={{ margin: 0, fontSize: '2.15rem', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>Pengaturan Sistem</h1>
        </div>
        <p style={{ margin: '0.5rem 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>Konfigurasi profil, keamanan, dan detail langganan Anda.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2.5rem', alignItems: 'start' }}>

        {/* SEBELAH KIRI: MENU NAVIGASI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {menuTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '1rem 1.25rem', width: '100%',
                  background: isActive ? '#ffffff' : 'transparent', border: 'none', borderRadius: '1rem',
                  color: isActive ? '#4f46e5' : '#64748b', fontWeight: isActive ? 700 : 600, fontSize: '0.9rem',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isActive ? '0 4px 15px -3px rgba(0, 0, 0, 0.05)' : 'none',
                }}
              >
                <div style={{ padding: '0.4rem', borderRadius: '0.5rem', background: isActive ? '#eef2ff' : 'transparent', color: isActive ? '#4f46e5' : '#94a3b8' }}>
                  <tab.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* SEBELAH KANAN: AREA KONTEN */}
        <div style={{ background: '#ffffff', borderRadius: '1.25rem', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', overflow: 'hidden', minHeight: '500px' }}>

          {/* TAB 1: PROFIL */}
          {activeTab === "profil" && (
            <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
              <div style={{ height: '140px', background: 'linear-gradient(135deg, #4f46e5 0%, #c026d3 100%)', position: 'relative' }} />

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 2.5rem 2.5rem 2.5rem', position: 'relative' }}>

                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#ffffff', padding: '0.4rem', marginTop: '-50px', marginBottom: '1.25rem', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={45} />
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                  <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.85rem', fontWeight: 800, color: '#1e293b', textTransform: 'capitalize' }}>{userData.name}</h2>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.4rem 1.25rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase' }}>
                    <Building2 size={14} /> {userData.institutionType}
                  </div>
                </div>

                <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', background: '#f8fafc', padding: '2rem', borderRadius: '1.25rem', border: '1px solid #f1f5f9' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem' }}>Identitas Resmi Institusi</label>
                    <input type="text" readOnly value={userData.institutionName} style={{ width: '100%', padding: '0.85rem 1.25rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', color: '#1e293b', fontWeight: 600, fontSize: '0.95rem', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem' }}>Email Korespondensi</label>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0 1.25rem' }}>
                      <Mail size={18} color="#94a3b8" />
                      <input type="email" readOnly value={userData.email} style={{ width: '100%', padding: '0.85rem 0.75rem', background: 'transparent', border: 'none', color: '#1e293b', fontWeight: 600, fontSize: '0.95rem', outline: 'none' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem' }}>Otoritas Keamanan</label>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0 1.25rem' }}>
                      <ShieldCheck size={18} color="#10b981" />
                      <input type="text" readOnly value="Admin" style={{ width: '100%', padding: '0.85rem 0.75rem', background: 'transparent', border: 'none', color: '#1e293b', fontWeight: 600, fontSize: '0.95rem', outline: 'none' }} />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: KEAMANAN */}
          {activeTab === "keamanan" && (
            <div style={{ padding: '2.5rem', animation: 'fadeIn 0.3s ease-out' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '2rem' }}>Keamanan Kriptografi</h2>

              <div style={{ padding: '2rem', border: '1px solid #e2e8f0', borderRadius: '1.25rem', background: '#f8fafc' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem' }}>Perbarui Kata Sandi Akses</h3>

                {/* FORM SUBMIT */}
                <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem' }}>Kata Sandi Saat Ini</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type={showOldPassword ? "text" : "password"}
                        placeholder="Masukkan sandi saat ini"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        style={{ width: '100%', padding: '1rem 3rem 1rem 1.25rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.75rem', outline: 'none', fontSize: '0.95rem' }}
                        required
                      />
                      <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} style={{ position: 'absolute', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                        {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem' }}>Kata Sandi Baru</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Buat sandi baru yang kuat"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={{ width: '100%', padding: '1rem 3rem 1rem 1.25rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.75rem', outline: 'none', fontSize: '0.95rem' }}
                        required
                      />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} style={{ position: 'absolute', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingPass}
                    style={{
                      marginTop: '1rem',
                      alignSelf: 'flex-start',
                      padding: '1rem 2.5rem',
                      background: isUpdatingPass ? '#94a3b8' : '#4f46e5',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '0.75rem',
                      fontWeight: 700,
                      cursor: isUpdatingPass ? 'not-allowed' : 'pointer',
                      boxShadow: isUpdatingPass ? 'none' : '0 4px 10px rgba(79, 70, 229, 0.3)',
                      transition: 'all 0.2s'
                    }}>
                    <Save size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    {isUpdatingPass ? 'Memverifikasi Database...' : 'Simpan Perubahan'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: PAKET */}
          {activeTab === "paket" && (
            <div style={{ padding: '2.5rem', animation: 'fadeIn 0.3s ease-out' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '2rem' }}>Status Layanan</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ width: '100%', padding: '2rem 2.5rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.5rem', boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.15)' }}>
                  <div style={{ background: '#f59e0b', padding: '1.25rem', borderRadius: '1rem', color: '#fff' }}>
                    <CalendarClock size={40} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Sisa Masa Berlaku</p>
                    <h3 style={{ margin: '0.35rem 0 0 0', fontSize: '2rem', fontWeight: 800, color: '#78350f' }}>
                      {userData.formattedRemaining}
                    </h3>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2rem', padding: '1.25rem 1.5rem', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '1rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', color: '#dc2626' }}>
                <AlertTriangle size={24} style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 800 }}>Peringatan Sistem</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.5 }}>
                    Masa berlaku paket Anda akan berkurang secara otomatis setiap harinya. Pastikan untuk melakukan perpanjangan lisensi sebelum sisa hari mencapai 0 untuk menghindari pemblokiran akses.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}