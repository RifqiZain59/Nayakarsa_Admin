import { db } from "./firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { encryptData } from "./crypto";
import CryptoJS from "crypto-js";

export const findUserByEncryptedEmail = async (plainEmail: string) => {
  // 1. Bersihkan input email
  const processedEmail = plainEmail.toLowerCase().trim();
  const encryptedEmail = encryptData(processedEmail);

  // 2. Buat variasi ID (Firebase tidak mengizinkan '/' di ID dokumen)
  const urlSafeEncrypted = encryptedEmail.replace(/\//g, "_").replace(/\+/g, "-");
  const urlSafeNoPadding = urlSafeEncrypted.replace(/=/g, ""); // Kadang padding '=' otomatis terhapus

  console.log("Mencari Email:", processedEmail);
  console.log("ID Standar:", encryptedEmail);
  console.log("ID URL-Safe:", urlSafeEncrypted);

  try {
    // Ambil semua dokumen parent superadmin
    const superadminSnap = await getDocs(collection(db, "superadmin"));
    console.log(`Mengecek di dalam ${superadminSnap.size} parent superadmin...`);

    const subCategories = ["universitas", "perusahaan", "sekolah"];

    // Cari ke semua kategori
    for (const superDoc of superadminSnap.docs) {
      for (const sub of subCategories) {

        // PERBAIKAN: Skenario 1 HANYA dijalankan jika ID tidak mengandung '/'
        // Firebase akan error (Invalid document reference) jika ada '/' di Doc ID
        if (!encryptedEmail.includes("/")) {
          try {
            const docRef = doc(db, "superadmin", superDoc.id, sub, encryptedEmail);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              console.log(`User ditemukan di: superadmin/${superDoc.id}/${sub}/${docSnap.id}`);
              return { id: docSnap.id, ...docSnap.data(), data: docSnap.data(), category: sub };
            }
          } catch (err) {
            // Abaikan error minor jika dokumen tidak valid
          }
        }

        // Skenario 2: Coba ID URL-Safe (dengan '=' padding)
        try {
          const docRefSafe = doc(db, "superadmin", superDoc.id, sub, urlSafeEncrypted);
          const docSnapSafe = await getDoc(docRefSafe);
          if (docSnapSafe.exists()) {
            console.log(`User ditemukan di: superadmin/${superDoc.id}/${sub}/${docSnapSafe.id}`);
            return { id: docSnapSafe.id, ...docSnapSafe.data(), data: docSnapSafe.data(), category: sub };
          }
        } catch (err) { }

        // Skenario 3: Coba ID URL-Safe (tanpa '=' padding)
        try {
          const docRefNoPad = doc(db, "superadmin", superDoc.id, sub, urlSafeNoPadding);
          const docSnapNoPad = await getDoc(docRefNoPad);
          if (docSnapNoPad.exists()) {
            console.log(`User ditemukan di: superadmin/${superDoc.id}/${sub}/${docSnapNoPad.id}`);
            return { id: docSnapNoPad.id, ...docSnapNoPad.data(), data: docSnapNoPad.data(), category: sub };
          }
        } catch (err) { }
      }
    }
  } catch (e) {
    console.error("Critical search error:", e);
  }

  // Fallback: Cek di level root superadmin (siapa tahu admin utama)
  if (!encryptedEmail.includes("/")) {
    try {
      const directDoc = await getDoc(doc(db, "superadmin", encryptedEmail));
      if (directDoc.exists()) {
        return { id: directDoc.id, ...directDoc.data(), data: directDoc.data(), category: "superadmin" };
      }
    } catch (e) { }
  }

  try {
    const directDocSafe = await getDoc(doc(db, "superadmin", urlSafeEncrypted));
    if (directDocSafe.exists()) {
      return { id: directDocSafe.id, ...directDocSafe.data(), data: directDocSafe.data(), category: "superadmin" };
    }
  } catch (e) { }

  // Jika semua skenario di atas gagal
  return null;
};

export const findUserByEmail = findUserByEncryptedEmail;

export const hashPassword = (password: string) => {
  const msg = password.trim();
  return CryptoJS.SHA256(msg).toString();
};