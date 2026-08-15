(() => {
  const config = window.EVENT_CONFIG || {};
  const formUrl = config.REGISTRATION_URL?.trim() || "register.html";
  const validForm = /^(https?:\/\/|register\.html|\.\/register\.html)/.test(formUrl);
  document.querySelectorAll("[data-form-link]").forEach((link) => {
    if (!validForm) return;
    link.href = formUrl;
    link.removeAttribute("target");
    link.removeAttribute("rel");
  });
  if (validForm) document.querySelector("[data-form-status]").textContent = "Inscripción abierta · Sign-up is open";

  const heroUrl = config.HERO_MEDIA_URL?.trim();
  const hero = document.querySelector("[data-hero-media]");
  if (heroUrl) {
    const isVideo = /\.(mp4|webm)(\?.*)?$/i.test(heroUrl);
    hero.replaceChildren(Object.assign(document.createElement(isVideo ? "video" : "img"), isVideo
      ? { src: heroUrl, muted: true, autoplay: true, loop: true, playsInline: true }
      : { src: heroUrl, alt: config.HERO_MEDIA_ALT || "Personas disfrutando una noche de talentos de la comunidad" }));
  }

  const images = Array.isArray(config.GALLERY_IMAGES) ? config.GALLERY_IMAGES.slice(0, 6) : [];
  if (images.length) {
    const gallery = document.querySelector("[data-gallery]");
    gallery.replaceChildren(...images.map((image, index) => Object.assign(document.createElement("img"), {
      src: typeof image === "string" ? image : image.src, loading: "lazy", decoding: "async", alt: typeof image === "string" ? `Momento de la noche de talentos de la comunidad ${index + 1}` : image.alt,
    })));
    gallery.firstElementChild?.classList.add("wide");
  }
  const montage = document.querySelector("[data-montage]");
  if (config.MONTAGE_URL?.trim()) {
    montage.src = config.MONTAGE_URL;
    montage.closest("[data-video-block]").hidden = false;
  }
})();
