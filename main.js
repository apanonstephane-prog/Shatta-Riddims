/* ========================
   Shatta Riddims — main.js
   ======================== */

'use strict';

/* ─── Données des riddims ─── */
const riddims = [
  { id: 1, title: 'Shatta World Riddim',  artist: 'Shatta World', duration: '3:42', coverClass: 'cover-1' },
  { id: 2, title: 'Ghana Vibes Riddim',   artist: 'Shatta World', duration: '4:10', coverClass: 'cover-2' },
  { id: 3, title: 'Kingdom Riddim',       artist: 'Shatta World', duration: '3:58', coverClass: 'cover-3' },
  { id: 4, title: 'Accra Nights Riddim',  artist: 'Shatta World', duration: '4:25', coverClass: 'cover-4' },
  { id: 5, title: 'Fire Riddim',          artist: 'Shatta World', duration: '3:30', coverClass: 'cover-5' },
  { id: 6, title: 'Golden Empire Riddim', artist: 'Shatta World', duration: '4:05', coverClass: 'cover-6' },
];

/* ─── État du lecteur ─── */
const state = {
  currentIndex: 0,
  playing: false,
  progress: 0,
  timer: null,
};

/* ─── Références DOM ─── */
const playPauseBtn  = document.getElementById('playPause');
const progressFill  = document.getElementById('progressFill');
const progressBar   = progressFill?.parentElement;
const playerTitle   = document.querySelector('.player-title');
const playerArtist  = document.querySelector('.player-artist');
const playerCover   = document.querySelector('.player-cover');
const timeCurrent   = document.querySelector('.time-current');
const timeTotal     = document.querySelector('.time-total');

/* ─── Utilitaires ─── */
function parseDuration(str) {
  const [m, s] = str.split(':').map(Number);
  return m * 60 + s;
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/* ─── Lecteur ─── */
function loadRiddim(index) {
  const r = riddims[index];
  if (!r) return;

  state.currentIndex = index;
  state.progress = 0;

  if (playerTitle)  playerTitle.textContent  = r.title;
  if (playerArtist) playerArtist.textContent = r.artist;
  if (playerCover) {
    playerCover.className = `player-cover ${r.coverClass}`;
  }
  if (timeTotal)    timeTotal.textContent    = r.duration;
  if (timeCurrent)  timeCurrent.textContent  = '0:00';
  if (progressFill) progressFill.style.width = '0%';
  if (progressBar)  progressBar.setAttribute('aria-valuenow', '0');

  /* Mettre à jour les boutons play dans la grille */
  document.querySelectorAll('.play-btn').forEach((btn, i) => {
    btn.classList.toggle('playing', i === index && state.playing);
    btn.textContent = (i === index && state.playing) ? '⏸' : '▶';
  });
}

function startProgress() {
  const r = riddims[state.currentIndex];
  const total = parseDuration(r.duration);
  const stepMs = 500;

  clearInterval(state.timer);
  state.timer = setInterval(() => {
    state.progress += stepMs / 1000;
    if (state.progress >= total) {
      state.progress = total;
      nextTrack();
      return;
    }
    const pct = (state.progress / total) * 100;
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressBar)  progressBar.setAttribute('aria-valuenow', Math.round(pct));
    if (timeCurrent)  timeCurrent.textContent = formatTime(state.progress);
  }, stepMs);
}

function play() {
  state.playing = true;
  if (playPauseBtn) playPauseBtn.textContent = '⏸';
  updateGridBtn();
  startProgress();
}

function pause() {
  state.playing = false;
  clearInterval(state.timer);
  if (playPauseBtn) playPauseBtn.textContent = '▶';
  updateGridBtn();
}

function togglePlay() {
  state.playing ? pause() : play();
}

function nextTrack() {
  pause();
  const next = (state.currentIndex + 1) % riddims.length;
  loadRiddim(next);
  play();
}

function prevTrack() {
  pause();
  const prev = (state.currentIndex - 1 + riddims.length) % riddims.length;
  loadRiddim(prev);
  play();
}

function updateGridBtn() {
  document.querySelectorAll('.play-btn').forEach((btn, i) => {
    const active = i === state.currentIndex && state.playing;
    btn.classList.toggle('playing', active);
    btn.textContent = active ? '⏸' : '▶';
  });
}

/* ─── Événements lecteur ─── */
playPauseBtn?.addEventListener('click', togglePlay);

document.querySelector('.ctrl-btn[aria-label="Suivant"]')
  ?.addEventListener('click', nextTrack);

document.querySelector('.ctrl-btn[aria-label="Précédent"]')
  ?.addEventListener('click', prevTrack);

/* Clic sur la barre de progression */
progressBar?.addEventListener('click', (e) => {
  const rect = progressBar.getBoundingClientRect();
  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  const r = riddims[state.currentIndex];
  state.progress = parseDuration(r.duration) * pct;
  if (progressFill) progressFill.style.width = `${pct * 100}%`;
  if (progressBar)  progressBar.setAttribute('aria-valuenow', Math.round(pct * 100));
  if (timeCurrent)  timeCurrent.textContent = formatTime(state.progress);
});

/* ─── Grille de riddims ─── */
document.querySelectorAll('.riddim-card').forEach((card, index) => {
  card.querySelector('.play-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (state.currentIndex === index && state.playing) {
      pause();
    } else {
      pause();
      loadRiddim(index);
      play();
    }
  });

  card.addEventListener('click', () => {
    if (state.currentIndex === index && state.playing) {
      pause();
    } else {
      pause();
      loadRiddim(index);
      play();
    }
  });
});

/* ─── Formulaire de contact ─── */
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const nom     = document.getElementById('nom')?.value.trim();
  const email   = document.getElementById('email')?.value.trim();
  const message = document.getElementById('message')?.value.trim();

  if (!nom || !email || !message) {
    if (formFeedback) {
      formFeedback.textContent = 'Veuillez remplir tous les champs obligatoires.';
      formFeedback.style.color = '#ff6b6b';
    }
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (formFeedback) {
      formFeedback.textContent = 'Adresse email invalide.';
      formFeedback.style.color = '#ff6b6b';
    }
    return;
  }

  /* Simuler l'envoi */
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;

  setTimeout(() => {
    if (formFeedback) {
      formFeedback.textContent = 'Message envoyé ! Nous vous répondrons bientôt.';
      formFeedback.style.color = 'var(--gold)';
    }
    contactForm.reset();
    if (submitBtn) submitBtn.disabled = false;
  }, 800);
});

/* ─── Navbar scroll ─── */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

/* ─── Init ─── */
loadRiddim(0);
