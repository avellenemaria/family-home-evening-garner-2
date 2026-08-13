(() => {
  const config = window.EVENT_CONFIG || {};
  const formUrl = config.GOOGLE_FORM_URL?.trim();
  const validForm = formUrl && /^https:\/\/(docs\.google\.com\/forms|forms\.gle)\//.test(formUrl);
  document.querySelectorAll("[data-form-link]").forEach((link) => {
    if (!validForm) return;
    link.href = formUrl;
    link.target = "_blank";
    link.rel = "noreferrer";
  });
  if (validForm) document.querySelector("[data-form-status]").textContent = "Inscripción abierta · Sign-up is open";

  const heroUrl = config.HERO_MEDIA_URL?.trim();
  const hero = document.querySelector("[data-hero-media]");
  if (heroUrl) {
    const isVideo = /\.(mp4|webm)(\?.*)?$/i.test(heroUrl);
    hero.replaceChildren(Object.assign(document.createElement(isVideo ? "video" : "img"), isVideo
      ? { src: heroUrl, muted: true, autoplay: true, loop: true, playsInline: true }
      : { src: heroUrl, alt: "Personas disfrutando una noche de talentos de la comunidad" }));
  }

  const images = Array.isArray(config.GALLERY_IMAGES) ? config.GALLERY_IMAGES.slice(0, 6) : [];
  if (images.length) {
    const gallery = document.querySelector("[data-gallery]");
    gallery.replaceChildren(...images.map((src, index) => Object.assign(document.createElement("img"), {
      src, loading: "lazy", decoding: "async", alt: `Momento de la noche de talentos de la comunidad ${index + 1}`,
    })));
    gallery.firstElementChild?.classList.add("wide");
  }
})();
