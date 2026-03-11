 /* ═══════════════════════════════════════════════
     NAVBAR — shrink on scroll
  ═══════════════════════════════════════════════ */
  const navEl = document.getElementById('mainNav');
  window.addEventListener('scroll', () => navEl.classList.toggle('scrolled', scrollY > 50));

 
  function makeInfiniteSlider(trackId, prevId, nextId, visibleFn) {
    const track   = document.getElementById(trackId);
    const wrapper = track.parentElement;          // overflow:hidden container

    /* ── 1. Clone cards for infinite loop ── */
    const originals = Array.from(track.children);
    const total     = originals.length;
    originals.forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
    const allCards = Array.from(track.children); // originals + clones = total * 2

    let vis     = visibleFn();   // cards visible at once
    let cur     = 0;             // current index (0 … total-1)
    let isDragging  = false;
    let dragStartX  = 0;
    let dragCurrentX= 0;
    let dragOffset  = 0;         // live px offset while dragging

    /* ── 2. Set card widths ── */
    function setWidths() {
      vis = visibleFn();
      allCards.forEach(c => {
        c.style.width    = (100 / (vis * 2)) + '%'; // track is 2× wide
        c.style.flexShrink = '0';
      });
      // track itself = 200% so cards fill it properly
      track.style.width = '200%';
    }

    /* ── 3. Move to index (with or without transition) ── */
    function moveTo(index, animate) {
      track.style.transition = animate
        ? 'transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)'
        : 'none';
      // Each card is (100 / vis / 2)% of the track width.
      // translateX in % is relative to the track's own width (200% of wrapper).
      // So 1 card step = (100/vis)/2 % of track = (100/vis/2)%
      const cardWidthPct = 100 / (vis * 2); // % of track width per card
      track.style.transform = `translateX(-${index * cardWidthPct}%)`;
    }

    /* ── 4. After transition ends — silent jump for infinite loop ── */
    track.addEventListener('transitionend', () => {
      if (cur >= total) {
        cur -= total;
        moveTo(cur, false);
      } else if (cur < 0) {
        cur += total;
        moveTo(cur, false);
      }
    });

    /* ── 5. Slide one step forward / backward ── */
    function next() { cur++; moveTo(cur, true); }
    function prev() { cur--; moveTo(cur, true); }

    document.getElementById(prevId).addEventListener('click', prev);
    document.getElementById(nextId).addEventListener('click', next);

    /* ── 6. Drag (mouse) ── */
    wrapper.addEventListener('mousedown', e => {
      isDragging  = true;
      dragStartX  = e.clientX;
      dragOffset  = 0;
      track.style.transition = 'none';
      wrapper.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', e => {
      if (!isDragging) return;
      dragCurrentX = e.clientX;
      dragOffset   = dragCurrentX - dragStartX;
      const cardWidthPx = wrapper.offsetWidth / vis;
      const basePx      = -(cur / (vis * 2)) * track.offsetWidth;
      track.style.transform = `translateX(${basePx + dragOffset}px)`;
    });
    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      wrapper.style.cursor = '';
      const threshold = wrapper.offsetWidth / vis / 3;
      if      (dragOffset < -threshold) next();
      else if (dragOffset >  threshold) prev();
      else moveTo(cur, true);
      dragOffset = 0;
    });

    /* ── 7. Swipe (touch) ── */
    wrapper.addEventListener('touchstart', e => {
      dragStartX = e.touches[0].clientX;
      dragOffset = 0;
      track.style.transition = 'none';
    }, { passive: true });
    wrapper.addEventListener('touchmove', e => {
      dragOffset = e.touches[0].clientX - dragStartX;
      const cardWidthPx = wrapper.offsetWidth / vis;
      const basePx      = -(cur / (vis * 2)) * track.offsetWidth;
      track.style.transform = `translateX(${basePx + dragOffset}px)`;
    }, { passive: true });
    wrapper.addEventListener('touchend', () => {
      const threshold = wrapper.offsetWidth / vis / 3;
      if      (dragOffset < -threshold) next();
      else if (dragOffset >  threshold) prev();
      else moveTo(cur, true);
      dragOffset = 0;
    });

    /* ── 8. Init & responsive ── */
    function init() {
      setWidths();
      moveTo(cur, false);
    }
    init();
    window.addEventListener('resize', init);
  }

  /* ── Instantiate both sliders ── */
  makeInfiniteSlider(
    'srvTrack', 'srvPrev', 'srvNext',
    () => innerWidth < 768 ? 1 : innerWidth < 992 ? 2 : 3
  );
  makeInfiniteSlider(
    'brTrack', 'brPrev', 'brNext',
    () => innerWidth < 768 ? 1 : 2
  );

  /* ═══════════════════════════════════════════════
     SCROLL REVEAL
  ═══════════════════════════════════════════════ */
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

  /* ═══════════════════════════════════════════════
     SMOOTH SCROLL
  ═══════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });