const CryptoJS = require("crypto-js");

const SECRET_KEY = "SUPERADMIN_SECURE_KEY_2026";
const testEmail = "harkat@gmail.com";
const expectedEncrypted = "OzQiLjM1BCokLzY/ayA6Pw==";

function tryDecrypt(ciphertext, keyStr, mode, padding) {
    try {
        const key = CryptoJS.enc.Utf8.parse(keyStr);
        // If the key is longer than 32 bytes, AES might fail or use the first 32.
        // SUPERADMIN_SECURE_KEY_2026 is 26 bytes. AES-256 needs 32. 
        // CryptoJS usually pads or hashes.
        
        const decrypted = CryptoJS.AES.decrypt(ciphertext, keyStr); // Default
        const resDefault = decrypted.toString(CryptoJS.enc.Utf8);
        
        // Try raw AES with different modes
        const keyRaw = CryptoJS.enc.Utf8.parse(keyStr);
        const options = { mode: mode, padding: padding };
        const decryptedRaw = CryptoJS.AES.decrypt(ciphertext, keyRaw, options);
        const resRaw = decryptedRaw.toString(CryptoJS.enc.Utf8);
        
        return { default: resDefault, raw: resRaw };
    } catch (e) {
        return { error: e.message };
    }
}

console.log("Modes to test:");
const modes = [CryptoJS.mode.CBC, CryptoJS.mode.ECB, CryptoJS.mode.CFB];
const paddings = [CryptoJS.pad.Pkcs7, CryptoJS.pad.NoPadding];

for (const m of modes) {
    for (const p of paddings) {
        const res = tryDecrypt(expectedEncrypted, SECRET_KEY, m, p);
        console.log(`Mode: ${m}, Pad: ${p} -> ${res.raw}`);
    }
}

// Check if it's just a simple Caesar or something? Unlikely.
// Check if the key was hashed?
const hashedKey = CryptoJS.MD5(SECRET_KEY).toString();
console.log("MD5 Key test:", tryDecrypt(expectedEncrypted, hashedKey, CryptoJS.mode.ECB, CryptoJS.pad.Pkcs7).raw);

const sha256Key = CryptoJS.SHA256(SECRET_KEY).toString().substring(0, 32);
console.log("SHA256 Key test:", tryDecrypt(expectedEncrypted, sha256Key, CryptoJS.mode.ECB, CryptoJS.pad.Pkcs7).raw);
