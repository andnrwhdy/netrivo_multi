const playButton = document.querySelector('[data-play]');
const playlist = Array.from(document.querySelectorAll('[data-playlist-video]'));
let activeVideoIndex = 0;

const dashboardHeader = document.querySelector('.netrivo-header');
const dashboardHero = document.querySelector('.netrivo-hero');
let headerScrollFrame = 0;

const updateDashboardHeaderShape = () => {
  headerScrollFrame = 0;
  if (!dashboardHeader || !dashboardHero) return;

  const isOutsideHero = dashboardHero.getBoundingClientRect().bottom <= dashboardHeader.offsetHeight;
  dashboardHeader.classList.toggle('is-outside-hero', isOutsideHero);
};

const scheduleDashboardHeaderUpdate = () => {
  if (headerScrollFrame) return;
  headerScrollFrame = window.requestAnimationFrame(updateDashboardHeaderShape);
};

window.addEventListener('scroll', scheduleDashboardHeaderUpdate, { passive: true });
window.addEventListener('resize', scheduleDashboardHeaderUpdate);
updateDashboardHeaderShape();

const activateVideo = (index) => {
  if (!playlist.length) return;

  activeVideoIndex = index % playlist.length;

  playlist.forEach((video, videoIndex) => {
    const isActive = videoIndex === activeVideoIndex;
    video.classList.toggle('is-active', isActive);
    video.setAttribute('aria-hidden', String(!isActive));
    video.muted = true;

    if (!isActive) {
      video.pause();
      video.currentTime = 0;
    }
  });

  const activeVideo = playlist[activeVideoIndex];
  activeVideo.currentTime = 0;

  const startVideo = () => {
    activeVideo.play().catch(() => {
      // Browser tetap dapat memulai video setelah interaksi pertama pengguna.
    });
  };

  if (activeVideo.readyState >= 2) {
    startVideo();
  } else {
    activeVideo.addEventListener('canplay', startVideo, { once: true });
  }
};

playlist.forEach((video, videoIndex) => {
  video.addEventListener('ended', () => activateVideo(videoIndex + 1));
  video.addEventListener('error', () => {
    if (videoIndex === activeVideoIndex) activateVideo(videoIndex + 1);
  });
});

activateVideo(0);

document.addEventListener('visibilitychange', () => {
  if (!document.hidden && playlist[activeVideoIndex]) {
    playlist[activeVideoIndex].play().catch(() => {});
  }
});

if (playButton) {
  playButton.addEventListener('click', () => {
    const isPlaying = playButton.classList.toggle('playing');
    playButton.textContent = isPlaying ? 'Pause' : 'Putar';
  });
}

const evaluationDialog = document.querySelector('[data-evaluation-dialog]');
const evaluationTriggers = document.querySelectorAll('.evaluation-nav-button, .course-evaluation-button');
const evaluationCloseButton = document.querySelector('[data-evaluation-close]');
let evaluationDialogTrigger = null;

const closeEvaluationDialog = () => {
  if (!evaluationDialog?.open || evaluationDialog.classList.contains('is-closing')) return;
  evaluationDialog.classList.add('is-closing');
  document.body.classList.remove('evaluation-dialog-open');
  window.setTimeout(() => {
    evaluationDialog.close();
    evaluationDialog.classList.remove('is-closing');
    evaluationDialogTrigger?.focus();
  }, 180);
};

evaluationTriggers.forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    if (!evaluationDialog) return;
    event.preventDefault();
    evaluationDialogTrigger = trigger;
    evaluationDialog.showModal();
    document.body.classList.add('evaluation-dialog-open');
    evaluationDialog.focus();
  });
});

evaluationCloseButton?.addEventListener('click', closeEvaluationDialog);
evaluationDialog?.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeEvaluationDialog();
});
evaluationDialog?.addEventListener('click', (event) => {
  if (event.target === evaluationDialog) closeEvaluationDialog();
});

const netrivoGameFrame = document.querySelector('.solution-game iframe');
const platformerGameFrame = document.querySelector('.platformer-game iframe');

window.addEventListener('message', (event) => {
  if (!netrivoGameFrame || event.source !== netrivoGameFrame.contentWindow) return;
  if (event.data?.type !== 'netrivo-go-height') return;

  const height = Number(event.data.height);
  if (!Number.isFinite(height)) return;

  netrivoGameFrame.style.height = `${Math.max(480, Math.min(height, 940))}px`;
});

window.addEventListener('message', (event) => {
  if (!platformerGameFrame || event.source !== platformerGameFrame.contentWindow) return;
  if (event.data?.type !== 'petualangan-jaringan-height') return;

  const height = Number(event.data.height);
  if (!Number.isFinite(height)) return;

  platformerGameFrame.style.height = `${Math.max(420, Math.min(height, 940))}px`;
});
