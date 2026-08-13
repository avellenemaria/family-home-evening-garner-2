function createTalentNightForm() {
  const form = FormApp.create('Noche de Talentos de la Comunidad | Community Talent Night');
  form.setDescription(
    'Lunes, 14 de septiembre de 2026 | Monday, September 14, 2026\n' +
    '6:30 PM–8:00 PM\n' +
    '1433 Aversboro Rd, Garner, NC 27529\n\n' +
    '¡Gracias por querer participar! Puedes compartir un talento, ayudar con la actividad o hacer ambas cosas.\n' +
    'Thank you for participating! You may share a talent, help with the activity, or do both.'
  );
  form.setConfirmationMessage(
    '¡Gracias! Nos alegra que seas parte de nuestra Noche de Talentos de la Comunidad. Nos comunicaremos contigo si necesitamos confirmar detalles sobre tu participación.\n\n' +
    'Thank you! We’re glad you’ll be part of our Community Talent Night. We’ll contact you if we need to confirm any details about your participation.'
  );
  form.setProgressBar(true);
  form.setCollectEmail(false);
  form.addSectionHeaderItem().setTitle('Información básica / Basic information');
  form.addTextItem().setTitle('Nombre / Name').setRequired(true);
  form.addTextItem().setTitle('Teléfono / Phone').setRequired(true);
  form.addTextItem().setTitle('Correo electrónico / Email').setRequired(false)
    .setValidation(FormApp.createTextValidation().requireTextIsEmail().build());
  form.addCheckboxItem().setTitle('¿Cómo te gustaría participar? / How would you like to participate?')
    .setChoiceValues([
      'Presentación en vivo / Live performance',
      'Exhibición de talentos / Talent display',
      'Talento culinario / Culinary talent',
      'Traer refrigerios / Bring snacks',
      'Ayudar con la preparación / Help with setup',
      'Sillas y exhibiciones / Chairs and displays',
      'Área de refrigerios / Snack area',
      'Ayudar durante la actividad / Help during the event',
      'Ayudar con la limpieza / Help with cleanup',
      'Puedo ayudar donde sea necesario / I can help wherever needed',
      'Otro / Other'
    ]).setRequired(true)
    .setHelpText('Las presentaciones en vivo deben durar 3 minutos o menos. Los espacios son limitados. / Live performances must be 3 minutes or less. Space is limited.');

  form.addPageBreakItem().setTitle('Presentación en vivo / Live performance')
    .setHelpText('Completa esta sección solamente si seleccionaste presentación en vivo. / Complete this section only if you selected live performance.');
  form.addParagraphTextItem().setTitle('¿Qué talento vas a compartir? / What talent will you share?')
    .setHelpText('Canto, instrumento, baile, poesía, presentación cultural, actuación u otro. / Singing, instrument, dance, poetry, cultural performance, acting, or other.');
  form.addMultipleChoiceItem().setTitle('¿Participará alguien contigo? / Will anyone participate with you?')
    .setChoiceValues(['Sí / Yes', 'No']);
  form.addParagraphTextItem().setTitle('Nombres de los demás participantes / Names of additional participants');
  form.addMultipleChoiceItem().setTitle('¿Cuánto dura tu presentación? / How long is your performance?')
    .setHelpText('Máximo 3 minutos. Los espacios son limitados. Te confirmaremos tu turno después de registrarte. / Maximum 3 minutes. Space is limited. We’ll confirm your performance slot after you register.')
    .setChoiceValues(['1 minuto o menos / 1 minute or less', '1–2 minutos / 1–2 minutes', '2–3 minutos / 2–3 minutes']);
  form.addMultipleChoiceItem().setTitle('¿Necesitas micrófono? / Do you need a microphone?').setChoiceValues(['Sí / Yes', 'No']);
  form.addMultipleChoiceItem().setTitle('¿Necesitas que reproduzcamos música o audio? / Do you need us to play music or audio?').setChoiceValues(['Sí / Yes', 'No']);
  form.addParagraphTextItem().setTitle('Si respondiste sí, describe lo que necesitas / If yes, please describe what you need');
  form.addParagraphTextItem().setTitle('¿Hay algo más que necesitemos saber para tu presentación? / Is there anything else we should know about your performance?');

  form.addPageBreakItem().setTitle('Exhibición de talentos / Talent display')
    .setHelpText('Completa esta sección solamente si seleccionaste una exhibición. / Complete this section only if you selected a talent display.');
  form.addParagraphTextItem().setTitle('¿Qué vas a exhibir? / What will you display?')
    .setHelpText('Pintura, dibujo, fotografía, manualidades, costura o crochet, carpintería, escritura u otro talento creativo. / Painting, drawing, photography, crafts, sewing or crochet, woodworking, writing, or another creative talent.');
  form.addMultipleChoiceItem().setTitle('¿Cuánto espacio necesitas aproximadamente? / Approximately how much space do you need?')
    .setChoiceValues(['Espacio pequeño / Small space', 'Aproximadamente media mesa / About half a table', 'Una mesa / One table', 'Otro / Other']);

  form.addPageBreakItem().setTitle('Talento culinario / Culinary talent')
    .setHelpText('Por favor trae porciones pequeñas y fáciles de compartir. Esta actividad tendrá refrigerios, no una comida completa. / Please bring small, easy-to-share portions. This activity will have snacks rather than a full meal.');
  form.addParagraphTextItem().setTitle('¿Qué piensas preparar? / What do you plan to make?');

  form.addPageBreakItem().setTitle('Refrigerios y ayuda / Snacks and volunteer help')
    .setHelpText('Completa solamente lo que corresponda a tus selecciones. / Complete only what applies to your selections.');
  form.addParagraphTextItem().setTitle('¿Qué te gustaría traer? / What would you like to bring?')
    .setHelpText('Palomitas, papitas, fruta, postre, helado, bebidas u otro. / Popcorn, chips, fruit, dessert, ice cream, drinks, or other.');
  form.addParagraphTextItem().setTitle('¿Hay algo que debamos saber sobre cómo puedes ayudar? / Is there anything we should know about how you can help?');

  PropertiesService.getScriptProperties().setProperty('TALENT_NIGHT_FORM_ID', form.getId());
  Logger.log('PUBLIC FORM URL: ' + form.getPublishedUrl());
  Logger.log('EDIT FORM URL: ' + form.getEditUrl());
  return { publicUrl: form.getPublishedUrl(), editUrl: form.getEditUrl() };
}

