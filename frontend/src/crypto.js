import CryptoJS from 'crypto-js';

const SECRET_KEY = 'A75|n>Xh_?;I}`YTI%mKEQ/DZ+:K(9Y['; // Use a strong key in production

export function encrypt(text) {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

export function decrypt(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
