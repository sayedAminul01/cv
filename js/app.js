/**
 * ============================================================
 * SAYED AMINUL — Portfolio JS (Dark-only, WhatsApp form)
 * ============================================================
 * Modules:
 *  1. Nav — scroll elevation, mobile menu, active link spy
 *  2. Typing animation — hero typist
 *  3. Hero canvas — particle network
 *  4. Scroll animations — IntersectionObserver
 *  5. Counters — animated stat numbers
 *  6. Skill bars — animated on scroll
 *  7. Contact form — validation + WhatsApp redirect
 *  8. Back-to-top
 *  9. Footer year
 * ============================================================
 */

'use strict';

/* ── tiny helpers ─────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const ready = fn => document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);

/* ============================================================
   1. NAVIGATION
============================================================ */
const Nav = (() => {
  const wrap  = $('#navWrap');
  const ham   = $('#hamburger');
  const mob   = $('#mobileNav');
  let sections = [];

  const onScroll = () => {
    wrap?.classList.toggle('scrolled', window.scrollY > 16);
    spy();
  };

  const spy = () => {
    const mid = window.scrollY + window.innerHeight / 3;
    let cur = '';
    sections.forEach(s => { if (s.offsetTop <= mid) cur = s.id; });
    $$('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.s === cur));
  };

  const toggleMob = () => {
    const open = ham.getAttribute('aria-expanded') === 'true';
    ham.setAttribute('aria-expanded', String(!open));
    mob.setAttribute('aria-hidden', String(open));
    mob.classList.toggle('open', !open);
  };

  const closeMob = () => {
    ham?.setAttribute('aria-expanded', 'false');
    mob?.setAttribute('aria-hidden', 'true');
    mob?.classList.remove('open');
  };

  const init = () => {
    sections = $$('section[id]');
    let raf = false;
    window.addEventListener('scroll', () => {
      if (!raf) { requestAnimationFrame(() => { onScroll(); raf = false; }); raf = true; }
    }, { passive: true });
    ham?.addEventListener('click', toggleMob);
    $$('.mob-link').forEach(l => l.addEventListener('click', closeMob));
    document.addEventListener('click', e => {
      if (mob?.classList.contains('open') && !mob.contains(e.target) && !ham?.contains(e.target)) closeMob();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMob(); });
    onScroll();
  };

  return { init };
})();

/* ============================================================
   2. TYPING ANIMATION
============================================================ */
const Typist = (() => {
  const words = [
    'IT support & troubleshooting',
    'WordPress website management',
    'Cloudflare & DNS configuration',
    'Linux server administration',
    'web hosting & cPanel setup',
    'technical training & education',
    'domain management',
    'AI-powered productivity tools',
  ];
  let wi = 0, ci = 0, del = false;
  const T = 65, D = 32, PE = 2000, PS = 380;

  const tick = (el) => {
    const w = words[wi];
    el.textContent = del ? w.slice(0, --ci) : w.slice(0, ++ci);
    let t = del ? D : T;
    if (!del && ci === w.length) { del = true; t = PE; }
    else if (del && ci === 0)   { del = false; wi = (wi + 1) % words.length; t = PS; }
    setTimeout(() => tick(el), t);
  };

  const init = () => {
    const el = $('#typist');
    if (el) setTimeout(() => tick(el), 900);
  };
  return { init };
})();

/* ============================================================
   3. HERO CANVAS
============================================================ */
const HeroCanvas = (() => {
  const N = 55, MAX = 135, SPD = 0.28;
  let cv, ctx, pts = [], W, H, raf;

  class P {
    constructor() { this.reset(true); }
    reset(rand) {
      this.x  = rand ? Math.random() * W : (Math.random() > .5 ? 0 : W);
      this.y  = rand ? Math.random() * H : Math.random() * H;
      this.vx = (Math.random() - .5) * SPD;
      this.vy = (Math.random() - .5) * SPD;
    }
    move() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59,130,246,.55)';
      ctx.fill();
    }
  }

  const resize = () => {
    W = cv.width  = cv.offsetWidth;
    H = cv.height = cv.offsetHeight;
  };

  const frame = () => {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => { p.move(); p.draw(); });
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < MAX) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(59,130,246,${(1 - d / MAX) * .18})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(frame);
  };

  const init = () => {
    cv = $('#heroCanvas');
    if (!cv) return;
    ctx = cv.getContext('2d');
    resize();
    for (let i = 0; i < N; i++) pts.push(new P());
    frame();
    new ResizeObserver(resize).observe(cv.parentElement);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf); else frame();
    });
  };
  return { init };
})();

