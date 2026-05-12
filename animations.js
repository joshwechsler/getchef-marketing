/* ============================================================
   ChefOS Marketing — animations.js
   Apple-style scroll animations, counters, parallax
   ============================================================ */

const nav = document.querySelector(".site-nav");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const contactForm = document.querySelector("[data-contact-form]");
const formMessage = document.querySelector("[data-form-message]");

/* ---- Nav: scroll class ---- */
function updateNav() {
  if (!nav) return;
  nav.classList.toggle("scrolled", window.scrollY > 10);
}

/* ---- Parallax on hero device ---- */
const parallaxItems = document.querySelectorAll("[data-parallax]");

function updateParallax() {
  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.parallax || 0.035);
    const rect = item.getBoundingClientRect();
    const offset = (window.innerHeight / 2 - rect.top - rect.height / 2) * speed;
    item.style.transform = `translate3d(0, ${offset}px, 0)`;
  });
}

/* ---- Generic reveal with IntersectionObserver ---- */
const reveals = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

reveals.forEach((item) => revealObserver.observe(item));

/* ---- Stat counters ---- */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || "";
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target + suffix;
  }

  requestAnimationFrame(tick);
}

const statCounters = document.querySelectorAll(".stat-counter[data-target]");

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

statCounters.forEach((el) => counterObserver.observe(el));

/* ---- Dashboard section progress bars ---- */
const dpBars = document.querySelectorAll(".dp-bar");

const dpBarObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const fill = bar.querySelector(".dp-fill");
        if (fill) {
          const pct = bar.dataset.progress || "0";
          // slight delay so the reveal animation starts first
          setTimeout(() => { fill.style.width = pct + "%"; }, 180);
        }
        dpBarObserver.unobserve(bar);
      }
    });
  },
  { threshold: 0.4 }
);

dpBars.forEach((bar) => dpBarObserver.observe(bar));

/* ---- Plating section reveal rows ---- */
const plateRows = document.querySelectorAll(".plate-row-xl");

const plateObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("row-visible");
        plateObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

plateRows.forEach((row) => plateObserver.observe(row));

/* ---- Highlight: Plating card rows ---- */
const platingRows = document.querySelectorAll(".plating-row-reveal");

const platingRowObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("plating-visible");
        platingRowObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

platingRows.forEach((row) => platingRowObserver.observe(row));

/* ---- Hero device: fill progress bars on load ---- */
function animateHeroDevice() {
  const fills = document.querySelectorAll(".recipe-progress-fill");
  fills.forEach((fill, i) => {
    const target = fill.style.getPropertyValue("--rp") || "0%";
    fill.style.setProperty("--rp", "0%");
    setTimeout(() => {
      fill.style.transition = "width 1.2s cubic-bezier(0.22, 1, 0.36, 1)";
      fill.style.setProperty("--rp", target);
      fill.style.width = target;
    }, 800 + i * 200);
  });
}

/* ---- Hero device: badge cycling (not_started → in_progress → complete → loop) ---- */
function startBadgeCycle() {
  const badge = document.getElementById("hero-badge-1");
  if (!badge) return;

  const states = [
    { text: "Not Started", cls: "status-notstarted" },
    { text: "In Progress", cls: "status-inprogress" },
    { text: "Complete", cls: "status-complete" },
  ];

  let current = 1; // starts as "In Progress"

  setInterval(() => {
    current = (current + 1) % states.length;
    const s = states[current];
    badge.textContent = s.text;
    badge.className = "recipe-status " + s.cls;
  }, 2500);
}

/* ---- Parsley import animation ---- */
function runParsleyAnimation() {
  const loading = document.getElementById("import-loading");
  const done = document.getElementById("import-done");
  const bar = document.getElementById("import-bar");
  const pct = document.getElementById("import-pct");
  const counter = document.getElementById("import-counter");
  if (!loading || !done || !bar) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 12 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);

      if (bar) bar.style.width = "100%";
      if (pct) pct.textContent = "100%";

      setTimeout(() => {
        loading.style.display = "none";
        done.style.display = "flex";
        animateImportCounter(counter, 2398, 1200);
      }, 400);
    } else {
      if (bar) bar.style.width = progress + "%";
      if (pct) pct.textContent = Math.floor(progress) + "%";
    }
  }, 120);
}

function animateImportCounter(el, target, duration) {
  if (!el) return;
  const start = performance.now();
  function tick(now) {
    const elapsed = now - start;
    const p = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(tick);
}

/* Observe the import mockup to trigger the animation */
const importMockup = document.querySelector(".import-mockup");

if (importMockup) {
  let importTriggered = false;
  const importObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !importTriggered) {
          importTriggered = true;
          setTimeout(runParsleyAnimation, 600);
          importObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  importObserver.observe(importMockup);
}

/* Also re-trigger import animation on a loop so it resets after done */
function resetAndLoopImport() {
  const loading = document.getElementById("import-loading");
  const done = document.getElementById("import-done");
  const bar = document.getElementById("import-bar");
  const pct = document.getElementById("import-pct");
  const counter = document.getElementById("import-counter");
  if (!loading || !done) return;

  setTimeout(() => {
    done.style.display = "none";
    loading.style.display = "flex";
    if (bar) bar.style.width = "0%";
    if (pct) pct.textContent = "0%";
    if (counter) counter.textContent = "0";
    setTimeout(runParsleyAnimation, 800);
    setTimeout(resetAndLoopImport, 6000);
  }, 5000);
}

/* ---- Nav toggle ---- */
navToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  document.body.classList.toggle("menu-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    document.body.classList.remove("menu-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

/* ---- Contact form (other pages) ---- */
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const requiredFields = contactForm.querySelectorAll("[required]");
  let valid = true;

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      valid = false;
      field.setAttribute("aria-invalid", "true");
    } else {
      field.removeAttribute("aria-invalid");
    }
  });

  const email = contactForm.querySelector('input[type="email"]');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    valid = false;
    email.setAttribute("aria-invalid", "true");
  }

  if (!valid) {
    if (formMessage) formMessage.textContent = "Fill in the required fields and use a valid email.";
    return;
  }

  if (formMessage) formMessage.textContent = "Thanks. We will reach out to schedule your demo.";
  contactForm.reset();
});

/* ---- Scroll + resize listeners ---- */
window.addEventListener("scroll", () => {
  updateNav();
  updateParallax();
}, { passive: true });

window.addEventListener("resize", updateParallax);

/* ---- Init ---- */
updateNav();
updateParallax();

window.addEventListener("load", () => {
  animateHeroDevice();
  startBadgeCycle();
  // Start import loop if visible on load
  setTimeout(resetAndLoopImport, 6000);
});
