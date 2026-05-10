import { db } from "./firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { encryptData } from "./crypto";
import CryptoJS from "crypto-js";

export const findUserByEncryptedEmail = async (plainEmail: string) => {
  const processedEmail = plainEmail.toLowerCase().trim();
  const encryptedEmail = encryptData(processedEmail);
  const urlSafeEncrypted = encryptedEmail.replace(/\//g, "_").replace(/\+/g, "-");

  console.log("Searching for:", processedEmail);
  console.log("Looking for User ID (Standard):", encryptedEmail);
  console.log("Looking for User ID (URL-Safe):", urlSafeEncrypted);

  try {
    // 1. Get all superadmin parent documents
    const superadminSnap = await getDocs(collection(db, "superadmin"));
    console.log(`Checking across ${superadminSnap.size} superadmin parents...`);

    const subCategories = ["universitas", "perusahaan", "sekolah"];

    // 2. For each superadmin parent, check each sub-category
    for (const superDoc of superadminSnap.docs) {
      for (const sub of subCategories) {
        // Try standard ID
        const docRef = doc(db, "superadmin", superDoc.id, sub, encryptedEmail);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log(`User found in: superadmin/${superDoc.id}/${sub}/${docSnap.id}`);
          return { id: docSnap.id, data: docSnap.data(), category: sub };
        }

        // Try URL-safe ID
        const docRefSafe = doc(db, "superadmin", superDoc.id, sub, urlSafeEncrypted);
        const docSnapSafe = await getDoc(docRefSafe);
        if (docSnapSafe.exists()) {
          console.log(`User found in: superadmin/${superDoc.id}/${sub}/${docSnapSafe.id}`);
          return { id: docSnapSafe.id, data: docSnapSafe.data(), category: sub };
        }
      }
    }
  } catch (e) {
    console.error("Critical search error:", e);
  }

  // Fallback to top-level superadmin just in case
  try {
    const directDoc = await getDoc(doc(db, "superadmin", encryptedEmail));
    if (directDoc.exists()) return { id: directDoc.id, data: directDoc.data(), category: "superadmin" };
    
    const directDocSafe = await getDoc(doc(db, "superadmin", urlSafeEncrypted));
    if (directDocSafe.exists()) return { id: directDocSafe.id, data: directDocSafe.data(), category: "superadmin" };
  } catch (e) {}

  return null;
};

export const findUserByEmail = findUserByEncryptedEmail;

export const hashPassword = (password: string) => {
  const msg = password.toLowerCase().trim();
  return CryptoJS.SHA256(msg).toString();
};
