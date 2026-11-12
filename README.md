# Wesley Agojo: portfolio

A side-scrolling portfolio. You ride a jeepney from UMass Lowell into a Calamba barangay, browse the storefronts for my resume and projects, play pepper with Han, and shoot around on the court.

## Updating the site

**Almost everything you'd update lives in `content.json`.** Edit it on GitHub (open the file and click the pencil icon), commit, and the site redeploys in about a minute.

| To change… | Edit this in `content.json` |
|---|---|
| Name, tagline or subline on the title screen | `name`, `tagline`, `subline` |
| School, degree, dates, GPA | `education` |
| A job or research position | an item in `experience` (industry & research) or `work` (professional), newest first |
| Skills | `skills`, one row per group |
| Certifications, honors & awards | `certifications`, `awards` |
| Leadership (the SK Youth Center door) | `leadership`, plus one-liners in `leadershipOther` |
| Projects | `projects`. Add `"link": "https://…"` to show a "See it" button |
| About text and the "hats" chips | `about` |
| Email, LinkedIn, GitHub, location line | `contact` |

To add a job, copy an existing `{ … }` block in `work`, paste it where you want it, and put a comma between blocks. `"bullets": []` is fine for a role with no bullets yet.

**If your change doesn't show up,** the file probably has a typo (a missing comma or quote). Paste it into [jsonlint.com](https://jsonlint.com) to find the line. While the file is broken, the site falls back to the text that's built into the pages, so it never goes blank.

## Files

| File | What it is |
|---|---|
| `index.html` | The shell. It holds the three scenes and plays the transitions between them (jeepney ride, "Heads up!") |
| `title.html` | Title screen: UMass Lowell, the grenade, the jeepney ride |
| `hub3d.html` | The 3D barangay street (Three.js, loaded from a CDN). This is the street visitors see by default. It reads the same `content.json` |
| `court3d.html` | The 3D basketball court: shot meter, real ball physics, HORSE with Tito Randy. Physics lives in `court-physics.js` |
| `court-physics.js` | The ball, rim and backboard physics for the 3D court |
| `hub.html` | The original flat 2D street. In 3D mode it also supplies the mini-games (fishball, blackjack, pool, pepper), which open as overlays via `hub.html?game=food|cards|pool|pepper` |
| `court.html` | The original flat 2D court |
| `content.json` | Your resume, projects, about and contact text |
| `content.js` | Reads `content.json` and fills in the panels |
| `Wesley_Agojo_Resume.pdf` | The resume behind the Download button. Replace this file (same name) to update it |

Deep links work: `/#hub` opens the street, and `/#court` opens the court. The site is 3D by default; add `?2d` (`/?2d`) to play the original flat version. The 3D scenes need WebGL and an internet connection for the Three.js library.

## Hosting

The site is plain static files with no build step. Connect this repo to Cloudflare Pages, Netlify or Vercel, set the build command to empty and the output directory to `/` (the repo root), and every push to `main` deploys.

Opening `index.html` straight from your computer (`file://`) won't load `content.json`. To preview locally, run `python3 -m http.server` in this folder and visit http://localhost:8000.
