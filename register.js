  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBGJQcEKirrAwcjHRbtv4HkagA_t4ZZRrM",
    authDomain: "serverbaeuda.firebaseapp.com",
    projectId: "serverbaeuda",
    storageBucket: "serverbaeuda.firebasestorage.app",
    messagingSenderId: "461358279280",
    appId: "1:461358279280:web:db5f2d19a1023e9fac62b5",
    measurementId: "G-NY1K264V9K"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
