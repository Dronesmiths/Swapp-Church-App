const ready = (callback) => {
  if (document.readyState !== "loading") {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
};

ready(() => {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  const body = document.body;

  if (navToggle && mobileNav) {
    const setMobileNavState = (isOpen) => {
      mobileNav.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      mobileNav.setAttribute("aria-hidden", String(!isOpen));
      body.classList.toggle("has-open-nav", isOpen);
    };

    setMobileNavState(false);

    navToggle.addEventListener("click", () => {
      const willOpen = navToggle.getAttribute("aria-expanded") !== "true";
      setMobileNavState(willOpen);
    });

    mobileNav.addEventListener("click", (event) => {
      if (event.target.matches("a")) {
        setMobileNavState(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setMobileNavState(false);
        navToggle.focus();
      }
    });
  }

  const dropdownToggle = document.querySelector("[data-dropdown-toggle]");
  const dropdownMenu = document.querySelector("[data-dropdown]");

  if (dropdownToggle && dropdownMenu) {
    const closeDropdown = () => {
      dropdownMenu.classList.remove("is-open");
      dropdownToggle.setAttribute("aria-expanded", "false");
    };

    dropdownToggle.addEventListener("click", (event) => {
      event.preventDefault();
      const willOpen = !dropdownMenu.classList.contains("is-open");
      dropdownMenu.classList.toggle("is-open", willOpen);
      dropdownToggle.setAttribute("aria-expanded", String(willOpen));
    });

    document.addEventListener("click", (event) => {
      if (!dropdownMenu.contains(event.target) && !dropdownToggle.contains(event.target)) {
        closeDropdown();
      }
    });

    dropdownToggle.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeDropdown();
        dropdownToggle.focus();
      }
    });

    dropdownMenu.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeDropdown();
        dropdownToggle.focus();
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        event.preventDefault();
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealElements.length) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  const lazyImages = document.querySelectorAll("img[loading=\"lazy\"]");

  if (!("loading" in HTMLImageElement.prototype) && "IntersectionObserver" in window) {
    const lazyObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const dataSrc = img.dataset.src;
          if (dataSrc) {
            img.src = dataSrc;
          }
          obs.unobserve(img);
        }
      });
    });

    lazyImages.forEach((img) => {
      if (img.dataset.src) {
        lazyObserver.observe(img);
      }
    });
  }

  const loadMoreButton = document.querySelector("[data-load-more]");
  const loadMoreTargets = document.querySelectorAll("[data-load-more-target]");

  if (loadMoreButton && loadMoreTargets.length) {
    loadMoreButton.addEventListener("click", () => {
      loadMoreTargets.forEach((element) => {
        element.classList.remove("is-hidden");
        element.removeAttribute("data-load-more-target");
      });

      loadMoreButton.textContent = "All articles loaded";
      loadMoreButton.setAttribute("disabled", "true");
      loadMoreButton.classList.add("btn--disabled");
    });
  } else if (loadMoreButton) {
    loadMoreButton.setAttribute("hidden", "true");
  }
});
