# 🏛️ Nayakarsa Admin Dashboard

[![Next.js](https://img.shields.io/badge/Framework-Next.js%2016-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Backend-Firebase-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

Sistem Administrasi Terpadu untuk manajemen institusi (Perusahaan, Sekolah, dan Universitas) dengan desain premium, responsif, dan performa tinggi.

---

## ✨ Fitur Utama

- **🛡️ Secure Authentication**: Sistem login aman menggunakan Firebase Authentication.
- **🏷️ Role-Based Access Control (RBAC)**: Deteksi otomatis tipe institusi (Perusahaan/Sekolah/Universitas) melalui struktur sub-koleksi Firestore.
- **📊 Dynamic Dashboard**: Ringkasan data (Statistik, Grafik Tren, Aktivitas Terbaru) yang menyesuaikan dengan peran user.
- **📅 Schedule Management**: Manajemen jadwal kegiatan khusus untuk tiap kategori institusi.
- **🖨️ Barcode Generator**: Pembuatan dan manajemen barcode untuk verifikasi kehadiran.
- **📋 Data Rekapitulasi**: Rekap data kehadiran dan performa institusi secara real-time.
- **📱 Ultra Responsive Design**: Layout adaptif yang tetap cantik di perangkat mobile maupun desktop.
- **⚡ No-SVG Iconography**: Menggunakan sistem Unicode/Emoji untuk rendering ikon yang kilat dan ringan.

---

## 🚀 Teknologi

- **Frontend**: Next.js 16 (App Router), React 19
- **Styling**: Tailwind CSS v4, Custom Vanilla CSS Design System
- **Backend**: Firebase (Auth & Firestore)
- **State Management**: React Hooks & LocalStorage Persistence

---

## 🛠️ Instalasi

1. **Clone Repository**
   ```bash
   git clone https://github.com/RifqiZain59/Nayakarsa_Admin.git
   cd Admin
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Konfigurasi Firebase**
   Buka file `src/lib/firebase.js` dan perbarui `firebaseConfig` dengan kredensial proyek Firebase Anda.

4. **Jalankan Aplikasi**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 📂 Struktur Firestore

Untuk mendukung fitur **Role Detection**, pastikan struktur Firestore Anda seperti berikut:

```text
superadmin (collection)
 └── [UID_USER] (document)
      ├── perusahaan (sub-collection)
      ├── sekolah (sub-collection)
      └── universitas (sub-collection)
```

---

## 🎨 Desain Estetik

Aplikasi ini dibangun dengan prinsip desain **Premium & Modern**:
- **Glassmorphism Effects** pada elemen UI tertentu.
- **Vibrant Gradients** untuk kartu statistik.
- **Clean Typography** menggunakan font sistem yang dioptimalkan.
- **Subtle Micro-animations** untuk pengalaman pengguna yang lebih hidup.

---

Developed with ❤️ by **Antigravity AI** for **Nayakarsa**.
