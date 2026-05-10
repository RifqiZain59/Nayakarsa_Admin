"use client";

import React, { useEffect, useState, useRef } from "react";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Calendar, Plus, Edit, Trash2, X, UserCheck, Clock, UploadCloud, FileText } from "lucide-react";

// Struktur Data Jadwal yang disederhanakan
interface Schedule {
  id: string;
  namaOrang: string;
  waktuMasuk: string;
  waktuPulang: string;
  status: string;
}

export default function JadwalPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("institusi");

  // Referensi untuk input file tersembunyi
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Form State (Tanpa Tanggal, Hanya Nama dan Jam)
  const [editId, setEditId] = useState("");
  const [formData, setFormData] = useState({
    namaOrang: "",
    waktuMasuk: "",
    waktuPulang: "",
    status: "Akan Datang" // Status default otomatis
  });

  // 1. SET UP TERMINOLOGI DINAMIS BERDASARKAN ROLE
  let termPerson = "Anggota";
  let termTitle = "Jadwal Penugasan";

  if (category === "perusahaan") {
    termPerson = "Karyawan";
    termTitle = "Jadwal Kehadiran Karyawan";
  } else if (category === "sekolah") {
    termPerson = "Guru / Staf";
    termTitle = "Jadwal Kehadiran Guru";
  } else if (category === "universitas") {
    termPerson = "Dosen / Staf";
    termTitle = "Jadwal Kehadiran Dosen";
  }

  // Mendapatkan Referensi Database yang Tepat
  const getCollectionRef = () => {
    const parentId = localStorage.getItem("user_parent_id");
    const userCat = localStorage.getItem("user_category") || "superadmin";
    const userId = localStorage.getItem("user_id");

    if (!userId) return null;
    if (parentId && parentId !== "") {
      return collection(db, "superadmin", parentId, userCat, userId, "jadwal");
    } else {
      return collection(db, "superadmin", userId, "jadwal");
    }
  };

  const getDocRef = (docId: string) => {
    const parentId = localStorage.getItem("user_parent_id");
    const userCat = localStorage.getItem("user_category") || "superadmin";
    const userId = localStorage.getItem("user_id");

    if (!userId) return null;
    if (parentId && parentId !== "") {
      return doc(db, "superadmin", parentId, userCat, userId, "jadwal", docId);
    } else {
      return doc(db, "superadmin", userId, "jadwal", docId);
    }
  };

  useEffect(() => {
    // Ambil kategori untuk mengubah bahasa tampilan
    const cat = localStorage.getItem("user_category");
    if (cat) setCategory(cat);

    const collRef = getCollectionRef();
    if (!collRef) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(collRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Schedule[];

      // Urutkan berdasarkan jam masuk
      data.sort((a, b) => (a.waktuMasuk || "").localeCompare(b.waktuMasuk || ""));
      setSchedules(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const collRef = getCollectionRef();
    if (!collRef) return alert("Sesi tidak valid, harap login ulang.");

    try {
      await addDoc(collRef, { ...formData, status: "Akan Datang" });
      setIsAddOpen(false);
      setFormData({ namaOrang: "", waktuMasuk: "", waktuPulang: "", status: "Akan Datang" });
    } catch (error) {
      console.error(error);
      alert("Gagal menambahkan jadwal.");
    }
  };

  const openEditModal = (sched: Schedule) => {
    setEditId(sched.id);
    setFormData({
      namaOrang: sched.namaOrang || "",
      waktuMasuk: sched.waktuMasuk || "",
      waktuPulang: sched.waktuPulang || "",
      status: sched.status || "Akan Datang"
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const docRef = getDocRef(editId);
    if (!docRef) return;

    try {
      await updateDoc(docRef, formData);
      setIsEditOpen(false);
      setFormData({ namaOrang: "", waktuMasuk: "", waktuPulang: "", status: "Akan Datang" });
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui jadwal.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) {
      const docRef = getDocRef(id);
      if (!docRef) return;
      try {
        await deleteDoc(docRef);
      } catch (error) {
        console.error(error);
        alert("Gagal menghapus jadwal.");
      }
    }
  };

  // Fungsi trigger untuk membuka file browser
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Proses ketika file dipilih
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`Dokumen "${file.name}" berhasil dipilih dan siap diproses.`);
      e.target.value = '';
    }
  };

  // Fungsi helper untuk warna status di tabel
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Hadir": return { bg: "#dcfce7", text: "#166534" }; // Hijau
      case "Akan Datang": return { bg: "#e0e7ff", text: "#3730a3" }; // Biru
      case "Sakit":
      case "Izin": return { bg: "#fef9c3", text: "#854d0e" }; // Kuning
      case "Alpa": return { bg: "#fee2e2", text: "#991b1b" }; // Merah
      default: return { bg: "#f1f5f9", text: "#475569" }; // Abu-abu
    }
  };

  return (
    <div style={{ width: '100%', animation: 'fadeIn 0.5s ease-out' }}>

      {/* HEADER DINAMIS & TOMBOL UPLOAD DI SEBELAH TAMBAH JADWAL */}
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="sync-header">
            <h1 style={{ margin: 0, fontSize: '2.15rem', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>
              {termTitle}
            </h1>
          </div>
          <p style={{ margin: '0.5rem 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>Daftar perencanaan hari kehadiran {termPerson.toLowerCase()} Anda.</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          {/* Input File Tersembunyi */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.csv"
            onChange={handleFileChange}
          />

          {/* Tombol Upload Dokumen */}
          <button
            onClick={handleUploadClick}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.25rem', background: '#ffffff', color: '#4f46e5', border: '1px solid #4f46e5', borderRadius: '0.75rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#eef2ff'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
          >
            <UploadCloud size={18} /> Upload Dokumen
          </button>

          <button
            onClick={() => {
              setFormData({ namaOrang: "", waktuMasuk: "", waktuPulang: "", status: "Akan Datang" });
              setIsAddOpen(true);
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.5rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '0.75rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)', transition: 'all 0.2s' }}
          >
            <Plus size={18} /> Tambah Jadwal Baru
          </button>
        </div>
      </header>

      {/* AREA DATATABLE */}
      <div style={{ background: '#ffffff', borderRadius: '1.25rem', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>Memuat Jadwal...</div>
        ) : schedules.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '1.5rem', background: '#f8fafc', borderRadius: '50%', color: '#94a3b8', marginBottom: '1rem' }}>
              <Calendar size={40} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>Belum Ada Data</h3>
            <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto' }}>Anda belum menambahkan jadwal untuk {termPerson.toLowerCase()} manapun.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nama {termPerson}</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Jam Kerja</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((sched) => {
                  const statusStyle = getStatusStyle(sched.status);
                  return (
                    <tr key={sched.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'all 0.2s' }}>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ background: '#eef2ff', padding: '0.65rem', borderRadius: '0.5rem', color: '#4f46e5' }}>
                            <UserCheck size={20} />
                          </div>
                          <span style={{ display: 'block', fontWeight: 800, color: '#1e293b', fontSize: '0.95rem' }}>{sched.namaOrang}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <span style={{ fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                          <Clock size={14} color="#64748b" /> {sched.waktuMasuk || '-'} s/d {sched.waktuPulang || '-'}
                        </span>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <span style={{
                          padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 800,
                          background: statusStyle.bg, color: statusStyle.text
                        }}>
                          {sched.status}
                        </span>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button onClick={() => openEditModal(sched)} style={{ padding: '0.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', color: '#3b82f6', cursor: 'pointer', transition: 'all 0.2s' }} title="Edit">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(sched.id)} style={{ padding: '0.5rem', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '0.5rem', color: '#ef4444', cursor: 'pointer', transition: 'all 0.2s' }} title="Hapus">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================================
          MODAL TAMBAH & EDIT JADWAL 
      ========================================= */}
      {(isAddOpen || isEditOpen) && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '500px', borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', animation: 'fadeIn 0.2s ease-out' }}>

            <div style={{ padding: '1.5rem 2rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>
                {isEditOpen ? "Ubah Data Jadwal" : `Form Jadwal Baru`}
              </h2>
              <button onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={isEditOpen ? handleUpdate : handleAdd} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem' }}>Nama {termPerson}</label>
                <input type="text" required value={formData.namaOrang} onChange={(e) => setFormData({ ...formData, namaOrang: e.target.value })} placeholder="Contoh: Budi Santoso" style={{ width: '100%', padding: '1rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.75rem', outline: 'none', fontWeight: 600 }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem' }}>Jam Masuk</label>
                  <input type="time" required value={formData.waktuMasuk} onChange={(e) => setFormData({ ...formData, waktuMasuk: e.target.value })} style={{ width: '100%', padding: '1rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.75rem', outline: 'none', fontWeight: 600, color: '#1e293b' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem' }}>Jam Pulang</label>
                  <input type="time" required value={formData.waktuPulang} onChange={(e) => setFormData({ ...formData, waktuPulang: e.target.value })} style={{ width: '100%', padding: '1rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.75rem', outline: 'none', fontWeight: 600, color: '#1e293b' }} />
                </div>
              </div>

              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                <button type="button" onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }} style={{ padding: '0.85rem 1.5rem', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                  Batal
                </button>
                <button type="submit" style={{ padding: '0.85rem 1.5rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '0.75rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)' }}>
                  {isEditOpen ? "Simpan Perubahan" : "Tambahkan Jadwal"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}