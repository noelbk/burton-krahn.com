This site is built with [Quartz](https://quartz.jzhao.xyz/) (Obsidian-focused static site generator).

### Content

- **Public vault (committed)**: `vault/`
- **Static assets**: `vault/static/` (served at `/static/...`)

### Local development

- **Preview**: `make preview` then open `http://localhost:4321`
- **Build**: `make build` (outputs to `quartz/public/`)

### Deploy (GitHub Pages)

- **Publish**: `make quartz-publish` (pushes `quartz/public` to the `gh-pages` branch)

### Legacy Pelican

The repo still contains the historical Pelican configuration under `content/` and related files, but Quartz is the current build path.
	
