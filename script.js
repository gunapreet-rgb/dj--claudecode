/* ============================================================
   K2 — site behaviour
   Vanilla JS, no build step. Cart persists to localStorage.
   ============================================================ */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     Product catalogue
     --------------------------------------------------------- */
  var PRODUCTS = [
    {
      id: 'basecamp-500',
      name: 'Basecamp 500',
      tagline: '500 ml · everyday carry',
      price: 32,
      category: 'everyday',
      badge: null,
      colors: [
        { name: 'Glacier',  main: '#3aa9d8', light: '#7fd6f2', dark: '#12617f' },
        { name: 'Slate',    main: '#4b5f6c', light: '#78909e', dark: '#26343d' },
        { name: 'Snow',     main: '#e6ecef', light: '#ffffff', dark: '#b3bfc6' }
      ]
    },
    {
      id: 'summit-750',
      name: 'Summit 750',
      tagline: '750 ml · the flagship',
      price: 42,
      category: 'trail',
      badge: 'Bestseller',
      colors: [
        { name: 'Obsidian', main: '#26333c', light: '#4d616e', dark: '#0d151b' },
        { name: 'Ember',    main: '#d95f3b', light: '#f2916f', dark: '#93381d' },
        { name: 'Moss',     main: '#4e6b4a', light: '#7c9976', dark: '#2b3d29' }
      ]
    },
    {
      id: 'traverse-1l',
      name: 'Traverse 1L',
      tagline: '1 litre · long days out',
      price: 48,
      category: 'trail',
      badge: null,
      colors: [
        { name: 'Sandstone', main: '#c8a27a', light: '#e6c9a8', dark: '#8a6a48' },
        { name: 'Glacier',   main: '#3aa9d8', light: '#7fd6f2', dark: '#12617f' },
        { name: 'Obsidian',  main: '#26333c', light: '#4d616e', dark: '#0d151b' }
      ]
    },
    {
      id: 'karakoram-1-5l',
      name: 'Karakoram 1.5L',
      tagline: '1.5 litres · expedition spec',
      price: 64,
      category: 'expedition',
      badge: 'New',
      colors: [
        { name: 'Alpine Red', main: '#b5392f', light: '#dc6d5f', dark: '#7a1f19' },
        { name: 'Obsidian',   main: '#26333c', light: '#4d616e', dark: '#0d151b' },
        { name: 'Storm',      main: '#5d7484', light: '#8fa3b0', dark: '#33454f' }
      ]
    },
    {
      id: 'flask-350',
      name: 'Flask 350',
      tagline: '350 ml · coffee sized',
      price: 28,
      category: 'everyday',
      badge: null,
      colors: [
        { name: 'Snow',   main: '#e6ecef', light: '#ffffff', dark: '#b3bfc6' },
        { name: 'Ember',  main: '#d95f3b', light: '#f2916f', dark: '#93381d' },
        { name: 'Slate',  main: '#4b5f6c', light: '#78909e', dark: '#26343d' }
      ]
    },
    {
      id: 'coldline-2l',
      name: 'Coldline 2L',
      tagline: '2 litres · group hydration',
      price: 78,
      category: 'expedition',
      badge: null,
      colors: [
        { name: 'Storm',    main: '#5d7484', light: '#8fa3b0', dark: '#33454f' },
        { name: 'Moss',     main: '#4e6b4a', light: '#7c9976', dark: '#2b3d29' },
        { name: 'Glacier',  main: '#3aa9d8', light: '#7fd6f2', dark: '#12617f' }
      ]
    }
  ];

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------------------------------------------------------
     Product grid
     --------------------------------------------------------- */
  var grid = $('#productGrid');

  function bottleStyle(color) {
    return '--b-main:' + color.main + ';--b-light:' + color.light + ';--b-dark:' + color.dark + ';';
  }

  function renderProducts() {
    grid.innerHTML = PRODUCTS.map(function (p) {
      var c = p.colors[0];
      var swatches = p.colors.map(function (col, i) {
        return '<button class="swatch' + (i === 0 ? ' is-active' : '') + '"' +
               ' style="background:' + col.main + '"' +
               ' data-color-index="' + i + '"' +
               ' title="' + col.name + '"' +
               ' aria-label="' + col.name + '"></button>';
      }).join('');

      return '' +
        '<article class="card reveal" data-id="' + p.id + '" data-category="' + p.category + '">' +
          '<div class="card__media">' +
            (p.badge ? '<span class="card__badge">' + p.badge + '</span>' : '') +
            '<div class="bottle" style="' + bottleStyle(c) + '"></div>' +
          '</div>' +
          '<div class="card__body">' +
            '<div class="card__row">' +
              '<h3>' + p.name + '</h3>' +
              '<span class="card__price">$' + p.price + '</span>' +
            '</div>' +
            '<p class="card__meta">' + p.tagline + '</p>' +
            '<div class="card__swatches">' + swatches + '</div>' +
            '<button class="card__add">Add to cart</button>' +
          '</div>' +
        '</article>';
    }).join('');

    observeReveals();
  }

  /* Colour swatches + add-to-cart (delegated) */
  grid.addEventListener('click', function (e) {
    var card = e.target.closest('.card');
    if (!card) return;
    var product = PRODUCTS.find(function (p) { return p.id === card.dataset.id; });
    if (!product) return;

    var swatch = e.target.closest('.swatch');
    if (swatch) {
      $$('.swatch', card).forEach(function (s) { s.classList.remove('is-active'); });
      swatch.classList.add('is-active');
      $('.bottle', card).setAttribute('style', bottleStyle(product.colors[+swatch.dataset.colorIndex]));
      return;
    }

    var add = e.target.closest('.card__add');
    if (add) {
      var active = $('.swatch.is-active', card);
      var idx = active ? +active.dataset.colorIndex : 0;
      addToCart(product, idx);

      add.textContent = 'Added ✓';
      add.classList.add('is-added');
      setTimeout(function () {
        add.textContent = 'Add to cart';
        add.classList.remove('is-added');
      }, 1400);
    }
  });

  /* ---------------------------------------------------------
     Filters
     --------------------------------------------------------- */
  $$('.chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      $$('.chip').forEach(function (c) {
        c.classList.remove('is-active');
        c.setAttribute('aria-pressed', 'false');
      });
      chip.classList.add('is-active');
      chip.setAttribute('aria-pressed', 'true');

      var filter = chip.dataset.filter;
      $$('.card', grid).forEach(function (card) {
        var show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ---------------------------------------------------------
     Cart
     --------------------------------------------------------- */
  var STORAGE_KEY = 'k2-cart';
  var cart = [];

  try {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved) cart = JSON.parse(saved) || [];
  } catch (err) { cart = []; }

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (err) { /* private mode */ }
  }

  function addToCart(product, colorIndex) {
    var key = product.id + ':' + colorIndex;
    var existing = cart.find(function (i) { return i.key === key; });

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        key: key,
        id: product.id,
        name: product.name,
        price: product.price,
        color: product.colors[colorIndex].name,
        swatch: product.colors[colorIndex].main,
        qty: 1
      });
    }
    persist();
    renderCart();
    openDrawer();
  }

  function changeQty(key, delta) {
    var item = cart.find(function (i) { return i.key === key; });
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(function (i) { return i.key !== key; });
    persist();
    renderCart();
  }

  function renderCart() {
    var body = $('#drawerBody');
    var count = cart.reduce(function (n, i) { return n + i.qty; }, 0);
    var total = cart.reduce(function (n, i) { return n + i.qty * i.price; }, 0);

    var badge = $('#cartCount');
    badge.textContent = count;
    badge.classList.toggle('is-visible', count > 0);
    $('#cartTotal').textContent = '$' + total;

    if (!cart.length) {
      body.innerHTML = '<p class="drawer__empty">Nothing in here yet.</p>';
      return;
    }

    body.innerHTML = cart.map(function (i) {
      return '' +
        '<div class="line-item">' +
          '<div class="line-item__thumb">' +
            '<div class="line-item__chip" style="background:' + i.swatch + '"></div>' +
          '</div>' +
          '<div class="line-item__info">' +
            '<h4>' + i.name + '</h4>' +
            '<p>' + i.color + '</p>' +
            '<div class="qty">' +
              '<button data-key="' + i.key + '" data-delta="-1" aria-label="Decrease quantity">−</button>' +
              '<span>' + i.qty + '</span>' +
              '<button data-key="' + i.key + '" data-delta="1" aria-label="Increase quantity">+</button>' +
            '</div>' +
          '</div>' +
          '<div class="line-item__price">$' + (i.price * i.qty) + '</div>' +
        '</div>';
    }).join('');
  }

  $('#drawerBody').addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-key]');
    if (btn) changeQty(btn.dataset.key, +btn.dataset.delta);
  });

  $('#checkoutBtn').addEventListener('click', function () {
    if (!cart.length) return;
    alert('This is a demo storefront — no payment processing is wired up.');
  });

  /* ---------------------------------------------------------
     Drawer
     --------------------------------------------------------- */
  var drawer = $('#drawer');
  var scrim  = $('#drawerScrim');

  function openDrawer() {
    scrim.hidden = false;
    requestAnimationFrame(function () {
      scrim.classList.add('is-open');
      drawer.classList.add('is-open');
    });
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    scrim.classList.remove('is-open');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(function () { scrim.hidden = true; }, 350);
  }

  $('#cartBtn').addEventListener('click', openDrawer);
  $('#drawerClose').addEventListener('click', closeDrawer);
  scrim.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
  });

  /* ---------------------------------------------------------
     Nav: sticky state + mobile menu
     --------------------------------------------------------- */
  var nav = $('#nav');
  var navLinks = $('.nav__links');
  var navToggle = $('#navToggle');

  function onScroll() {
    nav.classList.toggle('is-stuck', window.scrollY > 60);
    parallax();
  }

  navToggle.addEventListener('click', function () {
    var open = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
    nav.classList.add('is-stuck');
  });

  $$('.nav__links a').forEach(function (a) {
    a.addEventListener('click', function () {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------------------------------------------------
     Hero parallax
     --------------------------------------------------------- */
  var ridges = [
    { el: $('.ridge--far'), rate: 0.28 },
    { el: $('.ridge--mid'), rate: 0.16 },
    { el: $('.ridge--near'), rate: 0.07 }
  ];
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ticking = false;

  function parallax() {
    if (reduced || ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        ridges.forEach(function (r) {
          if (r.el) r.el.style.transform = 'translateY(' + (y * r.rate) + 'px)';
        });
      }
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------- */
  var revealObserver = null;

  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  }

  function observeReveals() {
    $$('.reveal:not(.is-in)').forEach(function (el) {
      if (revealObserver) revealObserver.observe(el);
      else el.classList.add('is-in');
    });
  }

  /* ---------------------------------------------------------
     Count-up numbers
     --------------------------------------------------------- */
  function formatNumber(n) {
    return n >= 10000 ? n.toLocaleString('en-US') : String(n);
  }

  function countUp(el) {
    var target = parseInt(el.dataset.count, 10);
    if (reduced) { el.textContent = formatNumber(target); return; }

    var duration = 1500;
    var start = performance.now();

    function step(now) {
      var t = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = formatNumber(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    $$('[data-count]').forEach(function (el) { counterObserver.observe(el); });
  } else {
    $$('[data-count]').forEach(function (el) { el.textContent = formatNumber(+el.dataset.count); });
  }

  /* ---------------------------------------------------------
     Tech layers <-> cutaway rings
     --------------------------------------------------------- */
  $$('#layers li').forEach(function (li) {
    var ring = $('[data-ring="' + li.dataset.layer + '"]');

    function on()  { li.classList.add('is-active');    if (ring) ring.classList.add('is-lit'); }
    function off() { li.classList.remove('is-active'); if (ring) ring.classList.remove('is-lit'); }

    li.addEventListener('mouseenter', on);
    li.addEventListener('mouseleave', off);
    li.addEventListener('focusin', on);
    li.addEventListener('focusout', off);
  });

  /* ---------------------------------------------------------
     Newsletter form
     --------------------------------------------------------- */
  var form = $('#signupForm');
  var msg  = $('#formMsg');
  var emailInput = $('#email');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var value = emailInput.value.trim();
    var valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

    msg.classList.toggle('is-error', !valid);
    emailInput.classList.toggle('is-invalid', !valid);

    if (!valid) {
      msg.textContent = 'That email doesn’t look right — try again.';
      return;
    }
    msg.textContent = 'You’re on the list. Watch your inbox.';
    form.reset();
  });

  emailInput.addEventListener('input', function () {
    emailInput.classList.remove('is-invalid');
    msg.textContent = '';
  });

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */
  $('#year').textContent = new Date().getFullYear();
  renderProducts();
  renderCart();
  observeReveals();
})();