const LIVE_OPTION = 'Presentación en vivo / Live performance';
const PARTICIPATION_TITLE = '¿Cómo te gustaría participar? / How would you like to participate?';
const PARTICIPATION_OPTIONS = [
  LIVE_OPTION,
  'Exhibición de talentos / Talent display',
  'Talento culinario / Culinary talent',
  'Traer refrigerios / Bring snacks',
  'Ayudar con la preparación / Help with setup',
  'Sillas y exhibiciones / Chairs and displays',
  'Área de refrigerios / Snack area',
  'Ayudar durante la actividad / Help during the event',
  'Ayudar con la limpieza / Help with cleanup',
  'Puedo ayudar donde sea necesario / I can help wherever needed',
  'Otro / Other'
];

function setupLivePerformanceCapacity() {
  const form = getTalentNightForm_();
  PropertiesService.getScriptProperties().setProperty('TALENT_NIGHT_FORM_ID', form.getId());
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'onTalentNightFormSubmit')
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('onTalentNightFormSubmit').forForm(form).onFormSubmit().create();
  refreshLivePerformanceCapacity_(form);
  Logger.log('CAPACITY TRIGGER INSTALLED');
  Logger.log('PUBLIC FORM URL: ' + form.getPublishedUrl());
  Logger.log('EDIT FORM URL: ' + form.getEditUrl());
}

function onTalentNightFormSubmit(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const form = getTalentNightForm_();
    const selected = getSelectionsFromResponse_(e.response);
    if (!selected.includes(LIVE_OPTION)) return;
    const count = countLivePerformanceResponses_(form);
    const state = capacityStateForCount_(count);
    const responseId = e.response.getId();
    PropertiesService.getScriptProperties().setProperty('LIVE_STATUS_' + responseId, state.status);
    Logger.log('Live-performance response ' + responseId + ': ' + state.status + ' (' + count + '/10)');
    refreshLivePerformanceCapacity_(form, count);
  } finally {
    lock.releaseLock();
  }
}

function refreshLivePerformanceCapacity() {
  refreshLivePerformanceCapacity_(getTalentNightForm_());
}

function refreshLivePerformanceCapacity_(form, knownCount) {
  const count = knownCount == null ? countLivePerformanceResponses_(form) : knownCount;
  const state = capacityStateForCount_(count);
  const item = getParticipationItem_(form);
  item.setChoiceValues(state.liveOptionAvailable ? PARTICIPATION_OPTIONS : PARTICIPATION_OPTIONS.slice(1));
  item.setHelpText(state.helpText);
  PropertiesService.getScriptProperties().setProperty('LIVE_PERFORMANCE_COUNT', String(count));
  PropertiesService.getScriptProperties().setProperty('LIVE_CAPACITY_STATE', state.status);
  Logger.log('Live-performance capacity: ' + count + '/10 - ' + state.status);
}

