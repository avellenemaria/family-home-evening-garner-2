const NATIVE_SHEET_TITLE = 'Community Talent Night Registrations 2026';
const NATIVE_SHEET_NAME = 'Registrations';
const NATIVE_LIVE_LIMIT = 10;
const NATIVE_CONFIRMED_LIMIT = 8;
const NATIVE_ALLOWED = ['live','display','culinary','snacks','setup','during','cleanup','wherever','other'];
const NATIVE_HEADERS = ['Timestamp','Registration ID','Name','Phone','Email','Participation','Performance Status','Live Talent','Group Participation','Additional Participants','Duration','Microphone','Music/Audio','Setup Needs','Display Talent','Display Space','Culinary Item','Snack Item','Volunteer Note','Other Participation','Source'];

function setupNativeRegistrationBackend() {
  const sheet = getNativeRegistrationSheet_();
  Logger.log('REGISTRATION SHEET: ' + sheet.getParent().getUrl());
  Logger.log('LIVE COUNT: ' + nativeLiveCount_(sheet));
}

function doGet(e) {
  const params = (e && e.parameter) || {};
  let payload;
  if (params.action === 'result') {
    const cached = CacheService.getScriptCache().get('RESULT_' + String(params.clientId || ''));
    payload = cached ? JSON.parse(cached) : {pending:true};
  } else {
    const sheet = getNativeRegistrationSheet_();
    payload = nativeCapacityPayload_(nativeLiveCount_(sheet));
  }
  const callback = String((e && e.parameter && e.parameter.callback) || 'talentNightCapacity').replace(/[^a-zA-Z0-9_$\.]/g, '');
  return ContentService.createTextOutput(callback + '(' + JSON.stringify(payload) + ');').setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const result = nativeSubmit_((e && e.parameter) || {}, (e && e.parameters) || {});
    const clientId = String((e && e.parameter && e.parameter.clientId) || '').replace(/[^a-zA-Z0-9-]/g, '');
    if (clientId) CacheService.getScriptCache().put('RESULT_' + clientId, JSON.stringify(result), 600);
    return nativePostMessage_(result);
  } catch (error) {
    return nativePostMessage_({ok:false, code:'SERVER_ERROR', message:'No pudimos guardar la inscripción. Inténtalo de nuevo. / We could not save the registration. Please try again.'});
  } finally {
    lock.releaseLock();
  }
}

function nativeSubmit_(params, parameterLists, sheetOverride) {
  if (String(params.website || '')) return {ok:true, performanceStatus:'NONE'};
  const name = String(params.name || '').trim();
  const phone = String(params.phone || '').trim();
  const email = String(params.email || '').trim();
  const participation = [...new Set((parameterLists.participation || (params.participation ? [params.participation] : [])).map(String))].filter(v => NATIVE_ALLOWED.includes(v));
  if (!name || !phone || !participation.length || String(params.accuracy || '') !== 'yes') return {ok:false, code:'VALIDATION', message:'Completa el nombre, teléfono y al menos una forma de participar. / Complete your name, phone, and at least one participation choice.'};
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return {ok:false, code:'VALIDATION', message:'Revisa el correo electrónico. / Check the email address.'};
  if (participation.includes('live') && (!String(params.liveTalent || '').trim() || !String(params.liveDuration || '').trim())) return {ok:false, code:'VALIDATION', message:'Completa el talento y la duración de la presentación. / Complete the performance talent and duration.'};
  const sheet = sheetOverride || getNativeRegistrationSheet_();
  const liveBefore = nativeLiveCount_(sheet);
  if (participation.includes('live') && liveBefore >= NATIVE_LIVE_LIMIT) return {ok:false, code:'LIVE_FULL', message:'Las presentaciones y la lista de espera están llenas. Quita “Presentación en vivo” para inscribirte de otra manera. / Performances and the waitlist are full. Remove “Live performance” to register another way.'};
  const performanceStatus = !participation.includes('live') ? 'NONE' : liveBefore < NATIVE_CONFIRMED_LIMIT ? 'CONFIRMED' : 'WAITLIST';
  const registrationId = Utilities.getUuid();
  sheet.appendRow([new Date(),registrationId,name,phone,email,participation.join(', '),performanceStatus,String(params.liveTalent||''),String(params.liveGroup||''),String(params.liveGroupNames||''),String(params.liveDuration||''),String(params.microphone||''),String(params.audio||''),String(params.liveSetup||''),String(params.displayTalent||''),String(params.displaySpace||''),String(params.culinaryItem||''),String(params.snackItem||''),String(params.volunteerNote||''),String(params.otherParticipation||''),String(params.source||'website')]);
  SpreadsheetApp.flush();
  return {ok:true, registrationId:registrationId, performanceStatus:performanceStatus, liveCount:liveBefore + (participation.includes('live') ? 1 : 0)};
}

