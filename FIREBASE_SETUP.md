# Setup Firebase BAEUDA

Tutorial ini sesuai dengan konfigurasi terbaru di `firebase-config.js`:

- Firebase project ID: `serverbaeuda`
- Authentication: Email/Password
- Database: Cloud Firestore
- Frontend: HTML/CSS/JavaScript static
- Hosting yang disarankan: GitHub Pages

## 1. Aktifkan Email/Password

1. Buka [Firebase Console](https://console.firebase.google.com/).
2. Pilih project `serverbaeuda`.
3. Buka **Build > Authentication**.
4. Klik **Get started** jika Authentication belum pernah dipakai.
5. Buka tab **Sign-in method**.
6. Klik **Email/Password**.
7. Aktifkan **Email/Password**.
8. Klik **Save**.

Jangan aktifkan **Email link** dulu karena aplikasi ini memakai password biasa.

## 2. Aktifkan Cloud Firestore

Dashboard memakai Firestore agar nama, XP, level, coins, streak, avatar, dan perubahan dari kuis tersimpan di akun Firebase dan dapat muncul di perangkat lain.

1. Di Firebase Console buka **Build > Firestore Database**.
2. Klik **Create database**.
3. Pilih lokasi database yang dekat dengan pengguna utama.
4. Pilih **Start in production mode**.
5. Setelah database dibuat, buka tab **Rules**.
6. Ganti rules dengan isi file `firestore.rules` di repository:

```text
rules_version = '2';

service cloud.firestore {
	match /databases/{database}/documents {
		match /users/{userId} {
			allow read, write: if request.auth != null && request.auth.uid == userId;
		}
	}
}
```

7. Klik **Publish**.

Jangan memakai `allow read, write: if true;` karena itu membuat data semua user terbuka.

## 3. Tambahkan domain lokal

1. Di Firebase Console buka **Authentication > Settings**.
2. Buka bagian **Authorized domains**.
3. Pastikan `localhost` ada.
4. Jika belum ada, klik **Add domain** dan masukkan `localhost`.

Jangan membuka halaman dengan double-click file HTML (`file:///...`). Firebase module harus dijalankan melalui HTTP atau HTTPS.

## 4. Upload project ke GitHub

Buat repository baru di GitHub, misalnya `baeuda`.

Di PowerShell, buka folder project:

```powershell
cd "C:\Users\OPHIR\Downloads\drive-download-20260304T062008Z-1-001"
```

Lalu jalankan:

```powershell
git init
git add .
git commit -m "Initial BAEUDA website"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

Ganti:

- `USERNAME` dengan username GitHub kamu.
- `REPOSITORY` dengan nama repository yang dibuat.

Jika repository sudah berisi file dan Git menolak push pertama, gunakan alur ini:

```powershell
git pull origin main --allow-unrelated-histories
git push -u origin main
```

## 5. Aktifkan GitHub Pages

1. Buka repository di GitHub.
2. Masuk ke **Settings > Pages**.
3. Pada **Build and deployment**, pilih **Deploy from a branch**.
4. Pilih branch `main`.
5. Pilih folder `/ (root)`.
6. Klik **Save**.
7. Tunggu sampai GitHub menampilkan URL website.

URL biasanya berbentuk:

```text
https://USERNAME.github.io/REPOSITORY/
```

Buka URL tersebut, lalu pastikan landing page muncul.

## 6. Tambahkan domain GitHub ke Firebase

Kembali ke Firebase Console:

1. Buka **Authentication > Settings**.
2. Buka **Authorized domains**.
3. Klik **Add domain**.
4. Tambahkan domain GitHub Pages saja, tanpa `https://` dan tanpa path repository.

Contoh:

```text
USERNAME.github.io
```

Jika memakai custom domain, tambahkan juga domain custom tersebut, misalnya:

```text
belajar.example.com
```

Jangan memasukkan URL lengkap seperti `https://USERNAME.github.io/baeuda/`; yang dimasukkan hanya hostname.

## 7. Tes register

1. Buka URL GitHub Pages.
2. Klik **Daftar gratis**.
3. Isi nama panggilan.
4. Isi email yang belum pernah dipakai.
5. Isi kata sandi minimal 6 karakter.
6. Isi ulang kata sandi dengan nilai yang sama.
7. Klik **Daftar & mulai belajar**.
8. Aplikasi harus membuka `dashboard.html` otomatis.
9. Di Firebase Console buka **Authentication > Users**.
10. Pastikan email baru muncul di daftar user.

Jika berhasil, Firebase otomatis membuat sesi login. Tidak perlu membuat tabel user manual hanya untuk proses login.

## 8. Tes login

1. Klik **Keluar** di dashboard.
2. Pastikan aplikasi kembali ke `index.html`.
3. Buka halaman **Masuk**.
4. Masukkan email dan kata sandi yang baru dibuat.
5. Klik **Masuk ke dashboard**.
6. Pastikan dashboard terbuka kembali.

## 9. Tes reset password

1. Buka `login.html`.
2. Masukkan email terdaftar.
3. Klik **Lupa kata sandi?**.
4. Buka inbox email tersebut.
5. Klik link reset dari Firebase.
6. Buat password baru.
7. Coba login menggunakan password baru.

Jika email tidak masuk, cek folder spam dan pastikan Email/Password provider sudah aktif.

## 10. Cara kerja file auth di project

- `firebase-config.js`: inisialisasi Firebase dan menyediakan Firebase Auth.
- `auth-pages.js`: proses login, register, reset password, dan validasi password.
- `login.html`: halaman login terpisah.
- `register.html`: halaman registrasi terpisah.
- `auth-guard.js`: menjaga halaman privat agar hanya bisa dibuka setelah login.
- `dashboard.html`: halaman utama setelah login.
- `firestore.rules`: aturan agar setiap user hanya bisa membaca dan mengubah dokumen miliknya.

Fungsi Firebase yang digunakan:

- `createUserWithEmailAndPassword`: membuat akun.
- `signInWithEmailAndPassword`: login.
- `sendPasswordResetEmail`: mengirim email reset password.
- `signOut`: logout.
- `onAuthStateChanged`: mendeteksi sesi login.
- `updateProfile`: menyimpan nama tampilan user.

## 11. Jika muncul error umum

### `auth/operation-not-allowed`
Email/Password belum diaktifkan. Kembali ke **Authentication > Sign-in method**.

### `auth/unauthorized-domain`
Domain website belum dimasukkan ke **Authentication > Settings > Authorized domains**.

### `auth/email-already-in-use`
Email sudah terdaftar. Gunakan halaman login atau email lain.

### `auth/invalid-credential`
Email atau password salah.

### `permission-denied` atau `Missing or insufficient permissions`
Firestore Rules belum dipublikasikan, atau rule tidak memakai UID user yang sedang login. Pastikan dokumen disimpan pada `users/{uid}` dan rules sama dengan isi `firestore.rules`.

### `failed-precondition` saat memakai Firestore
Cloud Firestore belum dibuat. Buka **Build > Firestore Database > Create database**.

### Module gagal dimuat
Pastikan website dibuka melalui `https://USERNAME.github.io/...`, bukan `file:///...`. Pastikan URL Firebase CDN bisa diakses dan nama file tidak berubah.

## 12. Catatan keamanan

Firebase Web API key di `firebase-config.js` boleh terlihat pada frontend. Itu bukan password rahasia.

Jangan pernah memasukkan hal berikut ke repository frontend:

- Firebase Admin SDK service account JSON.
- Private key.
- Password database.
- Token rahasia.

Profil utama sekarang disimpan di Firestore pada dokumen `users/{uid}`. `localStorage` masih dipakai sebagai cache cepat agar dashboard terasa responsif. Tugas pada halaman tugas masih lokal per browser; pindahkan juga ke Firestore jika ingin tugas tersinkron lintas perangkat.
