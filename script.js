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

// Keep an original download available when a browser cannot play the file.
document.querySelectorAll('.video-card').forEach((card) => {
  const video = card.querySelector('video');
  const fallback = card.querySelector('.video-fallback');
  const status = card.querySelector('.video-status');
  video.addEventListener('error', () => {
    video.hidden = true;
    fallback.hidden = false;
    status.hidden = false;
  }, true);
  video.addEventListener('play', () => {
    document.querySelectorAll('.video-card video').forEach((other) => {
      if (other !== video) other.pause();
    });
  });
});
