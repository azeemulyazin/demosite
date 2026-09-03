/* =====================================================================
   7 Days Super Market — interactions & animations
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- sticky navbar shadow ---------- */
  var nav = document.getElementById('mainNav');
  var backTop = document.getElementById('backTop');

  function onScroll() {
    var y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 40);
    if (backTop) backTop.classList.toggle('show', y > 400);
    highlightNav();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- active link on scroll ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));
  var links = Array.prototype.slice.call(document.querySelectorAll('.navbar-nav .nav-link'));

  function highlightNav() {
    var pos = window.scrollY + 140;
    var current = '';
    sections.forEach(function (sec) {
      if (pos >= sec.offsetTop) current = sec.id;
    });
    links.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  /* ---------- close mobile menu after clicking a link ---------- */
  links.forEach(function (a) {
    a.addEventListener('click', function () {
      var menu = document.getElementById('navMenu');
      if (menu && menu.classList.contains('show')) {
        var bs = bootstrap.Collapse.getInstance(menu);
        if (bs) bs.hide();
      }
    });
  });

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(function () { el.classList.add('visible'); }, delay);
        obs.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- contact form (front-end only, no backend wired up) ---------- */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = document.getElementById('formMsg');
      if (!contactForm.checkValidity()) {
        msg.textContent = 'Please fill in your name, email and message.';
        msg.style.color = '#c62f16';
        return;
      }
      msg.textContent = 'Thank you! Your message has been received — we will get back to you soon.';
      msg.style.color = '';
      contactForm.reset();
      setTimeout(function () { msg.textContent = ''; }, 6000);
    });
  }

  /* ---------- footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* initial paint */
  onScroll();
})();
