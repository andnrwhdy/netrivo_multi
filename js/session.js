window.NetrivoSession = {
  read(key, fallback) {
    try {
      const value = sessionStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  },
  write(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Learning remains usable when browser storage is unavailable.
    }
  },
  reset() {
    sessionStorage.clear();
    window.location.replace('index.html');
  }
};

document.addEventListener('click', (event) => {
  if (event.target.closest('[data-reset-session]')) NetrivoSession.reset();
});

window.addEventListener('pageshow', (event) => {
  if (event.persisted) window.location.reload();
});

document.addEventListener('DOMContentLoaded', () => {
  const host = document.querySelector('.module-topbar, .result-actions');
  if (!host || host.querySelector('[data-reset-session]')) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'session-reset';
  button.dataset.resetSession = '';
  button.textContent = 'Mulai Ulang';
  host.appendChild(button);
});
