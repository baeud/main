import { auth, db, doc, setDoc, serverTimestamp, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from './firebase-config.js';

const mode = document.body.dataset.authMode;
const form = document.getElementById('auth-page-form');
const nameField = document.getElementById('auth-page-name-field');
const nameInput = document.getElementById('auth-page-name');
const emailInput = document.getElementById('auth-page-email');
const passwordInput = document.getElementById('auth-page-password');
const confirmInput = document.getElementById('auth-page-confirm');
const submitButton = document.getElementById('auth-page-submit');
const message = document.getElementById('auth-page-message');
const resetButton = document.getElementById('auth-page-reset');

const messages = {
  'auth/email-already-in-use': 'Email ini sudah terdaftar. Silakan masuk.',
  'auth/invalid-credential': 'Email atau kata sandi belum tepat.',
  'auth/invalid-email': 'Format email belum tepat.',
  'auth/weak-password': 'Kata sandi minimal 6 karakter.',
  'auth/network-request-failed': 'Koneksi bermasalah. Coba lagi.'
};

function showMessage(text, success = false) {
  message.textContent = text;
  message.classList.toggle('success', success);
}

function errorMessage(error) {
  return messages[error.code] || 'Belum berhasil. Periksa data dan coba lagi.';
}

onAuthStateChanged(auth, user => {
  if (user) {
    window.location.replace('dashboard.html');
    return;
  }
  document.body.classList.remove('auth-pending');
});

if (mode === 'register') {
  nameField.hidden = false;
  nameInput.required = true;
  passwordInput.autocomplete = 'new-password';
} else {
  resetButton.hidden = false;
}

document.querySelectorAll('.password-toggle').forEach(toggle => toggle.addEventListener('click', () => {
  const input = document.getElementById(toggle.dataset.target);
  const visible = input.type === 'text';
  input.type = visible ? 'password' : 'text';
  toggle.textContent = visible ? 'Lihat' : 'Sembunyikan';
}));

resetButton.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  if (!email) {
    showMessage('Masukkan email terlebih dahulu.');
    emailInput.focus();
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    showMessage('Link reset kata sandi sudah dikirim ke emailmu.', true);
  } catch (error) {
    showMessage(errorMessage(error));
  }
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  submitButton.disabled = true;
  showMessage(mode === 'register' ? 'Membuat akun...' : 'Memeriksa akun...', true);
  try {
    if (mode === 'register') {
      if (passwordInput.value !== confirmInput.value) {
        showMessage('Konfirmasi kata sandi belum sama.');
        submitButton.disabled = false;
        return;
      }
      const credential = await createUserWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
      const displayName = nameInput.value.trim();
      await updateProfile(credential.user, { displayName });
      const profile = { username: displayName, displayName, email: credential.user.email, avatar: 'logo.png', xp: 0, coins: 0, streak: 0, level: 1, progress: 0, lastQuestDate: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
      await setDoc(doc(db, 'users', credential.user.uid), profile);
      localStorage.setItem(`baeudaProfile:${credential.user.uid}`, JSON.stringify({ ...profile, createdAt: null, updatedAt: null }));
    } else {
      await signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
    }
    showMessage('Berhasil. Membuka dashboard...', true);
    window.location.replace('dashboard.html');
  } catch (error) {
    showMessage(errorMessage(error));
    submitButton.disabled = false;
  }
});
