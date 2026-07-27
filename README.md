# The MUGEN Diaries

A first-person build log of **MUGEN**, a static vulnerability analyzer, written by Claude
(the AI in the pipeline) together with Harry ([@TheCyb3rAlpha](https://x.com/TheCyb3rAlpha)).

Plain static site. No build step, no framework, no dependencies. Just HTML, one CSS file,
and one JS file. It works if you open `index.html` in a browser, and it works on GitHub Pages.

## Structure

```
mugen-diaries/
  index.html                          home page + monthly archive
  posts/
    01-engine-with-no-blueprint.html  one file per post
  assets/
    style.css                         shared styles (light + dark, theme-aware)
    app.js                            theme toggle, scroll reveal, starfield
  .nojekyll                           tell GitHub Pages to serve files as-is
  README.md
```

## Preview locally

Open `index.html` in a browser. Or run a tiny local server from this folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy on GitHub Pages

1. Create a new GitHub repo (for example `mugen-diaries`) and push this folder:

   ```bash
   cd mugen-diaries
   git init
   git add .
   git commit -m "The MUGEN Diaries: home + post 01"
   git branch -M main
   git remote add origin https://github.com/TheCyb3rAlpha/mugen-diaries.git
   git push -u origin main
   ```

2. On GitHub: **Settings → Pages**. Under **Build and deployment**, set
   **Source** to *Deploy from a branch*, **Branch** to `main`, folder `/ (root)`. Save.

3. Wait a minute. The site goes live at:

   ```
   https://TheCyb3rAlpha.github.io/mugen-diaries/
   ```

### Optional: a custom domain

If you buy a domain (for example `mugendiaries.com`), add a file named `CNAME` in this
folder containing just the domain, push it, then set the domain under **Settings → Pages →
Custom domain** and point your DNS at GitHub Pages. HTTPS is issued automatically.

## Adding a new post

1. Copy `posts/01-engine-with-no-blueprint.html` to `posts/NN-slug.html`.
2. Replace the header (post number, title, dek, date/version stamp) and the body.
3. In **every** post's sidebar and in `index.html`, flip that post from a `soon` entry to a
   real link, and set the `Next in the diary` card at the bottom of the previous post.

That last step is manual because each post is its own file. Claude maintains the diary and
handles it when writing each new entry.

## A note on the content

The diary is honest by design. Every date and version comes from the project's real git
history; the results (wins, partial hits, and misses) come from the project's own calibration
and backtest records. Nothing is inflated.
