
function generateCodeVerifier() {
  let verifier = '';
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';

  // Thêm ít nhất một ký tự chữ hoa, một ký tự chữ thường và một ký tự số
  verifier += upperChars.charAt(Math.floor(Math.random() * upperChars.length));
  verifier += lowerChars.charAt(Math.floor(Math.random() * lowerChars.length));
  verifier += numberChars.charAt(Math.floor(Math.random() * numberChars.length));

  const allowedChars = upperChars + lowerChars + numberChars;

  // Thêm các ký tự ngẫu nhiên đến khi đạt độ dài 43
  while (verifier.length < 43) {
    verifier += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
  }

  return verifier;
}

const crypto = require('crypto');
const base64url = require('base64url');
function generateCodeChallenge(codeVerifier) {
  const hash = crypto.createHash('sha256').update(codeVerifier).digest();
  const codeChallenge = base64url.fromBase64(hash.toString('base64'));
  return codeChallenge;
}

const codeVerifier = generateCodeVerifier();
console.log(codeVerifier); // In ra chuỗi code verifier ngẫu nhiên

var code_challenge = generateCodeChallenge(codeVerifier);
console.log(code_challenge);