document.addEventListener("DOMContentLoaded", async () => {
  async function loadPartial(targetId, file) {
    const target = document.getElementById(targetId);
    if (!target) return;

    const response = await fetch(file);
    const html = await response.text();
    target.innerHTML = html;
  }

  await Promise.all([
    loadPartial("header", "header.html"),
    loadPartial("footer", "footer.html"),
  ]);

  const header = document.querySelector(".site-nav");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const heroImage = document.querySelector(".hero-image");

  function closeMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.remove("active");
    mobileMenu.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
  }

  function toggleMenu(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!hamburger || !mobileMenu) return;

    const isOpen = mobileMenu.classList.toggle("active");
    hamburger.classList.toggle("active", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", toggleMenu);

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".site-nav")) {
        closeMenu();
      }
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 992) closeMenu();
    });
  }

  if (header) {
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 10);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const revealTargets = document.querySelectorAll(".reveal, .reveal-stagger");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    revealTargets.forEach((target) => observer.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
  }

  const handleParallax = () => {
    if (!heroImage) return;

    if (window.innerWidth < 992) {
      heroImage.style.transform = "translateY(0) scale(1.03)";
      return;
    }

    const offset = Math.min(window.scrollY * 0.18, 90);
    heroImage.style.transform = `translateY(${offset}px) scale(1.03)`;
  };

  handleParallax();
  window.addEventListener("scroll", handleParallax, { passive: true });
  window.addEventListener("resize", handleParallax);

  document.querySelectorAll('a[href*="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href) return;

      const [path, hash] = href.split("#");
      if (!hash) return;

      const currentPath = window.location.pathname.replace(/\/$/, "");
      const targetPath = path
        ? new URL(path, window.location.origin).pathname.replace(/\/$/, "")
        : currentPath;

      const isCurrentRoot = currentPath === "" || currentPath === "/";
      const isSamePage =
        targetPath === currentPath ||
        (isCurrentRoot &&
          (targetPath === "" ||
            targetPath === "/" ||
            targetPath.endsWith("/index.html")));

      if (isSamePage) {
        const target = document.getElementById(hash);
        if (target) {
          event.preventDefault();
          closeMenu();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });
  document.querySelectorAll(".work-carousel").forEach((carousel) => {
    const track = carousel.querySelector(".work-carousel-track");
    const prev = carousel.querySelector(".work-prev");
    const next = carousel.querySelector(".work-next");

    if (!track) return;

    const getStep = () => track.clientWidth;

    prev?.addEventListener("click", () => {
      track.scrollBy({ left: -getStep(), behavior: "smooth" });
    });

    next?.addEventListener("click", () => {
      track.scrollBy({ left: getStep(), behavior: "smooth" });
    });
  });
});
