document.addEventListener('DOMContentLoaded', function () {
  // ---- Parallax scroll effect ----
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  if (parallaxEls.length && !reduceMotion) {
    var ticking = false;
    var updateParallax = function () {
      var vh = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
        var rect = el.getBoundingClientRect();
        if (rect.bottom < -300 || rect.top > vh + 300) { return; }
        var offset = (rect.top - vh / 2) * speed;
        el.style.setProperty('--py', offset.toFixed(1) + 'px');
      });
      ticking = false;
    };
    var onScroll = function () {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateParallax();
  }

  var splash = document.querySelector('.splash');
  if (splash) {
    var alreadySeen = false;
    try { alreadySeen = sessionStorage.getItem('gh-splash-seen') === '1'; } catch (e) {}

    function dismissSplash() {
      splash.classList.add('hide');
      document.body.classList.remove('splash-locked');
      try { sessionStorage.setItem('gh-splash-seen', '1'); } catch (e) {}
    }

    if (alreadySeen) {
      splash.classList.add('hide');
    } else {
      document.body.classList.add('splash-locked');
      var enterBtn = splash.querySelector('.splash-enter');
      if (enterBtn) { enterBtn.addEventListener('click', dismissSplash); }
      splash.addEventListener('click', function (e) {
        if (e.target === splash) { dismissSplash(); }
      });
      setTimeout(dismissSplash, 5200);
    }
  }

  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  var yearEls = document.querySelectorAll('.js-year');
  yearEls.forEach(function (el) { el.textContent = new Date().getFullYear(); });

  var form = document.querySelector('.js-contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var note = form.querySelector('.form-note');
      if (btn) { btn.textContent = 'Message sent'; btn.disabled = true; }
      if (note) { note.textContent = 'Thank you — a member of the Gemini Holdings team will follow up within one business day.'; }
    });
  }
});
