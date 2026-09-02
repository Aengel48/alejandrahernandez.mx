
// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.sec, .quad, .oc, .price-card, .ci').forEach((el, i) => {
  el.classList.add('reveal');
  observer.observe(el);
});

// Stagger children inside grids
document.querySelectorAll('.quad-grid, .outcome-grid, .pricing-grid').forEach(grid => {
  [...grid.children].forEach((child, i) => {
    child.style.transitionDelay = (i * 0.08) + 's';
  });
});

// Lang toggle
function setLang(lang) {
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.lang-btn').forEach(b => { if(b.textContent.toLowerCase()===lang) b.classList.add('active'); });
  document.querySelectorAll('[data-en]').forEach(el => {
    const val = el.getAttribute('data-'+lang);
    if(val) el.innerHTML = val;
  });
  document.getElementById('marquee-en').style.display = lang==='en' ? 'inline-block' : 'none';
  document.getElementById('marquee-es').style.display = lang==='es' ? 'inline-block' : 'none';
}

// Default to Spanish on load
setLang('es');

function openFlyer(){document.getElementById('flyerLightbox').classList.add('active');document.body.style.overflow='hidden'}
function closeFlyer(){document.getElementById('flyerLightbox').classList.remove('active');document.body.style.overflow=''}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeFlyer();closeMenu()}});

// Mobile nav
function toggleMenu(){
  document.getElementById('navLinks').classList.toggle('open');
  document.querySelector('.nav-toggle').classList.toggle('open');
}
function closeMenu(){
  document.getElementById('navLinks').classList.remove('open');
  document.querySelector('.nav-toggle').classList.remove('open');
}

// ═══════════════════════════════════════════════════════
// PARALLAX & SCROLL EFFECTS — elegant depth
// ═══════════════════════════════════════════════════════
(function(){
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced) return;

  const isMobile = window.innerWidth < 768;

  // ── Hero parallax (desktop only) ──
  // Multiple layers moving at different speeds creates real depth.
  // The decorative orb/ring drift DOWN slowly (background feel),
  // while the text content drifts UP faster (foreground feel).
  if(!isMobile){
    const heroLayers = [
      { sel: '.hero-orb',       speed: 0.35,  type: 'bg'   },
      { sel: '.hero-deco-ring', speed: 0.25,  type: 'bg'   },
      { sel: '.brand-mark',     speed: -0.25, type: 'fg'   },
      { sel: '.hero-body',      speed: -0.15, type: 'fg'   },
      { sel: '.hero-stats',     speed: -0.10, type: 'fg'   }
    ];
    const items = heroLayers.map(l => {
      const el = document.querySelector(l.sel);
      if(!el) return null;
      // Capture base transform (e.g., the -50%,-50% centering on orb/ring)
      const base = getComputedStyle(el).transform;
      return { el, speed: l.speed, type: l.type,
               baseTransform: (base && base !== 'none') ? base : '' };
    }).filter(Boolean);

    items.forEach(i => { i.el.style.willChange = 'transform'; });

    let lastY = window.scrollY, ticking = false;
    function updateHero(){
      if(lastY < window.innerHeight * 1.5){
        items.forEach(item => {
          const offset = lastY * item.speed;
          if(item.baseTransform){
            // Orb/ring need to keep their centering transform; wrap the
            // parallax offset into translate3d AFTER the base transform
            item.el.style.transform = item.baseTransform + ' translate3d(0,' + offset + 'px,0)';
          } else {
            item.el.style.transform = 'translate3d(0,' + offset + 'px,0)';
          }
        });
      }
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      lastY = window.scrollY;
      if(!ticking){
        window.requestAnimationFrame(updateHero);
        ticking = true;
      }
    }, { passive: true });
    updateHero();
  }

  // ── Section reveal — fade + drift up as sections enter viewport ──
  if('IntersectionObserver' in window){
    const sections = document.querySelectorAll('section.sec, .workshop-banner');
    sections.forEach(s => s.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -80px 0px'
    });

    sections.forEach(s => observer.observe(s));
  }
})();
