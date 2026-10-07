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


// Preview graphic designs and multi-page reports on the portfolio.
const designDialog = document.getElementById('sampleDesignDialog');
if (designDialog) {
  const designImage = document.getElementById('sampleDesignImage');
  const designTitle = document.getElementById('sampleDesignTitle');
  const designStage = document.getElementById('sampleDesignStage');
  const designZoom = document.getElementById('sampleDesignZoom');
  const closePreview = document.getElementById('sampleDesignClose');
  const pageNav = document.getElementById('samplePreviewPages');
  const previousPage = document.getElementById('samplePreviewPrevious');
  const nextPage = document.getElementById('samplePreviewNext');
  const pageCount = document.getElementById('samplePreviewPageCount');
  let designPreviousOverflow = '';
  let designTrigger;
  let previewPages = [];
  let currentPage = 0;
  let previewAlt = '';

  const showPreviewPage = (index) => {
    currentPage = index;
    designImage.src = previewPages[currentPage];
    designImage.alt = previewPages.length > 1
      ? designTitle.textContent + ', page ' + (currentPage + 1) + ' of ' + previewPages.length
      : previewAlt;
    pageCount.textContent = 'Page ' + (currentPage + 1) + ' of ' + previewPages.length;
    previousPage.disabled = currentPage === 0;
    nextPage.disabled = currentPage === previewPages.length - 1;
    designStage.scrollTop = 0;
    designStage.scrollLeft = 0;
  };

  document.querySelectorAll('.view-design').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.sample-card');
      const preview = card.querySelector('.graphic-preview img, .report-preview img');
      designTrigger = button;
      previewAlt = preview.alt;
      previewPages = card.dataset.previewPages ? JSON.parse(card.dataset.previewPages) : [preview.getAttribute('src')];
      designTitle.textContent = card.querySelector('.sample-copy h3, .sample-copy h5').textContent;
      pageNav.hidden = previewPages.length === 1;
      closePreview.setAttribute('aria-label', card.classList.contains('sop-card') ? 'Close SOP' : card.classList.contains('report-card') ? 'Close report' : 'Close design');
      designStage.classList.remove('is-zoomed');
      designZoom.textContent = 'Zoom in';
      designZoom.setAttribute('aria-pressed', 'false');
      designPreviousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      designDialog.showModal();
      showPreviewPage(0);
    });
  });

  previousPage.addEventListener('click', () => {
    if (currentPage > 0) showPreviewPage(currentPage - 1);
  });
  nextPage.addEventListener('click', () => {
    if (currentPage < previewPages.length - 1) showPreviewPage(currentPage + 1);
  });
  designZoom.addEventListener('click', () => {
    const zoomed = designStage.classList.toggle('is-zoomed');
    designZoom.textContent = zoomed ? 'Fit image' : 'Zoom in';
    designZoom.setAttribute('aria-pressed', String(zoomed));
    designStage.scrollTop = 0;
  });
  closePreview.addEventListener('click', () => designDialog.close());
  designDialog.addEventListener('click', (event) => {
    if (event.target !== designDialog) return;
    const rect = designDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) designDialog.close();
  });
  designDialog.addEventListener('close', () => {
    document.body.style.overflow = designPreviousOverflow;
    designImage.removeAttribute('src');
    designTrigger?.focus();
  });
}
