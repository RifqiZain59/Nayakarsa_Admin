import CryptoJS from "crypto-js";

const SECRET_KEY = "SUPERADMIN_SECURE_KEY_2026";

export function encryptData(text: string): string {
    if (!text) return "";
    text = text.toString();
    let result = '';
    for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
    }
    // Match the exact implementation from the Superadmin project
    return btoa(unescape(encodeURIComponent(result)));
}

export function decryptData(encoded: string): string {
    if (!encoded) return "";
    try {
        const text = decodeURIComponent(escape(atob(encoded)));
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
        }
        return result;
    } catch (_e) {
        return encoded;
    }
}
