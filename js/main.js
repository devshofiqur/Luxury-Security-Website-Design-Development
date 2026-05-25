/**
 * OUTPOST SECURITY SERVICES — MAIN JAVASCRIPT
 * ============================================
 */

(function () {
  "use strict";

  /* ── PAGE LOADER ─────────────────────────────── */
  window.addEventListener("load", function () {
    setTimeout(function () {
      var loader = document.getElementById("page-loader");
      if (loader) loader.classList.add("hidden");
    }, 1900);
  });

  /* ── THEME (DARK / LIGHT) ────────────────────── */
  var themeBtn = document.getElementById("theme-toggle");
  var currentTheme = localStorage.getItem("outpost-theme") || "dark";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("outpost-theme", theme);
    if (themeBtn) {
      themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
      themeBtn.title = theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
    }
    currentTheme = theme;
  }
  applyTheme(currentTheme);

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      applyTheme(currentTheme === "dark" ? "light" : "dark");
    });
  }

  /* ── LANGUAGE ────────────────────────────────── */
  var translations = {
    en: {
      nav_home: "Home", nav_about: "About", nav_services: "Services",
      nav_areas: "Areas", nav_careers: "Careers", nav_contact: "Contact",
      hero_badge: "Southern California's Elite Security Force",
      hero_title_1: "GUARDING WHAT", hero_title_2: "MATTERS MOST",
      hero_tagline: "Professional Security Solutions Across Southern California",
      hero_desc: "Armed, trained, and always on duty. Outpost Security delivers elite protection for commercial, residential, and executive clients 24/7.",
      btn_get_quote: "Get Free Quote", btn_call: "Call Now",
      form_title: "Request Security Services",
      form_sub: "Complete the form — we respond within 2 hours",
      step1: "Service Type", step2: "Details", step3: "Contact",
      about_label: "About Outpost Security",
      about_title: "Southern California's Most Trusted Security Force",
    },
    es: {
      nav_home: "Inicio", nav_about: "Nosotros", nav_services: "Servicios",
      nav_areas: "Áreas", nav_careers: "Empleos", nav_contact: "Contacto",
      hero_badge: "La Fuerza de Seguridad Élite del Sur de California",
      hero_title_1: "PROTEGIENDO LO QUE", hero_title_2: "MÁS IMPORTA",
      hero_tagline: "Soluciones Profesionales de Seguridad en el Sur de California",
      hero_desc: "Armados, entrenados y siempre de servicio. Outpost Security ofrece protección de élite 24/7 para clientes comerciales, residenciales y ejecutivos.",
      btn_get_quote: "Cotización Gratis", btn_call: "Llamar Ahora",
      form_title: "Solicitar Servicios de Seguridad",
      form_sub: "Complete el formulario — respondemos en 2 horas",
      step1: "Tipo de Servicio", step2: "Detalles", step3: "Contacto",
      about_label: "Sobre Outpost Security",
      about_title: "La Fuerza de Seguridad Más Confiable del Sur de California",
    },
    zh: {
      nav_home: "首页", nav_about: "关于我们", nav_services: "服务",
      nav_areas: "服务区域", nav_careers: "招聘", nav_contact: "联系我们",
      hero_badge: "南加州精英安保力量",
      hero_title_1: "守护最", hero_title_2: "重要的一切",
      hero_tagline: "遍及南加州的专业安保解决方案",
      hero_desc: "武装、训练有素、全天候待命。Outpost Security 为商业、住宅和行政客户提供24/7精英保护。",
      btn_get_quote: "免费报价", btn_call: "立即致电",
      form_title: "申请安保服务",
      form_sub: "填写表格 — 我们将在2小时内回复",
      step1: "服务类型", step2: "详情", step3: "联系方式",
      about_label: "关于 Outpost Security",
      about_title: "南加州最值得信赖的安保力量",
    }
  };

  var currentLang = localStorage.getItem("outpost-lang") || "en";

  function applyLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem("outpost-lang", lang);
    var t = translations[lang];
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (t[key]) el.textContent = t[key];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      if (t[key]) el.placeholder = t[key];
    });
    document.querySelectorAll(".lang-dropdown a").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-lang") === lang);
    });
    var currentLangDisplay = document.getElementById("current-lang");
    if (currentLangDisplay) {
      var flags = { en: "🇺🇸 EN", es: "🇪🇸 ES", zh: "🇨🇳 ZH" };
      currentLangDisplay.textContent = flags[lang] || lang.toUpperCase();
    }
  }

  document.querySelectorAll(".lang-dropdown a").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      applyLanguage(this.getAttribute("data-lang"));
    });
  });

  applyLanguage(currentLang);

  /* ── NAVBAR ──────────────────────────────────── */
  var navbar = document.getElementById("navbar");
  window.addEventListener("scroll", function () {
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 50);
    updateBackToTop();
    updateStickyBar();
    revealElements();
  });

  // Active nav link
  var sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", function () {
    var scrollY = window.scrollY + 100;
    sections.forEach(function (sec) {
      var top = sec.offsetTop;
      var height = sec.offsetHeight;
      var id = sec.getAttribute("id");
      var link = document.querySelector('.nav-links a[href="#' + id + '"]');
      if (link) link.classList.toggle("active", scrollY >= top && scrollY < top + height);
    });
  });

  /* ── MOBILE MENU ─────────────────────────────── */
  var hamburger = document.getElementById("hamburger");
  var mobileMenu = document.getElementById("mobile-menu");
  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("open");
      mobileMenu.classList.toggle("open");
      document.body.style.overflow = mobileMenu.classList.contains("open") ? "hidden" : "";
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        hamburger.classList.remove("open");
        mobileMenu.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ── MULTI-STEP FORM ─────────────────────────── */
  var currentStep = 1;
  var totalSteps = 3;

  function updateStepUI() {
    document.querySelectorAll(".form-step").forEach(function (step) {
      step.classList.toggle("active", parseInt(step.getAttribute("data-step")) === currentStep);
    });
    document.querySelectorAll(".step-dot").forEach(function (dot, i) {
      dot.classList.remove("active", "done");
      if (i + 1 === currentStep) dot.classList.add("active");
      if (i + 1 < currentStep) dot.classList.add("done");
    });
  }

  document.querySelectorAll(".btn-next-step").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (currentStep < totalSteps) { currentStep++; updateStepUI(); }
    });
  });

  document.querySelectorAll(".btn-prev-step").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (currentStep > 1) { currentStep--; updateStepUI(); }
    });
  });

  var heroForm = document.getElementById("hero-contact-form");
  if (heroForm) {
    heroForm.addEventListener("submit", function (e) {
      e.preventDefault();
      document.querySelectorAll(".form-step").forEach(function (s) { s.style.display = "none"; });
      document.querySelector(".step-indicators").style.display = "none";
      var success = document.querySelector(".form-success");
      if (success) { success.classList.add("show"); }
    });
  }

  updateStepUI();

  /* ── TESTIMONIALS SLIDER ─────────────────────── */
  var track = document.querySelector(".testimonials-track");
  var dots = document.querySelectorAll(".slider-dot");
  var cards = document.querySelectorAll(".testimonial-card");
  var sliderIdx = 0;
  var visibleCards = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1100 ? 2 : 3;

  function getVisibleCards() {
    return window.innerWidth <= 768 ? 1 : window.innerWidth <= 1100 ? 2 : 3;
  }

  function goToSlide(idx) {
    visibleCards = getVisibleCards();
    var maxIdx = Math.max(0, cards.length - visibleCards);
    sliderIdx = Math.min(Math.max(0, idx), maxIdx);
    if (!track) return;
    var cardWidth = track.parentElement.offsetWidth / visibleCards;
    track.style.transform = "translateX(-" + (sliderIdx * (cardWidth + 24)) + "px)";
    dots.forEach(function (d, i) { d.classList.toggle("active", i === sliderIdx); });
  }

  var prevBtn = document.getElementById("slider-prev");
  var nextBtn = document.getElementById("slider-next");
  if (prevBtn) prevBtn.addEventListener("click", function () { goToSlide(sliderIdx - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { goToSlide(sliderIdx + 1); });
  dots.forEach(function (d, i) { d.addEventListener("click", function () { goToSlide(i); }); });
  window.addEventListener("resize", function () { goToSlide(0); });

  // Auto-play
  setInterval(function () {
    var max = Math.max(0, cards.length - getVisibleCards());
    goToSlide(sliderIdx >= max ? 0 : sliderIdx + 1);
  }, 5000);

  /* ── BACK TO TOP ─────────────────────────────── */
  var backToTop = document.getElementById("back-to-top");
  function updateBackToTop() {
    if (backToTop) backToTop.classList.toggle("show", window.scrollY > 400);
  }
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ── STICKY CALL BAR ─────────────────────────── */
  var stickyBar = document.getElementById("sticky-call-bar");
  var stickyDismissed = false;
  function updateStickyBar() {
    if (stickyBar && !stickyDismissed) {
      stickyBar.classList.toggle("show", window.scrollY > 600);
    }
  }
  var stickyClose = document.getElementById("sticky-close");
  if (stickyClose) {
    stickyClose.addEventListener("click", function () {
      stickyDismissed = true;
      stickyBar.classList.remove("show");
    });
  }

  /* ── SCROLL REVEAL ────────────────────────────── */
  function revealElements() {
    var els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    els.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) el.classList.add("visible");
    });
  }
  revealElements();

  /* ── COUNTER ANIMATION ────────────────────────── */
  var countersStarted = false;
  function startCounters() {
    if (countersStarted) return;
    var counters = document.querySelectorAll(".count-up");
    if (!counters.length) return;
    var statsBanner = document.querySelector(".stats-banner");
    if (!statsBanner) return;
    var rect = statsBanner.getBoundingClientRect();
    if (rect.top > window.innerHeight) return;
    countersStarted = true;
    counters.forEach(function (counter) {
      var target = parseInt(counter.getAttribute("data-target"));
      var suffix = counter.getAttribute("data-suffix") || "";
      var start = 0;
      var duration = 2000;
      var step = target / (duration / 16);
      var timer = setInterval(function () {
        start += step;
        if (start >= target) {
          clearInterval(timer);
          counter.textContent = target + suffix;
        } else {
          counter.textContent = Math.floor(start) + suffix;
        }
      }, 16);
    });
  }
  window.addEventListener("scroll", startCounters);
  startCounters();

  /* ── SMOOTH ANCHOR SCROLL ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        var offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: "smooth" });
      }
    });
  });

  /* ── CONTACT FORM ─────────────────────────────── */
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = contactForm.querySelector('[type="submit"]');
      if (btn) {
        btn.textContent = "Sending...";
        btn.disabled = true;
      }
      setTimeout(function () {
        if (btn) { btn.textContent = "Message Sent!"; }
        var successMsg = document.getElementById("contact-success");
        if (successMsg) successMsg.style.display = "block";
        setTimeout(function () {
          if (btn) { btn.textContent = "Send Message"; btn.disabled = false; }
          if (successMsg) successMsg.style.display = "none";
          contactForm.reset();
        }, 4000);
      }, 1200);
    });
  }

  /* ── APPLICATION FORM ─────────────────────────── */
  var appForm = document.getElementById("application-form");
  if (appForm) {
    appForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = appForm.querySelector('[type="submit"]');
      if (btn) {
        btn.textContent = "Submitting...";
        btn.disabled = true;
      }
      setTimeout(function () {
        if (btn) { btn.textContent = "Application Submitted!"; }
        setTimeout(function () {
          if (btn) { btn.textContent = "Submit Application"; btn.disabled = false; }
          appForm.reset();
        }, 4000);
      }, 1200);
    });
  }

  /* ── PARALLAX HERO ────────────────────────────── */
  var heroBg = document.querySelector(".hero-bg");
  window.addEventListener("scroll", function () {
    if (heroBg && window.innerWidth > 768) {
      heroBg.style.transform = "scale(1.05) translateY(" + (window.scrollY * 0.25) + "px)";
    }
  });

  /* ── TICKER DUPLICATE ─────────────────────────── */
  var tickerInner = document.querySelector(".ticker-inner");
  if (tickerInner) {
    tickerInner.innerHTML += tickerInner.innerHTML;
  }

  /* ── PAGE NAVIGATION (SPA-LIKE) ──────────────── */
  // All content is on one page (index.html) — this handles hash changes
  function showSection(hash) {
    // Default to home
  }

  console.log("Outpost Security — System Active");
})();