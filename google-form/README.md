# Create the Google Form

1. Open [script.google.com](https://script.google.com), create a project, and paste `create_talent_night_form.gs`.
2. Run `createTalentNightForm`, approve access, then copy the **PUBLIC FORM URL** and **EDIT FORM URL** from the execution log.
3. Put the public URL in `docs/config.js` as `GOOGLE_FORM_URL` and push the change.

Google Forms cannot branch from a “select all that apply” checkbox question, so the generated form labels each optional section clearly and asks respondents to complete only the sections they selected.
