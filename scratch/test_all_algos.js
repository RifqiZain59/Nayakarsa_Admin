const CryptoJS = require("crypto-js");

const SECRET_KEY = "SUPERADMIN_SECURE_KEY_2026";
const testEmail = "harkat@gmail.com";
const expectedEncrypted = "OzQiLjM1BCokLzY/ayA6Pw==";

const algos = ["AES", "DES", "TripleDES", "Rabbit", "RC4"];

for (const algo of algos) {
    try {
        const decrypted = CryptoJS[algo].decrypt(expectedEncrypted, SECRET_KEY);
        const res = decrypted.toString(CryptoJS.enc.Utf8);
        console.log(`${algo}: ${res}`);
        
        const encrypted = CryptoJS[algo].encrypt(testEmail, SECRET_KEY).toString();
        // Since many have salts, we check if decryption of expected works
        if (res === testEmail) {
            console.log(`MATCH FOUND! Algorithm: ${algo}`);
        }
    } catch (e) {}
}

// Try XOR (not in CryptoJS directly but common)
function xor(str, key) {
    let res = "";
    for (let i = 0; i < str.length; i++) {
        res += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return res;
}

const decoded = Buffer.from(expectedEncrypted, 'base64').toString('binary');
console.log("XOR test:", xor(decoded, SECRET_KEY));
