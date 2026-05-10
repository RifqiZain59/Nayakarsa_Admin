"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Database, MapPin, Globe, Smartphone, Clock, Crosshair, Activity, Laptop, Map as MapIcon, AlertCircle } from "lucide-react";

// Struktur Data Log IP HP
interface IpLog {
  id: string;
  ipAddress: string;
  lokasi: string;
  isp: string;
  perangkat: string;
  isMobile: boolean;
  waktu: string;
  lat: number;
  lng: number;
  timestamp: any;
}

export default function RekapDataPage() {
  const [logs, setLogs] = useState<IpLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTracking, setIsTracking] = useState(false);

  // Info perangkat saat ini
  const [currentInfo, setCurrentInfo] = useState({
    ip: "Memindai...",
    lokasi: "Memindai...",
    isp: "Memindai...",
    perangkat: "Mendeteksi...",
    isMobile: false,
    lat: 0,
    lng: 0
  });

  // Referensi Database Sesuai Role
  const getCollectionRef = () => {
    const parentId = localStorage.getItem("user_parent_id");
    const userCat = localStorage.getItem("user_category") || "superadmin";
    const userId = localStorage.getItem("user_id");

    if (!userId) return null;
    if (parentId && parentId !== "") {
      return collection(db, "superadmin", parentId, userCat, userId, "log_ip_hp");
    } else {
      return collection(db, "superadmin", userId, "log_ip_hp");
    }
  };

  // 1. Ambil Data Realtime
  useEffect(() => {
    const collRef = getCollectionRef();
    if (!collRef) {
      setLoading(false);
      return;
    }

    const q = query(collRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as IpLog[];
      setLogs(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Logika Deteksi Khusus HP & Ambil Lokasi IP
  const fetchDeviceAndIpData = async () => {
    try {
      const ua = navigator.userAgent;
      let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

      let deviceName = "PC / Laptop";
      if (/android/i.test(ua)) deviceName = "Smartphone Android";
      else if (/iPhone|iPad|iPod/i.test(ua)) deviceName = "Smartphone iOS (Apple)";
      else if (isMobile) deviceName = "Mobile Device";

      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();

      const info = {
        ip: data.ip || "0.0.0.0",
        lokasi: `${data.city || "Kota"}, ${data.region || "Provinsi"}`,
        isp: data.org || "Internet Service Provider",
        perangkat: deviceName,
        isMobile: isMobile,
        lat: data.latitude || -6.2088,
        lng: data.longitude || 106.8456
      };

      setCurrentInfo(info);
      return info;
    } catch (error) {
      console.error("Gagal scan perangkat:", error);
      return null;
    }
  };

  // 3. Engine Denah Google Maps
  useEffect(() => {
    if (currentInfo.lat === 0) return;

    let mapInstance: any = null;
    const loadMap = () => {
      const L = (window as any).L;
      if (!L) return;

      const container = document.getElementById('map-denah');
      if (!container || (container as any)._leaflet_id) return;

      mapInstance = L.map('map-denah', { zoomControl: false }).setView([currentInfo.lat, currentInfo.lng], 16);

      // Pakai Tile Google Maps sesuai permintaan
      L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        attribution: '© Google Maps'
      }).addTo(mapInstance);

      // Marker Berdenyut (Pulse)
      const pulseIcon = L.divIcon({
        className: 'pulse-marker',
        html: `<div style="position:relative; width:30px; height:30px;">
                 <div style="position:absolute; width:100%; height:100%; background:${currentInfo.isMobile ? '#10b981' : '#ef4444'}; border-radius:50%; opacity:0.4; animation:ping 2s infinite;"></div>
                 <div style="position:absolute; top:7px; left:7px; background:${currentInfo.isMobile ? '#10b981' : '#ef4444'}; width:16px; height:16px; border-radius:50%; border:3px solid white; box-shadow:0 0 10px rgba(0,0,0,0.2);"></div>
               </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      L.marker([currentInfo.lat, currentInfo.lng], { icon: pulseIcon }).addTo(mapInstance)
        .bindPopup(`<b>Posisi ${currentInfo.perangkat}</b>`).openPopup();
    };

    if (!(window as any).L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = loadMap;
      document.head.appendChild(script);
    } else {
      loadMap();
    }

    return () => { if (mapInstance) mapInstance.remove(); };
  }, [currentInfo.lat]);

  useEffect(() => {
    fetchDeviceAndIpData();
    const style = document.createElement('style');
    style.innerHTML = `@keyframes ping { 75%, 100% { transform: scale(3); opacity: 0; } }`;
    document.head.appendChild(style);
  }, []);

  // 4. Simpan Log
  const handleCatatLog = async () => {
    setIsTracking(true);
    const collRef = getCollectionRef();
    const info = await fetchDeviceAndIpData();

    if (!collRef || !info) {
      alert("Gagal merekam data.");
      setIsTracking(false);
      return;
    }

    try {
      const now = new Date();
      await addDoc(collRef, {
        ipAddress: info.ip,
        lokasi: info.lokasi,
        isp: info.isp,
        perangkat: info.perangkat,
        isMobile: info.isMobile,
        lat: info.lat,
        lng: info.lng,
        waktu: `${now.toLocaleDateString('id-ID')} ${now.toLocaleTimeString('id-ID')}`,
        timestamp: serverTimestamp()
      });
      alert("Data perangkat berhasil diamankan ke database.");
    } catch (e) {
      alert("Error database.");
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <div style={{ width: '100%', animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 900, color: '#1e293b' }}>Radar Perangkat Mobile</h1>
          <p style={{ color: '#64748b' }}>Monitoring akses khusus Smartphone berdasarkan IP & Geolokasi.</p>
        </div>
        <button onClick={handleCatatLog} disabled={isTracking} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '0.8rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)' }}>
          <Crosshair size={18} /> {isTracking ? "Merekam..." : "Rekam Posisi HP"}
        </button>
      </header>

      {/* STATUS PANEL */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: currentInfo.isMobile ? '#f0fdf4' : '#fef2f2', color: currentInfo.isMobile ? '#10b981' : '#ef4444', padding: '1rem', borderRadius: '0.8rem' }}>
            {currentInfo.isMobile ? <Smartphone size={28} /> : <Laptop size={28} />}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>TIPE PERANGKAT</p>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{currentInfo.perangkat}</h3>
          </div>
        </div>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#eff6ff', color: '#3b82f6', padding: '1rem', borderRadius: '0.8rem' }}><Globe size={28} /></div>
          <div>
            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>IP ADDRESS</p>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{currentInfo.ip}</h3>
          </div>
        </div>
      </div>

      {/* DENAH GOOGLE MAPS */}
      <div style={{ background: '#fff', borderRadius: '1.25rem', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <MapIcon size={22} color="#4f46e5" />
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Denah Lokasi Real-time</h3>
        </div>
        <div id="map-denah" style={{ width: '100%', height: '400px', borderRadius: '1rem', background: '#f1f5f9', border: '1px solid #e2e8f0', zIndex: 1 }} />
      </div>

      {/* TABEL REKAP */}
      <div style={{ background: '#fff', borderRadius: '1.25rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', color: '#64748b', fontSize: '0.8rem', fontWeight: 800 }}>
            <tr>
              <th style={{ padding: '1.2rem' }}>PERANGKAT</th>
              <th style={{ padding: '1.2rem' }}>IP ADDRESS</th>
              <th style={{ padding: '1.2rem' }}>LOKASI DETAIL</th>
              <th style={{ padding: '1.2rem' }}>WAKTU</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem 1.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: log.isMobile ? '#10b981' : '#1e293b' }}>
                    {log.isMobile ? <Smartphone size={16} /> : <Laptop size={16} />}
                    {log.perangkat}
                  </div>
                </td>
                <td style={{ padding: '1rem 1.2rem', fontWeight: 600 }}>{log.ipAddress}</td>
                <td style={{ padding: '1rem 1.2rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600 }}>{log.lokasi}</span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{log.lat}, {log.lng}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem 1.2rem', color: '#64748b', fontSize: '0.85rem' }}>{log.waktu}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}