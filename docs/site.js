(() => {
  const formUrl = window.EVENT_CONFIG?.GOOGLE_FORM_URL?.trim();
  const link = document.querySelector("[data-form-link]");
  const status = document.querySelector("[data-form-status]");

  if (formUrl && /^https:\/\/(docs\.google\.com\/forms|forms\.gle)\//.test(formUrl)) {
    link.href = formUrl;
    link.target = "_blank";
    link.rel = "noreferrer";
    status.textContent = "Performer sign-up is open · La inscripción está abierta";
  }
})();
