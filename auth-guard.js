import { auth, db, doc, setDoc, onSnapshot, serverTimestamp, onAuthStateChanged, signOut } from './firebase-config.js';

function requireAuth(onUser) {
  return onAuthStateChanged(auth, user => {
    if (!user) {
      window.location.replace('index.html');
      return;
    }
    localStorage.setItem('baeudaActiveProfileKey', `baeudaProfile:${user.uid}`);
    const profileKey = `baeudaProfile:${user.uid}`;
    const profileRef = doc(db, 'users', user.uid);
    onSnapshot(profileRef, snapshot => {
      if (!snapshot.exists()) return;
      const profile = snapshot.data();
      localStorage.setItem(profileKey, JSON.stringify(profile));
    });
    window.addEventListener('baeuda-profile-updated', event => {
      setDoc(profileRef, { ...event.detail, updatedAt: serverTimestamp() }, { merge: true }).catch(error => console.error('Profile sync failed:', error));
    });
    document.body.classList.remove('auth-pending');
    onUser(user);
  });
}

async function logout() {
  try {
    await signOut(auth);
  } finally {
    localStorage.removeItem('baeudaActiveProfileKey');
    window.location.replace('index.html');
  }
}

export { requireAuth, logout };