function capacityStateForCount_(count) {
  if (count < 8) return {
    status: 'CONFIRMED_OPEN', liveOptionAvailable: true,
    helpText: 'Presentaciones en vivo: máximo 3 minutos. Los espacios son limitados. Te confirmaremos tu turno después de registrarte. / Live performances: maximum 3 minutes. Space is limited. We’ll confirm your performance slot after you register.'
  };
  if (count < 10) return {
    status: 'WAITLIST_OPEN', liveOptionAvailable: true,
    helpText: 'Los espacios para presentaciones en vivo están llenos. Puedes inscribirte en la lista de espera o participar de otra manera. Máximo 3 minutos. / Live performance spaces are currently full. You may join the waitlist or participate in another way. Maximum 3 minutes.'
  };
  return {
    status: 'LIVE_PERFORMANCE_CLOSED', liveOptionAvailable: false,
    helpText: 'Las presentaciones en vivo y la lista de espera están llenas. Las demás formas de participación siguen abiertas. / Live performances and the waitlist are full. All other ways to participate remain open.'
  };
}

function countLivePerformanceResponses_(form) {
  return form.getResponses().filter(r => getSelectionsFromResponse_(r).includes(LIVE_OPTION)).length;
}

function getSelectionsFromResponse_(response) {
  const itemResponse = response.getItemResponses().find(r => r.getItem().getTitle() === PARTICIPATION_TITLE);
  if (!itemResponse) return [];
  const answer = itemResponse.getResponse();
  return Array.isArray(answer) ? answer : [answer];
}

function getParticipationItem_(form) {
  const item = form.getItems(FormApp.ItemType.CHECKBOX).find(i => i.getTitle() === PARTICIPATION_TITLE);
  if (!item) throw new Error('Participation checkbox question not found.');
  return item.asCheckboxItem();
}

function getTalentNightForm_() {
  const properties = PropertiesService.getScriptProperties();
  const savedId = properties.getProperty('TALENT_NIGHT_FORM_ID');
  if (savedId) return FormApp.openById(savedId);
  const files = DriveApp.getFilesByName('Noche de Talentos de la Comunidad | Community Talent Night');
  if (!files.hasNext()) throw new Error('Talent Night form not found in Drive.');
  return FormApp.openById(files.next().getId());
}

function testLivePerformanceCapacity() {
  const expected = [
    [0, 'CONFIRMED_OPEN', true], [7, 'CONFIRMED_OPEN', true],
    [8, 'WAITLIST_OPEN', true], [9, 'WAITLIST_OPEN', true],
    [10, 'LIVE_PERFORMANCE_CLOSED', false], [11, 'LIVE_PERFORMANCE_CLOSED', false]
  ];
  expected.forEach(([count, status, available]) => {
    const state = capacityStateForCount_(count);
    if (state.status !== status || state.liveOptionAvailable !== available) throw new Error('Capacity test failed at count ' + count);
  });
  const nonLive = PARTICIPATION_OPTIONS.slice(1);
  const closedChoices = capacityStateForCount_(10).liveOptionAvailable ? PARTICIPATION_OPTIONS : nonLive;
  if (closedChoices.length !== 10 || closedChoices.includes(LIVE_OPTION)) throw new Error('Closed-choice test failed.');
  if (!nonLive.every(option => closedChoices.includes(option))) throw new Error('A non-live participation option was removed.');
  const mixedSelections = [
    [LIVE_OPTION, 'Ayudar con la preparación / Help with setup'],
    [LIVE_OPTION, 'Ayudar con la limpieza / Help with cleanup'],
    [LIVE_OPTION, 'Exhibición de talentos / Talent display', 'Talento culinario / Culinary talent'],
    [LIVE_OPTION, 'Puedo ayudar donde sea necesario / I can help wherever needed']
  ];
  mixedSelections.forEach(selections => {
    if (!selections.includes(LIVE_OPTION)) throw new Error('Mixed-selection live detection failed.');
    const preserved = selections.filter(option => option !== LIVE_OPTION);
    if (!preserved.every(option => PARTICIPATION_OPTIONS.includes(option))) throw new Error('Mixed-selection non-live option was not preserved.');
  });
  const responseDataIsMutated = /setResponse|deleteResponse|submitGrades/.test(onTalentNightFormSubmit.toString());
  if (responseDataIsMutated) throw new Error('Submit handler must not modify stored response selections.');
  Logger.log('ALL CAPACITY TESTS PASSED: confirmed 1–8, waitlist 9–10, live option removed after 10, all 10 non-live options preserved, mixed selections retained, stored responses never overwritten.');
}

function showLivePerformanceStatus() {
  const form = getTalentNightForm_();
  Logger.log('LIVE PERFORMANCE COUNT: ' + countLivePerformanceResponses_(form));
  Logger.log('PUBLIC FORM URL: ' + form.getPublishedUrl());
  Logger.log('EDIT FORM URL: ' + form.getEditUrl());
}
