const pages = Array.from(document.querySelectorAll('.page'));
const heroImage = document.querySelector('.hero-image');
const heroImages = [
  'img/2024-01-19_23.10.12.png',
  'img/2024-01-25_15.45.08.png',
  'img/2026-01-26_00.03.30.png',
  'img/屏幕截图 2023-04-30 224519.png',
];
let currentPage = 0;
let locked = false;
let loadingScreen = null;

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

if (heroImage && heroImages.length > 0) {
  const randomIndex = Math.floor(Math.random() * heroImages.length);
  heroImage.src = heroImages[randomIndex];
}

function createLoadingScreen() {
  const screen = document.createElement('div');
  screen.className = 'loading-screen';
  screen.setAttribute('aria-live', 'polite');
  screen.textContent = '加载中';
  document.body.prepend(screen);
  return screen;
}

function hideLoadingScreen() {
  loadingScreen?.classList.add('is-hidden');

  window.setTimeout(() => {
    loadingScreen?.remove();
    loadingScreen = null;
  }, 350);
}

function resetToFirstPage() {
  currentPage = 0;
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'instant',
  });
}

function syncCurrentPage() {
  currentPage = Math.max(0, Math.min(Math.round(window.scrollY / window.innerHeight), pages.length - 1));
}

resetToFirstPage();

if (!heroImage || !heroImage.complete || heroImage.naturalWidth === 0) {
  loadingScreen = createLoadingScreen();
} else {
  document.body.classList.add('is-loaded');
}

window.addEventListener('DOMContentLoaded', resetToFirstPage);

window.addEventListener('load', () => {
  resetToFirstPage();
  window.setTimeout(resetToFirstPage, 50);
  window.setTimeout(resetToFirstPage, 250);
  hideLoadingScreen();
  document.body.classList.add('is-loaded');
});

window.addEventListener('pageshow', () => {
  resetToFirstPage();
  window.setTimeout(resetToFirstPage, 0);
  window.setTimeout(resetToFirstPage, 50);
});

function goToPage(pageIndex) {
  const clampedIndex = Math.max(0, Math.min(pageIndex, pages.length - 1));
  const targetIsAlreadyVisible = Math.abs(pages[clampedIndex].getBoundingClientRect().top) < 2;

  if (clampedIndex === currentPage && targetIsAlreadyVisible) {
    return;
  }

  currentPage = clampedIndex;
  locked = true;

  pages[currentPage].scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });

  window.setTimeout(() => {
    locked = false;
  }, 850);
}

window.addEventListener(
  'wheel',
  (event) => {
    event.preventDefault();

    if (locked || Math.abs(event.deltaY) < 8) {
      return;
    }

    syncCurrentPage();
    goToPage(currentPage + (event.deltaY > 0 ? 1 : -1));
  },
  { passive: false }
);

window.addEventListener('keydown', (event) => {
  if (locked) {
    return;
  }

  if (event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ') {
    event.preventDefault();
    goToPage(currentPage + 1);
  }

  if (event.key === 'ArrowUp' || event.key === 'PageUp') {
    event.preventDefault();
    goToPage(currentPage - 1);
  }
});
