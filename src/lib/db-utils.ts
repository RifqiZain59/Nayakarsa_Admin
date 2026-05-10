import { db } from "./firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { encryptData } from "./crypto";
import CryptoJS from "crypto-js";

export const findUserByEncryptedEmail = async (plainEmail: string) => {
  const processedEmail = plainEmail.toLowerCase().trim();
  const encryptedEmail = encryptData(processedEmail);
  const urlSafeEncrypted = encryptedEmail.replace(/\//g, "_").replace(/\+/g, "-");
  const urlSafeNoPadding = urlSafeEncrypted.replace(/=/g, "");

  console.log("Mencari Email:", processedEmail);
  console.log("ID Standar:", encryptedEmail);

  try {
    const superadminSnap = await getDocs(collection(db, "superadmin"));
    const subCategories = ["universitas", "perusahaan", "sekolah"];

    for (const superDoc of superadminSnap.docs) {
      for (const sub of subCategories) {

        if (!encryptedEmail.includes("/")) {
          try {
            const docRef = doc(db, "superadmin", superDoc.id, sub, encryptedEmail);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              // PERBAIKAN: Menambahkan parentId agar bisa di-update di Pengaturan
              return { id: docSnap.id, parentId: superDoc.id, ...docSnap.data(), data: docSnap.data(), category: sub };
            }
          } catch (err) { }
        }

        try {
          const docRefSafe = doc(db, "superadmin", superDoc.id, sub, urlSafeEncrypted);
          const docSnapSafe = await getDoc(docRefSafe);
          if (docSnapSafe.exists()) {
            return { id: docSnapSafe.id, parentId: superDoc.id, ...docSnapSafe.data(), data: docSnapSafe.data(), category: sub };
          }
        } catch (err) { }

        try {
          const docRefNoPad = doc(db, "superadmin", superDoc.id, sub, urlSafeNoPadding);
          const docSnapNoPad = await getDoc(docRefNoPad);
          if (docSnapNoPad.exists()) {
            return { id: docSnapNoPad.id, parentId: superDoc.id, ...docSnapNoPad.data(), data: docSnapNoPad.data(), category: sub };
          }
        } catch (err) { }
      }
    }
  } catch (e) {
    console.error("Critical search error:", e);
  }

  // Fallback root superadmin
  if (!encryptedEmail.includes("/")) {
    try {
      const directDoc = await getDoc(doc(db, "superadmin", encryptedEmail));
      if (directDoc.exists()) {
        return { id: directDoc.id, parentId: "", ...directDoc.data(), data: directDoc.data(), category: "superadmin" };
      }
    } catch (e) { }
  }

  try {
    const directDocSafe = await getDoc(doc(db, "superadmin", urlSafeEncrypted));
    if (directDocSafe.exists()) {
      return { id: directDocSafe.id, parentId: "", ...directDocSafe.data(), data: directDocSafe.data(), category: "superadmin" };
    }
  } catch (e) { }

  return null;
};

export const findUserByEmail = findUserByEncryptedEmail;

export const hashPassword = (password: string) => {
  const msg = password.trim();
  return CryptoJS.SHA256(msg).toString();
};