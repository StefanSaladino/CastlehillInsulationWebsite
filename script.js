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

  // REVIEWS CAROUSEL
const track = document.querySelector("[data-reviews-track]");
if (track) {
  const originalItems = Array.from(track.children);
  if (!originalItems.length) return;

  // Duplicate for seamless loop
  originalItems.forEach((item) => {
    track.appendChild(item.cloneNode(true));
  });

  // Avatar initials
  track.querySelectorAll(".avatar").forEach((el) => {
    const name = el.dataset.name || "";
    const initials = name
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    el.textContent = initials || "G";
  });

  let position = 0;
  let speed = 0.35;
  let paused = false;
  let halfWidth = 0;

  const measure = () => {
    halfWidth = track.scrollWidth / 2;
  };

  const animate = () => {
    if (!paused && halfWidth > 0) {
      position -= speed;

      if (Math.abs(position) >= halfWidth) {
        position = 0;
      }

      track.style.transform = `translate3d(${position}px, 0, 0)`;
    }

    requestAnimationFrame(animate);
  };

  // wait for layout
  requestAnimationFrame(() => {
    measure();
    animate();
  });

  window.addEventListener("resize", measure);

  track.addEventListener("mouseenter", () => (paused = true));
  track.addEventListener("mouseleave", () => (paused = false));

  // Touch support
  let startX = 0;
  let dragging = false;

  track.addEventListener("touchstart", (e) => {
    dragging = true;
    paused = true;
    startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener("touchmove", (e) => {
    if (!dragging) return;

    const currentX = e.touches[0].clientX;
    const delta = currentX - startX;

    position += delta * 0.55;
    startX = currentX;

    track.style.transform = `translate3d(${position}px, 0, 0)`;
    e.preventDefault();
  }, { passive: false });

  track.addEventListener("touchend", () => {
    dragging = false;
    paused = false;
  });
}
});
