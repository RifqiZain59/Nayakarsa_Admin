const SECRET_KEY = "SUPERADMIN_SECURE_KEY_2026";

function encryptData(text) {
    if (!text) return "";
    text = text.toString();
    let result = '';
    for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
    }
    // Note: in Node.js, we need to polyfill btoa, unescape, encodeURIComponent
    // unescape and encodeURIComponent are available. btoa needs Buffer.
    const encoded = Buffer.from(encodeURIComponent(result), 'binary').toString('base64');
    // Wait, the user used unescape(encodeURIComponent(result))
    // unescape is deprecated but usually available in browsers.
    // Let's use the browser-compatible polyfill for btoa
    return Buffer.from(unescape(encodeURIComponent(result)), 'binary').toString('base64');
}

const testEmail = "harkat@gmail.com";
const expected = "OzQiLjM1BCokLzY/ayA6Pw==";

console.log("Input:", testEmail);
console.log("Expected:", expected);
const generated = encryptData(testEmail);
console.log("Generated:", generated);

if (generated === expected) {
    console.log("SUCCESS: MATCH!");
} else {
    console.log("FAILURE: NO MATCH!");
}
