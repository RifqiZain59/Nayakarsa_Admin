const CryptoJS = require("crypto-js");

const SECRET_KEY = "SUPERADMIN_SECURE_KEY_2026";

const encryptData = (data) => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

const decryptData = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const testEmail = "harkat@gmail.com";
const expectedEncrypted = "OzQiLjM1BCokLzY/ayA6Pw==";

console.log("Input:", testEmail);
console.log("Expected:", expectedEncrypted);
console.log("Generated 1:", encryptData(testEmail));
console.log("Generated 2:", encryptData(testEmail));

// Check if decrypting the expected value gives the email
try {
    console.log("Decrypting Expected:", decryptData(expectedEncrypted));
} catch (e) {
    console.log("Decryption failed");
}
