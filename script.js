if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('has-motion');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -40px 0px', threshold: 0.08 });
  document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
}
// Keep the tool names readable when an outside logo service is unavailable.
document.querySelectorAll('.logo-tile img').forEach((logo) => {
  const fallback = () => {
    if (logo.dataset.fallbackReady) return;
    logo.dataset.fallbackReady = 'true';
    logo.hidden = true;
    const label = logo.nextElementSibling?.textContent?.trim() || 'Tool';
    const mark = document.createElement('span');
    mark.className = 'text-logo';
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = label.slice(0, 1).toUpperCase();
    logo.before(mark);
  };
  logo.addEventListener('error', fallback);
  if (logo.complete && logo.naturalWidth === 0) fallback();
});

// Open a video separately so the portfolio grid stays compact.
const sampleDialog = document.getElementById('sampleVideoDialog');
if (sampleDialog) {
  const player = document.getElementById('sampleVideoPlayer');
  const poster = document.getElementById('sampleVideoPoster');
  const title = document.getElementById('sampleVideoTitle');
  const status = document.getElementById('sampleVideoStatus');
  const download = document.getElementById('sampleVideoDownload');
  let previousOverflow = '';

  const showDownload = () => {
    if (!sampleDialog.open) return;
    player.pause();
    player.hidden = true;
    poster.hidden = false;
    status.hidden = false;
  };

  document.querySelectorAll('.watch-video').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('[data-video-src]');
      title.textContent = card.dataset.videoTitle;
      poster.src = card.dataset.videoPoster;
      player.poster = card.dataset.videoPoster;
      download.href = card.dataset.videoSrc;
      download.download = card.dataset.videoFile;
      poster.hidden = true;
      status.hidden = true;
      player.hidden = false;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      sampleDialog.showModal();
      player.src = card.dataset.videoSrc;
      player.load();
      player.play().catch(() => {
        if (player.error) showDownload();
      });
    });
  });

  player.addEventListener('error', showDownload);
  player.addEventListener('loadeddata', () => {
    if (player.videoWidth === 0 || player.videoHeight === 0) showDownload();
  });
  document.getElementById('sampleVideoClose').addEventListener('click', () => sampleDialog.close());
  sampleDialog.addEventListener('click', (event) => {
    if (event.target === sampleDialog) sampleDialog.close();
  });
  sampleDialog.addEventListener('close', () => {
    player.pause();
    player.removeAttribute('src');
    player.load();
    document.body.style.overflow = previousOverflow;
  });
}
