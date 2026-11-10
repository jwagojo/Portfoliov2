# R.J. Portacion: portfolio

A side-scrolling portfolio. You ride a jeepney from UMass Lowell into a Taguig barangay, browse the storefronts for my resume and projects, play pepper with Han, and shoot around on the court.

## Updating the site

**Almost everything you'd update lives in `content.json`.** Edit it on GitHub (open the file and click the pencil icon), commit, and the site redeploys in about a minute.

| To change… | Edit this in `content.json` |
|---|---|
| Name, tagline or subline on the title screen | `name`, `tagline`, `subline` |
| School, degree, dates, GPA | `education` |
| A job or research position | an item in `experience` (put the newest first) |
| Skills | `skills`, one row per group |
| Projects | `projects`. Add `"link": "https://…"` to show a "See it" button |
| About text and the "hats" chips | `about` |
| Email, LinkedIn, location line | `contact` |

To add a job, copy an existing `{ … }` block in `experience`, paste it where you want it, and put a comma between blocks. `"bullets": []` is fine for a role with no bullets yet.

**If your change doesn't show up,** the file probably has a typo (a missing comma or quote). Paste it into [jsonlint.com](https://jsonlint.com) to find the line. While the file is broken, the site falls back to the text that's built into the pages, so it never goes blank.

## Files

| File | What it is |
|---|---|
| `index.html` | The shell. It holds the three scenes and fades between them |
| `title.html` | Title screen: UMass Lowell, the grenade, the jeepney ride |
| `hub.html` | The barangay street: storefronts, the family, the volleyball corner |
| `court.html` | The basketball court |
| `content.json` | Your resume, projects, about and contact text |
| `content.js` | Reads `content.json` and fills in the panels |

Deep links work: `/#hub` opens the street, and `/#court` opens the court.

## Hosting

The site is plain static files with no build step. Connect this repo to Cloudflare Pages, Netlify or Vercel, set the build command to empty and the output directory to `/` (the repo root), and every push to `main` deploys.

Opening `index.html` straight from your computer (`file://`) won't load `content.json`. To preview locally, run `python3 -m http.server` in this folder and visit http://localhost:8000.
