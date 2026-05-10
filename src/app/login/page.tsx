"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react";
import { findUserByEncryptedEmail, hashPassword } from "@/lib/db-utils";
import { decryptData } from "@/lib/crypto";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // STRICTLY Manual check based on Firestore (Encrypted Email & Password Hash)
      // NO Firebase Authentication check as per user requirement
      console.log("Starting strictly manual encrypted login flow...");
      const manualUser = await findUserByEncryptedEmail(email);
      
      if (!manualUser) {
        throw new Error("User not found");
      }

      console.log("User found in Firestore:", manualUser.category);
      const enteredPasswordHash = hashPassword(password);
      
      if (manualUser.data.passwordHash === enteredPasswordHash) {
        // Password matches!
        // Decrypt role if it's encrypted
        let role = manualUser.data.role;
        if (role && typeof role === 'string' && role.includes("==")) {
           const decryptedRole = decryptData(role);
           if (decryptedRole) role = decryptedRole;
        }
        
        localStorage.setItem("user_role", manualUser.data.institutionType || role || manualUser.category);
        localStorage.setItem("user_id", manualUser.id);
        
        router.push("/dashboard");
      } else {
        throw new Error("Invalid password.");
      }
      
    } catch (err: any) {
      console.error("Login Error:", err);
      let errorMsg = "Login gagal. Mohon periksa email dan password Anda.";
      
      if (err.message === "User not found") {
        errorMsg = "Email tidak ditemukan.";
      } else if (err.message === "Invalid password.") {
        errorMsg = "Password salah.";
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-container">
      {/* Left Side: Dark Blue Premium Branding */}
      <div className="split-left" style={{ background: '#0a0a2e' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.15 }}>
          <div className="grid-bg" style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)',
            backgroundSize: '40px 40px',
            width: '100%',
            height: '100%'
          }}></div>
        </div>
        
        <div style={{ 
          position: 'absolute', 
          width: '400px', 
          height: '400px', 
          background: 'rgba(99, 102, 241, 0.15)', 
          filter: 'blur(100px)',
          borderRadius: '50%',
          top: '20%',
          left: '20%'
        }}></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', zIndex: 10 }}
        >
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            padding: '1.5rem', 
            borderRadius: '2.5rem', 
            display: 'inline-flex', 
            marginBottom: '2.5rem',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <ShieldCheck size={56} color="#6366f1" />
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em', color: '#fff' }}>
            Nayakarsa <span style={{ color: '#6366f1' }}>Admin</span>
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.6)', maxWidth: '420px', lineHeight: 1.7 }}>
            Manajemen institusi modern dengan verifikasi data terenkripsi.
          </p>
        </motion.div>
      </div>

      {/* Right Side: Clean White Login Form */}
      <div className="split-right">
        <div className="login-form-container">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.75rem' }}>Administrator Login</h2>
              <p style={{ color: '#64748b', fontSize: '1.05rem' }}>Gunakan kredensial terenkripsi Anda untuk masuk.</p>
            </div>

            {error && (
              <div style={{ 
                background: '#fef2f2', 
                color: '#dc2626', 
                padding: '1rem 1.25rem', 
                borderRadius: '0.75rem', 
                marginBottom: '2rem',
                fontSize: '0.9rem',
                border: '1px solid #fee2e2'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="input-label">Alamat Email</label>
                <input 
                  type="email" 
                  className="input-field" 
                  placeholder="admin@nayakarsa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <label className="input-label">Password</label>
                <input 
                  type="password" 
                  className="input-field" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ 
                  width: '100%', 
                  padding: '1.125rem', 
                  fontSize: '1rem', 
                  fontWeight: 700,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.75rem'
                }} 
                disabled={loading}
              >
                {loading ? "Memverifikasi..." : "Masuk Sekarang"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
