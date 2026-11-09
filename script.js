// ============================================
// Modern Portfolio Template — Interactions
// ============================================

(function () {
  "use strict";

  /* ---------- Theme toggle ---------- */
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;

  themeToggle.addEventListener("click", () => {
    const isLight = root.classList.toggle("light");
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  // Close menu when a link is clicked
  navLinks.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      navLinks.classList.remove("open");
      menuToggle.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    }
  });

  /* ---------- Sticky header ---------- */
  const header = document.getElementById("siteHeader");
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinkEls = document.querySelectorAll(".nav-link");

  function setActiveLink() {
    const scrollPos = window.scrollY + 120;
    let currentId = "";

    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinkEls.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${currentId}`
      );
    });
  }
  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll("[data-count]");

  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const duration = 1600;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  /* ---------- Skill bar animation ---------- */
  const skillCategories = document.querySelectorAll(".skill-category");

  const skillsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  skillCategories.forEach((category) => skillsObserver.observe(category));

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isValid = true;
    const fields = form.querySelectorAll("[required]");

    fields.forEach((field) => {
      const group = field.closest(".form-group");
      const value = field.value.trim();
      let fieldValid = true;

      if (!value) {
        fieldValid = false;
      } else if (field.type === "email" && !isValidEmail(value)) {
        fieldValid = false;
      }

      group.classList.toggle("error", !fieldValid);
      if (!fieldValid) isValid = false;
    });

    if (!isValid) {
      formStatus.textContent = "Please fill in all fields correctly.";
      formStatus.className = "form-status error";
      return;
    }

    // Build a mailto link from the form fields
    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const message = form.querySelector("#message").value.trim();

    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:faizanfarhad2211@gmail.com?subject=${subject}&body=${body}`;

    formStatus.textContent = "Your email app should open now. Thanks!";
    formStatus.className = "form-status success";
    form.reset();

    setTimeout(() => {
      formStatus.textContent = "";
      formStatus.className = "form-status";
    }, 5000);
  });

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  /* ---------- Copy email address ---------- */
  const copyBtn = document.getElementById("copyEmail");

  copyBtn.addEventListener("click", async () => {
    const email = "faizanfarhad2211@gmail.com";

    try {
      await navigator.clipboard.writeText(email);
      showCopiedState();
    } catch {
      // Fallback for environments where Clipboard API is unavailable
      const textarea = document.createElement("textarea");
      textarea.value = email;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      showCopiedState();
    }
  });

  function showCopiedState() {
    const label = copyBtn.querySelector("span");
    copyBtn.classList.add("copied");
    label.textContent = "Copied!";
    setTimeout(() => {
      copyBtn.classList.remove("copied");
      label.textContent = "Copy";
    }, 2000);
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();