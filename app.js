// Mobile nav (if needed later)
const $ = (q,ctx=document)=>ctx.querySelector(q);

// Toggle password visibility
document.querySelectorAll('[data-toggle="password"]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const target = document.getElementById(btn.getAttribute('data-target'));
    if(!target) return;
    const to = target.type === 'password' ? 'text' : 'password';
    target.type = to;
    btn.setAttribute('aria-pressed', to === 'text');
    btn.innerText = to === 'text' ? 'Hide' : 'Show';
  });
});

// Simple password strength meter on register
const pwd = $('#password');
const meter = $('#pwd-meter');
if(pwd && meter){
  const bar = meter.querySelector('span');
  const calc = (v)=>{
    let score = 0;
    if(v.length >= 8) score++;
    if(/[A-Z]/.test(v)) score++;
    if(/[a-z]/.test(v)) score++;
    if(/\d/.test(v)) score++;
    if(/[^A-Za-z0-9]/.test(v)) score++;
    return Math.min(score,5);
  };
  pwd.addEventListener('input',()=>{
    const s = calc(pwd.value);
    const pct = (s/5)*100;
    bar.style.width = pct + '%';
  });
}

// Basic confirm-password check
const form = $('#register-form');
if(form){
  form.addEventListener('submit',(e)=>{
    const p1 = $('#password').value;
    const p2 = $('#confirm').value;
    if(p1 !== p2){
      e.preventDefault();
      alert('Password and confirmation do not match.');
    }
  });
}

// ...existing code...
// Leaderboard update after quiz finishes
function updateUserLeaderboard(score) {
  const row = document.getElementById('user-leaderboard-row');
  const scoreCell = document.getElementById('user-score');
  const rankCell = document.getElementById('user-rank');
  scoreCell.textContent = `Physics Quiz — ${score * 100} XP`;
  rankCell.textContent = "#4";
  row.style.display = '';
}

// Modify end of physics quiz:
document.getElementById('quiz-next').onclick = function() {
  quizIndex++;
  if (quizIndex < quizQuestions.length) {
    showQuizQuestion();
  } else {
    document.getElementById('quiz-area').innerHTML =
      `<h4>Quiz finished!</h4><p>Your final score: <b>${quizScore} / ${quizQuestions.length}</b></p>`;
    updateUserLeaderboard(quizScore);
  }
};
// ...existing code...

// Tambahkan di app.js atau sebelum script leaderboard
const firebaseConfig = {
  apiKey: "AIzaSyDnQ57tMUsf6XPOEdzODCJ7Y7M6eapbU5I",
  authDomain: "baeuda-58661.firebaseapp.com",
  projectId: "baeuda-58661",
  storageBucket: "baeuda-58661.firebasestorage.app",
  messagingSenderId: "170178753266",
  appId: "1:170178753266:web:00fcea1b5da2daa255166b",
  measurementId: "G-0LWC9RGTJL"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ...existing code...

function saveScoreToLeaderboard(name, score) {
  db.ref('leaderboard').push({
    name: name,
    score: score,
    time: Date.now()
  });
}

function loadLeaderboard() {
  db.ref('leaderboard').orderByChild('score').limitToLast(10).once('value', snapshot => {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return; // Prevent error if leaderboard table not found
    tbody.innerHTML = '';
    let rank = 1;
    snapshot.forEach(child => {
      const data = child.val();
      const tr = document.createElement('tr');
      tr.innerHTML = `<td class="rank">#${rank++}</td>
        <td class="name"><span>🟡</span> ${data.name}</td>
        <td>Physics Quiz — ${data.score * 100} XP</td>`;
      tbody.prepend(tr);
    });
  });
}

// Show leaderboard when page loads
document.addEventListener('DOMContentLoaded', loadLeaderboard);

// ...existing code...

// ...existing code...

function saveScoreToLeaderboard(name, score) {
  db.ref('leaderboard').push({
    name: name,
    score: score,
    time: Date.now()
  }).then(() => {
    loadLeaderboard(); // Call this so leaderboard updates immediately
  });
}

function loadLeaderboard() {
  db.ref('leaderboard').orderByChild('score').limitToLast(10).once('value', snapshot => {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    let rank = 1;
    snapshot.forEach(child => {
      const data = child.val();
      const tr = document.createElement('tr');
      tr.innerHTML = `<td class="rank">#${rank++}</td>
        <td class="name"><span>🟡</span> ${data.name}</td>
        <td>Physics Quiz — ${data.score * 100} XP</td>`;
      tbody.prepend(tr);
    });
  });
}

// Show leaderboard when page opens
document.addEventListener('DOMContentLoaded', loadLeaderboard);

// ...existing code...