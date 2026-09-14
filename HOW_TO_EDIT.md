# How to edit your portfolio

Your website is a single page. It uses plain HTML, CSS, and JavaScript, with no installation or build step.

## Open the website

Double-click `index.html` to open it in your browser. Keep it beside `content.js`, `script.js`, `styles.css`, and the `assets` folder. After an edit, save the file and refresh the browser.

If the page does not refresh, use Command + Shift + R on Mac or Control + Shift + R on Windows.

## Edit your text in one place

Open **content.js** in a plain-text editor. On a Mac, TextEdit works: choose **Format → Make Plain Text**, and turn off **Edit → Substitutions → Smart Quotes**. Keep the filename `content.js`; do not save it as `.txt` or rich text.

The file has numbered, commented sections:

| Section | What you can edit |
| --- | --- |
| 01 | Browser title, description, language, email, LinkedIn, resume path |
| 02 | Navigation labels and links |
| 03 | Hero heading, introduction, and button labels |
| 04 | Experience dates, categories, titles, institutions, and descriptions |
| 05 | Project categories, titles, key lines, descriptions, methods, and links |
| 06 | All four skills lists |
| 07 | Credential providers, names, statuses, and verification links |
| 08 | About text and the list of photos to show |
| 09 | Contact heading, link labels, and footer |
| 10 | Every image path, description, placeholder label, and crop setting |
| 11 | Small interface labels and accessibility text |

Normally, change only the text **inside double quotation marks**. Keep the commas, brackets, and property names.

For example, you can edit:

```js
heading: "Selected Work",
```

Apostrophes are fine inside double quotes. To include double quotes within your text, put a backslash before them:

```js
description: "A project about \"everyday decisions\".",
```

Use straight quotes (`"`), not curly quotes. To keep a field empty, use `""`. Do not put an actual line break inside a quoted sentence; use `\n` if necessary. The hero's first two headline lines are separate items, and its final line is styled in italic blue automatically.

## Add email and LinkedIn

At the top of `content.js`, find:

```js
links: {
  email: "",
  linkedin: "",
  resume: ""
},
```

Put your email address between the empty quotes after `email`. Put your full LinkedIn profile URL, starting with `https://`, between the quotes after `linkedin`. These links stay disabled until you add real values. Your email becomes a clickable email link automatically.

## Add your images

Place your own images in `assets` using these exact filenames:

| Filename | Where it appears |
| --- | --- |
| `portrait.jpg` | Hero portrait |
| `fero-casa.jpg` | FERO CASA project |
| `cross-national.png` | Cross-national research project |
| `social-listening.png` | Social Listening project |
| `about-01.jpg` | Large About photo |
| `about-02.jpg` | About photo 2 |
| `about-03.jpg` | About photo 3 |
| `about-04.jpg` | About photo 4 |
| `about-05.jpg` | Optional About photo 5 |

The page intentionally starts with neutral placeholders. Missing or unreadable images keep those placeholders; broken-image icons are hidden. Adding a correctly named file replaces its placeholder on the next refresh. No stock or generated personal photographs are included.

You can also change an image's `src` path in section 10. Filenames and extensions must match exactly, including capital letters. Renaming a PNG to `.jpg` does not convert it; keep its real extension and update the path if needed.

Update each image's `alt` text to describe the photograph or chart you actually add. This text helps visitors who use screen readers. It is not a visible caption.

Photos use `fit: "cover"` to fill their frames. Research visuals use `fit: "contain"` to keep the whole chart and key numbers visible until the final images are supplied. To use a tighter crop, change `fit` to `"cover"`; always check that labels, country variation, platform distinctions, and numbers remain readable.

Change `position: "center"` to `"center top"` to favor the top of an image, or use `"50% 35%"` for a more precise crop. Images keep their original colors.

To use only four About photos, change section 08 to:

```js
photos: ["about01", "about02", "about03", "about04"]
```

The gallery adapts to four or five photos automatically.

## Replace the resume

Add your final resume as **assets/resume.pdf**, keeping that filename. Then change `links.resume` in `content.js` from `""` to `"assets/resume.pdf"`. All resume links update together. The hero link downloads the PDF; the navigation and contact links open it in a new tab.

If you prefer a different filename or an online PDF URL, change `links.resume` once in section 01. Browser settings may open downloads instead of saving them, particularly for an external URL.

## Update credentials honestly

All seven credentials start as `"PLANNED"`, as you requested. Each credential has a provider, exact name, status, and URL.

Use one of these three status values:

| Value | What visitors see |
| --- | --- |
| `"PLANNED"` | A PLANNED badge and a disabled link |
| `"IN PREPARATION"` | An IN PREPARATION badge and a disabled link |
| `"COMPLETED"` | No unfinished-status badge; the link activates if a real URL is present |

After completing a credential, change its status to `"COMPLETED"` and paste your actual certificate or verification URL into its `url` field. It will open in a new tab. A completed credential with an empty URL still has a disabled link. Do not use a generic provider homepage as your certificate link.

## Add or remove an entry

To add an experience, project, or credential, copy an entire existing entry, including its `{ ... }`, then edit the copied text. Separate adjacent entries with a comma. To remove one, remove the whole entry and leave commas between the remaining entries. For skills, each quoted item is separated by a comma.

The approved layout uses three projects, four skill groups, and four or five About photos. Keeping these counts preserves that layout.

Each project may also have a `linkLabel` and `link`. Keep `linkLabel` empty if the project should not display a button. Use the full `https://` address for an external project page.

## Files you usually do not need to edit

- `index.html` loads the page and fonts.
- `styles.css` controls colors, typography, spacing, and responsive layouts.
- `script.js` displays the content, handles image fallbacks, and controls the mobile menu.
- `content.js` is your everyday editing file.
- `assets/` holds your images and resume.

Inter and Newsreader load from Google Fonts when you are online. If fonts cannot load, the page uses built-in alternatives and stays readable. Everything else is local. Motion is limited to smooth scrolling and subtle hover effects, and follows the visitor's reduced-motion preference.

## If an edit goes wrong

If the page goes blank, undo your latest edit and refresh. Check for a missing quote, comma, or closing bracket in `content.js`. The browser must have JavaScript enabled. Keeping a backup of `content.js` before a large edit makes recovery easy.

If a photo is still a placeholder, check its filename, extension, and path. Refresh after replacing the file.

## GitHub hosting

This website is hosted from the `SLuo_Profile` GitHub repository. After an edit, commit and push the changed files to the `main` branch. The included GitHub Pages workflow republishes the website automatically.

The public website address is:

`https://1111jia.github.io/SLuo_Profile/`

The `research/` folder contains the two public research portfolios. `_SOURCE_DROP` and the restricted ISSP `.dta` source file are not part of the public repository.