/* ============================================================
   4. SCROLL ANIMATIONS
============================================================ */
const Anims = (() => {
  const init = () => {
    if (!('IntersectionObserver' in window)) {
      $$('[data-a]').forEach(el => el.classList.add('on'));
      return;
    }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -35px 0px' });
    $$('[data-a]').forEach(el => obs.observe(el));
  };
  return { init };
})();

/* ============================================================
   5. COUNTERS
============================================================ */
const Counters = (() => {
  const DUR = 1700;
  const run = el => {
    const target = parseInt(el.dataset.count, 10);
    const t0 = performance.now();
    const step = ts => {
      const p = Math.min((ts - t0) / DUR, 1);
      el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
      if (p < 1) requestAnimationFrame(step); else el.textContent = target;
    };
    requestAnimationFrame(step);
  };
  const init = () => {
    if (!('IntersectionObserver' in window)) { $$('[data-count]').forEach(el => el.textContent = el.dataset.count); return; }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { run(e.target); obs.unobserve(e.target); } });
    }, { threshold: 0.5 });
    $$('[data-count]').forEach(el => obs.observe(el));
  };
  return { init };
})();

/* ============================================================
   6. SKILL BARS
============================================================ */
const Bars = (() => {
  const init = () => {
    const fills = $$('.bar-fill');
    if (!fills.length) return;
    if (!('IntersectionObserver' in window)) { fills.forEach(f => f.style.width = f.dataset.w + '%'); return; }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setTimeout(() => { e.target.style.width = e.target.dataset.w + '%'; }, 120);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    fills.forEach(f => obs.observe(f));
  };
  return { init };
})();

/* ============================================================
   7. CONTACT FORM → WHATSAPP
   Builds a pre-filled WhatsApp message and opens wa.me link
============================================================ */
const ContactForm = (() => {
  const WA_NUMBER = '919365489154'; // country code + number, no +

  const fields = [
    {
      inp: 'fName',    err: 'errName',
      validate: v => v.trim().length >= 2 ? '' : 'Please enter your full name (min 2 characters).'
    },
    {
      inp: 'fEmail',   err: 'errEmail',
      validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.'
    },
    {
      inp: 'fSubject', err: 'errSubject',
      validate: v => v.trim().length >= 3 ? '' : 'Please enter a subject (min 3 characters).'
    },
    {
      inp: 'fMsg',     err: 'errMsg',
      validate: v => v.trim().length >= 10 ? '' : 'Please write a message (min 10 characters).'
    },
  ];

  const validate = ({ inp, err, validate }) => {
    const el = document.getElementById(inp);
    const em = document.getElementById(err);
    if (!el || !em) return true;
    const msg = validate(el.value);
    em.textContent = msg;
    el.classList.toggle('err', !!msg);
    return !msg;
  };

  const validateAll = () => fields.reduce((ok, f) => validate(f) && ok, true);

  const init = () => {
    const form = $('#contactForm');
    if (!form) return;

    // Live validation on blur
    fields.forEach(f => {
      const el = document.getElementById(f.inp);
      el?.addEventListener('blur', () => validate(f));
      el?.addEventListener('input', () => { if (el.classList.contains('err')) validate(f); });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!validateAll()) return;

      // Collect values
      const name    = document.getElementById('fName').value.trim();
      const email   = document.getElementById('fEmail').value.trim();
      const subject = document.getElementById('fSubject').value.trim();
      const message = document.getElementById('fMsg').value.trim();

      // Build pre-filled WhatsApp message
      const text = [
        `👋 Hello Sayed Aminul,`,
        ``,
        `I found your portfolio and would like to get in touch.`,
        ``,
        `*Name:* ${name}`,
        `*Email:* ${email}`,
        `*Subject:* ${subject}`,
        ``,
        `*Message:*`,
        message,
        ``,
        `Looking forward to hearing from you.`
      ].join('\n');

      const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  };

  return { init };
})();

/* ============================================================
   8. BACK TO TOP
============================================================ */
const BTT = (() => {
  const init = () => {
    const btn = $('#btt');
    if (!btn) return;
    window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 380), { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };
  return { init };
})();

/* ============================================================
   9. FOOTER YEAR
============================================================ */
const FooterYear = (() => {
  const init = () => { const el = $('#fyear'); if (el) el.textContent = new Date().getFullYear(); };
  return { init };
})();

/* ============================================================
   BOOT
============================================================ */
ready(() => {
  Nav.init();
  Typist.init();
  setTimeout(() => HeroCanvas.init(), 80);

  const idle = fn => 'requestIdleCallback' in window ? requestIdleCallback(fn) : setTimeout(fn, 150);
  idle(() => { Anims.init(); Counters.init(); Bars.init(); });

  ContactForm.init();
  BTT.init();
  FooterYear.init();
});