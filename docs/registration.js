(() => {
  const config = window.EVENT_CONFIG || {};
  const form = document.querySelector("[data-registration-form]");
  const endpoint = (config.REGISTRATION_API_URL || "").trim();
  const alertBox = document.querySelector("[data-form-alert]");
  const capacityBanner = document.querySelector("[data-capacity-banner]");
  const liveChoice = form.querySelector('input[value="live"]');
  const volunteerValues = new Set(["setup", "during", "cleanup", "wherever"]);
  let submitting = false;
  let resultPolls = 0;

  const setSection = (name, show) => {
    const section = form.querySelector(`[data-section="${name}"]`);
    if (!section) return;
    section.hidden = !show;
    section.querySelectorAll("input, textarea, select").forEach((field) => {
      if (field.dataset.requiredWhenVisible === "true") field.required = show;
    });
  };

  const updateSections = () => {
    const selected = new Set([...form.querySelectorAll('input[name="participation"]:checked')].map((input) => input.value));
    ["live", "display", "culinary", "snacks", "other"].forEach((name) => setSection(name, selected.has(name)));
    setSection("volunteer", [...selected].some((value) => volunteerValues.has(value)));
  };

  form.querySelectorAll('input[name="participation"]').forEach((input) => input.addEventListener("change", updateSections));
  form.querySelectorAll('input[name="liveGroup"]').forEach((input) => input.addEventListener("change", () => {
    document.querySelector("[data-group-names]").hidden = input.value !== "yes";
  }));

  window.talentNightCapacity = (data) => {
    const count = Number(data.liveCount || 0);
    capacityBanner.hidden = false;
    if (count >= 10) {
      liveChoice.checked = false;
      liveChoice.disabled = true;
      liveChoice.closest(".choice").classList.add("unavailable");
      capacityBanner.className = "capacity-banner closed";
      capacityBanner.innerHTML = "Las presentaciones en vivo y la lista de espera están llenas. Las demás opciones siguen abiertas.<span lang='en'>Live performances and the waitlist are full. All other options remain open.</span>";
      updateSections();
    } else if (count >= 8) {
      capacityBanner.className = "capacity-banner waitlist";
      capacityBanner.innerHTML = "Los espacios para presentaciones están llenos. Quedan espacios en la lista de espera.<span lang='en'>Performance spaces are full. Waitlist registration is available.</span>";
    } else {
      capacityBanner.className = "capacity-banner";
      capacityBanner.innerHTML = `${8 - count} espacios para presentaciones en vivo disponibles.<span lang='en'>${8 - count} confirmed live-performance spaces available.</span>`;
    }
  };

  if (endpoint) {
    form.action = endpoint;
    const statusScript = document.createElement("script");
    statusScript.src = `${endpoint}?action=status&callback=talentNightCapacity&t=${Date.now()}`;
    statusScript.onerror = () => { capacityBanner.hidden = true; };
    document.head.append(statusScript);
  } else {
    alertBox.hidden = false;
    alertBox.textContent = "La inscripción se está conectando. Inténtalo de nuevo pronto. / Registration is being connected. Please try again soon.";
  }

  const finishSubmission = (data) => {
    if (!submitting || data.pending) return;
    submitting = false;
    form.querySelector("button[type=submit]").disabled = false;
    if (!data.ok) {
      alertBox.hidden = false;
      alertBox.textContent = data.message || "No pudimos enviar la inscripción. Revisa tus respuestas e inténtalo de nuevo. / We could not submit your registration. Please review and try again.";
      alertBox.scrollIntoView({ behavior: "smooth", block: "center" });
      if (data.code === "LIVE_FULL") window.talentNightCapacity({ liveCount: 10 });
      return;
    }
    form.hidden = true;
    document.querySelector(".form-intro").hidden = true;
    capacityBanner.hidden = true;
    const success = document.querySelector("[data-success]");
    const performance = document.querySelector("[data-performance-result]");
    if (data.performanceStatus === "CONFIRMED") {
      performance.hidden = false;
      performance.innerHTML = "Tu solicitud de presentación fue recibida dentro de los espacios confirmados.<span lang='en'>Your performance request was received within the confirmed spaces.</span>";
    } else if (data.performanceStatus === "WAITLIST") {
      performance.hidden = false;
      performance.innerHTML = "Tu solicitud de presentación está en la lista de espera. Nos comunicaremos contigo si se abre un espacio.<span lang='en'>Your performance request is on the waitlist. We’ll contact you if a space opens.</span>";
    }
    success.hidden = false;
    success.focus();
    success.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  window.talentNightResult = finishSubmission;

  const pollResult = () => {
    if (!submitting) return;
    if (resultPolls++ > 20) {
      finishSubmission({ ok: false, message: "La inscripción tardó demasiado en responder. Inténtalo de nuevo. / Registration took too long to respond. Please try again." });
      return;
    }
    const script = document.createElement("script");
    script.src = `${endpoint}?action=result&callback=talentNightResult&clientId=${encodeURIComponent(form.elements.clientId.value)}&t=${Date.now()}`;
    script.onload = () => setTimeout(pollResult, 700);
    script.onerror = () => setTimeout(pollResult, 1000);
    document.head.append(script);
  };

  form.addEventListener("submit", (event) => {
    alertBox.hidden = true;
    const choices = form.querySelectorAll('input[name="participation"]:checked');
    if (!endpoint || !choices.length || !form.checkValidity()) {
      event.preventDefault();
      if (!choices.length) alertBox.textContent = "Selecciona al menos una forma de participar. / Select at least one way to participate.";
      else if (!endpoint) alertBox.textContent = "La inscripción todavía no está conectada. / Registration is not connected yet.";
      else alertBox.textContent = "Completa los campos requeridos. / Complete the required fields.";
      alertBox.hidden = false;
      form.reportValidity();
      alertBox.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    submitting = true;
    resultPolls = 0;
    form.elements.clientId.value = (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`).replace(/[^a-zA-Z0-9-]/g, "");
    form.querySelector("button[type=submit]").disabled = true;
    setTimeout(pollResult, 900);
  });
})();
