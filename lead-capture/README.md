# Enquiry capture — setup

Ten minutes, once. After this every enquiry lands in a Google Sheet you own,
and the form stops claiming success when nothing was sent.

## 1. Make the sheet

1. Go to [sheets.new](https://sheets.new) and name it something like
   `AKASA Enquiries`.
2. **Extensions → Apps Script.** A script editor opens in a new tab.
3. Delete the placeholder `function myFunction() {}`.
4. Paste in the whole of [`Code.gs`](./Code.gs).
5. Optional: to get an email on every enquiry, set `NOTIFY_EMAIL` near the top
   to your address. Leave it as `''` to skip.
6. Save (⌘S).

### If Drive says "Sorry, unable to open the file at present"

Nothing is wrong with your sheet. This is almost always a multi-account
collision: Drive opens Apps Script under your default account (`/u/0/`) while
the sheet belongs to a different one.

Try, in order:

1. Open an **incognito window**, sign into only the account that owns the
   sheet, open the sheet, then Extensions → Apps Script.
2. In the failing URL, change `/u/0/` to `/u/1/` (or `/u/2/`) and reload.
3. Sign out of every Google account except the owner.
4. Disable ad blockers / allow third-party cookies for `script.google.com`.

**Or skip the bound editor entirely.** This works regardless:

1. Go to [script.new](https://script.new) — a standalone project, no Drive
   file to open.
2. Paste `Code.gs` in as before.
3. Open your sheet and copy its ID from the URL — the long string between
   `/d/` and `/edit`.
4. Set `SPREADSHEET_ID` near the top of the script to that ID.
5. Continue from step 2 below. Everything else is identical.

The only difference is that a standalone script needs to be told which sheet
to write to; a bound one already knows.

## 2. Deploy it

1. **Deploy → New deployment.**
2. Click the gear next to "Select type" and choose **Web app**.
   This is the step people miss. The gear is small, and the dialog defaults to
   **Library**, which has no HTTP endpoint — deploy as a Library and every
   request comes back `401 Unauthorized`. If the URL you end up with contains
   `/library/`, you picked the wrong type. A correct one looks like
   `https://script.google.com/macros/s/AKfy…/exec`.
3. Set:
   - **Execute as:** Me
   - **Who has access:** **Anyone** ← this matters. "Anyone with Google account"
     will silently reject visitors who aren't signed in.
4. **Deploy.** Google asks you to authorise — it will warn the app is
   unverified. That's expected for your own script: **Advanced → Go to
   (unsafe)**.
5. Copy the **Web app URL**. It ends in `/exec`.

Paste that URL into a browser. You should see
`{"ok":true,"service":"akasa-lead-capture"}`.

- A **sign-in page** means access isn't "Anyone" — revisit step 3.
- A **401** in the browser console when the site posts means the same thing, or
  that the deployment is a Library rather than a Web app.
- Anything else means the deployment type is wrong; redo step 2.

## 3. Point the site at it

Already done — the live `/exec` URL is committed as `site.leadEndpoint` in
`src/data/site.js`. Nothing to configure in Vercel.

That's a deliberate choice. Vite inlines `VITE_*` variables into the public JS
bundle at build time, so the URL ends up readable in the shipped source either
way; treating it as a secret bought nothing and added a step that, if
forgotten, would silently drop every lead.

To replace it later (new sheet, new deployment), edit that one line. To point
a local build at a *different* sheet without touching the committed default,
put `VITE_LEAD_ENDPOINT=…` in `.env.local` — it wins when set.

## 4. Check it end to end

Submit the form on the live site with your own details. A row should appear in
the sheet within a second or two. If it doesn't, open the browser console —
the form logs the failure reason.

## If the variable isn't set

The form still works: it falls back to WhatsApp only, and the success message
changes to say the enquiry wasn't recorded and to use WhatsApp or phone. It
won't claim a lead was saved when it wasn't.

## Re-deploying after script edits

Apps Script pins each deployment to a code version. If you edit `Code.gs`, go
**Deploy → Manage deployments → edit (pencil) → Version: New version →
Deploy**. The `/exec` URL stays the same.

## Notes

- The browser sends `text/plain` on purpose. It keeps the POST a CORS "simple
  request", and Apps Script can't answer the preflight that
  `application/json` would trigger.
- Writes are serialised behind `LockService`, so two enquiries in the same
  second can't overwrite one another.
- Free Gmail accounts can send ~100 notification emails a day, which is far
  above the expected volume here.