function nativeCapacityPayload_(count) { return {ok:true, liveCount:count, liveAvailable:count < 10, waitlist:count >= 8 && count < 10}; }
function nativeLiveCount_(sheet) { if (sheet.getLastRow() < 2) return 0; return sheet.getRange(2,6,sheet.getLastRow()-1,2).getValues().filter(r => String(r[0]).split(', ').includes('live') && (r[1] === 'CONFIRMED' || r[1] === 'WAITLIST')).length; }
function getNativeRegistrationSheet_() { const props=PropertiesService.getScriptProperties(); let id=props.getProperty('NATIVE_REGISTRATION_SHEET_ID'); let book; if(id){try{book=SpreadsheetApp.openById(id);}catch(error){id='';}} if(!id){book=SpreadsheetApp.create(NATIVE_SHEET_TITLE); props.setProperty('NATIVE_REGISTRATION_SHEET_ID',book.getId());} let sheet=book.getSheetByName(NATIVE_SHEET_NAME); if(!sheet){sheet=book.getSheets()[0]; sheet.setName(NATIVE_SHEET_NAME);} if(sheet.getLastRow()===0){sheet.appendRow(NATIVE_HEADERS); sheet.setFrozenRows(1); sheet.getRange(1,1,1,NATIVE_HEADERS.length).setFontWeight('bold').setBackground('#1f6f65').setFontColor('#ffffff');} return sheet; }
function nativePostMessage_(payload) { payload.source='talent-night-registration'; const safe=JSON.stringify(payload).replace(/</g,'\\u003c'); return HtmlService.createHtmlOutput('<!doctype html><meta charset="utf-8"><script>top.postMessage('+safe+',"*");<\/script>'); }

function testNativeRegistrationBackend() {
  const book=SpreadsheetApp.create('TEMP Talent Night Backend Test'); const sheet=book.getSheets()[0]; sheet.setName(NATIVE_SHEET_NAME); sheet.appendRow(NATIVE_HEADERS);
  const base={name:'TEST Participant',phone:'555-0100',accuracy:'yes',source:'automated-test'};
  const volunteer=nativeSubmit_(base,{participation:['cleanup']},sheet); if(!volunteer.ok||volunteer.performanceStatus!=='NONE') throw new Error('Volunteer-only test failed');
  for(let i=1;i<=10;i++){const p=Object.assign({},base,{name:'TEST Live '+i,liveTalent:'Test performance',liveDuration:'1 minute'}); const selections=i===1?['live','cleanup']:['live']; const result=nativeSubmit_(p,{participation:selections},sheet); const expected=i<=8?'CONFIRMED':'WAITLIST'; if(!result.ok||result.performanceStatus!==expected) throw new Error('Capacity test failed at '+i); if(i===1&&!sheet.getRange(sheet.getLastRow(),6).getValue().includes('cleanup')) throw new Error('Mixed selection was not preserved');}
  const blocked=nativeSubmit_(Object.assign({},base,{liveTalent:'Blocked',liveDuration:'1 minute'}),{participation:['live']},sheet); if(blocked.ok||blocked.code!=='LIVE_FULL') throw new Error('Closure test failed');
  const afterClose=nativeSubmit_(Object.assign({},base,{name:'TEST Non-live after close'}),{participation:['display','setup']},sheet); if(!afterClose.ok) throw new Error('Non-live registration after closure failed');
  Logger.log('ALL NATIVE BACKEND TESTS PASSED'); Logger.log('TEST SHEET: '+book.getUrl());
}

function showNativeRegistrationStatus() { const sheet=getNativeRegistrationSheet_(); Logger.log('REGISTRATION SHEET: '+sheet.getParent().getUrl()); Logger.log(JSON.stringify(nativeCapacityPayload_(nativeLiveCount_(sheet)))); }

function cleanupNativeEndToEndTests() {
  const sheet = getNativeRegistrationSheet_();
  let removed = 0;
  for (let row = sheet.getLastRow(); row >= 2; row--) {
    if (String(sheet.getRange(row, 3).getValue()).startsWith('WEB TEST')) {
      sheet.deleteRow(row);
      removed++;
    }
  }
  Logger.log('REMOVED WEB TEST ROWS: ' + removed);
  Logger.log('LIVE COUNT AFTER CLEANUP: ' + nativeLiveCount_(sheet));
}
