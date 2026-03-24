/* ========================
   Shatta Riddims — main.js
   ======================== */
'use strict';

/* ─── Données ─── */
const riddims = [
  { id: 1, title: 'Shatta World Riddim',  artist: 'Shatta World · Martinique', duration: '3:42', coverClass: 'cover-1' },
  { id: 2, title: 'Péyi-A Riddim',        artist: 'Shatta World · Martinique', duration: '4:10', coverClass: 'cover-2' },
  { id: 3, title: 'Kingdom Riddim',       artist: 'Shatta World · Martinique', duration: '3:58', coverClass: 'cover-3' },
  { id: 4, title: 'Fort-de-France Riddim',artist: 'Shatta World · Martinique', duration: '4:25', coverClass: 'cover-4' },
  { id: 5, title: 'Fire Riddim',          artist: 'Shatta World · Martinique', duration: '3:30', coverClass: 'cover-5' },
  { id: 6, title: 'Carnaval Riddim',      artist: 'Shatta World · Martinique', duration: '4:05', coverClass: 'cover-6' },
];

/* ─── État ─── */
const state = { currentIndex: 0, playing: false, progress: 0, timer: null };

/* ─── DOM ─── */
const playPauseBtn  = document.getElementById('playPauseBtn');
const progressFill  = document.getElementById('progressFill');
const progressBar   = document.getElementById('progressBar');
const playerTitle   = document.getElementById('playerTitle');
const playerArtist  = document.getElementById('playerArtist');
const playerThumb   = document.getElementById('playerThumb');
const timeCurrent   = document.getElementById('timeCurrent');
const timeTotal     = document.getElementById('timeTotal');

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
  if (playerThumb)  playerThumb.className    = `dock-thumb ${r.coverClass}`;
  if (timeTotal)    timeTotal.textContent    = r.duration;
  if (timeCurrent)  timeCurrent.textContent  = '0:00';
  if (progressFill) progressFill.style.width = '0%';
  if (progressBar)  progressBar.setAttribute('aria-valuenow', '0');

  updateAllPlayBtns();
}

function startProgress() {
  const total = parseDuration(riddims[state.currentIndex].duration);
  clearInterval(state.timer);
  state.timer = setInterval(() => {
    state.progress += 0.5;
    if (state.progress >= total) {
      state.progress = total;
      nextTrack();
      return;
    }
    const pct = (state.progress / total) * 100;
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressBar)  progressBar.setAttribute('aria-valuenow', Math.round(pct));
    if (timeCurrent)  timeCurrent.textContent = formatTime(state.progress);
  }, 500);
}

function play() {
  state.playing = true;
  if (playPauseBtn) playPauseBtn.innerHTML = '&#9646;&#9646;';
  updateAllPlayBtns();
  startProgress();
}

function pause() {
  state.playing = false;
  clearInterval(state.timer);
  if (playPauseBtn) playPauseBtn.innerHTML = '&#9654;';
  updateAllPlayBtns();
}

function togglePlay() { state.playing ? pause() : play(); }

function nextTrack() {
  pause();
  loadRiddim((state.currentIndex + 1) % riddims.length);
  play();
}
function prevTrack() {
  pause();
  loadRiddim((state.currentIndex - 1 + riddims.length) % riddims.length);
  play();
}

function updateAllPlayBtns() {
  document.querySelectorAll('.play-btn').forEach((btn) => {
    const id = parseInt(btn.dataset.id, 10);
    const isActive = id === riddims[state.currentIndex].id && state.playing;
    btn.classList.toggle('playing', isActive);
    btn.textContent = isActive ? '⏸' : '▶';
  });
}

/* ─── Événements lecteur ─── */
playPauseBtn?.addEventListener('click', togglePlay);
document.getElementById('nextBtn')?.addEventListener('click', nextTrack);
document.getElementById('prevBtn')?.addEventListener('click', prevTrack);

progressBar?.addEventListener('click', (e) => {
  const rect = progressBar.getBoundingClientRect();
  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  state.progress = parseDuration(riddims[state.currentIndex].duration) * pct;
  if (progressFill) progressFill.style.width = `${pct * 100}%`;
  if (progressBar)  progressBar.setAttribute('aria-valuenow', Math.round(pct * 100));
  if (timeCurrent)  timeCurrent.textContent = formatTime(state.progress);
});

/* ─── Grille de riddims — clic play ─── */
document.querySelectorAll('.play-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const id = parseInt(btn.dataset.id, 10);
    const index = riddims.findIndex(r => r.id === id);
    if (index === -1) return;
    if (state.currentIndex === index && state.playing) {
      pause();
    } else {
      pause();
      loadRiddim(index);
      play();
    }
  });
});

document.querySelectorAll('.riddim-card').forEach((card) => {
  card.addEventListener('click', () => {
    const id = parseInt(card.dataset.id, 10);
    const index = riddims.findIndex(r => r.id === id);
    if (index === -1) return;
    if (state.currentIndex === index && state.playing) {
      pause();
    } else {
      pause();
      loadRiddim(index);
      play();
    }
  });
});

/* ─── Filtres (filter-pill) ─── */
document.querySelectorAll('.filter-pill').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.riddim-card').forEach((card) => {
      const genre = card.dataset.genre;
      card.classList.toggle('hidden', filter !== 'all' && genre !== filter);
    });
  });
});

/* ─── Formulaire contact ─── */
const contactForm  = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const nom     = document.getElementById('nom')?.value.trim();
  const email   = document.getElementById('email')?.value.trim();
  const message = document.getElementById('message')?.value.trim();

  if (!nom || !email || !message) {
    if (formFeedback) { formFeedback.textContent = 'Remplis tous les champs obligatoires.'; formFeedback.style.color = '#e05555'; }
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (formFeedback) { formFeedback.textContent = 'Email invalide.'; formFeedback.style.color = '#e05555'; }
    return;
  }

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;
  setTimeout(() => {
    if (formFeedback) {
      formFeedback.textContent = 'Message envoyé ! On revient vers toi vite. Shatta World 🇲🇶';
      formFeedback.style.color = '#00A896';
    }
    contactForm.reset();
    if (submitBtn) submitBtn.disabled = false;
  }, 700);
});

/* ─── Navbar scroll ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

/* ─── Menu burger ─── */
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger?.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.mm-link').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger?.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});

/* ─── Scroll reveal ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── Init ─── */
loadRiddim(0);
