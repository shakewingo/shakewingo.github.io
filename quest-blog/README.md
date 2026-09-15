# Ying Yao · A personal planet

A personal blog with a pixel planet, a real writing journal, a career timeline, and a two-project workshop. Built with Next.js, React, MDX, and KaTeX; statically exported for the existing GitHub Pages workflow.

## Run locally

Requires Node.js 22 and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The home page and `/map/` both open the blog directly.

## Check and export

```sh
npm run lint
npm test
npm run build
```

`npm test` checks MDX metadata exclusion, reading-time estimates, and English/Chinese summary truncation. Node 22 may print an experimental type-stripping warning. The production build also checks TypeScript and exports the site to `out/`.

```sh
python3 -m http.server 3000 --directory out
```

The repository's existing `.github/workflows/deploy.yml` publishes `quest-blog/out` when changes are pushed to `master`. Local edits and builds do not publish anything by themselves.

## Add an article

Create `src/app/quests/<slug>/page.mdx`; use a lowercase hyphenated slug. Start with:

```mdx
import QuestLayout from '@/components/QuestLayout'

export const metadata = {
  title: 'A useful title',
  date: '2026-09-15',
  summary: 'One or two sentences describing what this article actually covers.',
}

export default ({ children }) => (
  <QuestLayout slug="your-slug" {...metadata}>
    {children}
  </QuestLayout>
)

## Introduction

Your article starts here.
```

Use the folder name in `slug`. Articles are sorted newest first. If `summary` is omitted, the first two prose paragraphs supply the card summary. Reading time is generated from prose at 220 English words or 400 CJK characters per minute (minimum one minute); metadata, code blocks, and math notation are excluded. It is a prose reading estimate, not a promise about time needed to study the equations.

## Content and design

- `src/components/GameApp.tsx`: landing page, real career history, projects, and social links.
- `src/app/globals.css`: the pixel-planet visual system and responsive styles.
- `src/lib/reading.ts`: MDX AST-based summary and reading-time extraction.
- `src/components/QuestLayout.tsx`: the reading page, including scrollable formulas.
- `src/app/icon.svg`: a code-native pixel planet favicon.
- `public/images/rally-video.jpg`: thumbnail from the author's [Rally introduction](https://www.youtube.com/watch?v=ww071PvcVqk&t=28s).

Rally's description was checked against its [public repository](https://github.com/shakewingo/Rally). The video loads from YouTube only after the visitor chooses play; the independent YouTube link is also available. Video focus returns to the play button after closing. Escape closes the inline player while focus is in the parent page (keys inside YouTube's iframe are controlled by YouTube).

The personal section is based on `source/resume_en.pdf`. The full PDF and its contact information are not copied to the public website. The research link points to the [author's arXiv preprint](https://arxiv.org/abs/2604.03768).

## LLM-Wiki

The `/garden/` page connects notes from four owner-approved sources: Yuque’s **Algorithm**, **Engineering**, and **ML Course**, plus Notion’s **Alisa’s LLM notebook**. It supports search, knowledge-base/type filters, Graph/List views, zoom, panning, connection focus, and linked note reading. Relations retain their direction and type. Example: `/garden/#paged-attention`.

Route A is implemented with a build-time snapshot: **82 notes and 232 relationships** from commit `08034d7`. The latest publication scope replaces the earlier permission to include all notes. A note qualifies only when every source maps to an approved Yuque namespace or the specific approved Notion page in `scripts/wiki-publication-policy.mjs`. Notes combining approved sources are included. Notes with any unapproved or missing source are excluded (24 notes in this snapshot). Edges survive only when both notes qualify. This is a subset of the existing LLM-Wiki synthesis, not a complete import of every source document.

To update from a local checkout:

```sh
npm run sync:wiki -- --repo /absolute/path/to/llm-wiki
npm test
npm run build
```

The exporter reads `sources/registry.json` locally to verify provenance; the registry is not shipped to the browser. Each exported note has knowledge-base labels. Links to included notes work within the site; references to excluded notes remain plain text within the approved note's prose. Unapproved Yuque/Notion source URLs stop the export. Frontmatter, generated Obsidian blocks, workspace settings, sync reports, and Git history are omitted.

Builds use the checked-in snapshot without credentials or network access to the wiki. Updates require syncing and rebuilding; there is no live connection to Obsidian. GitHub/Yuque/Notion visibility settings are not changed. Source links use their provider’s visibility settings; the registry’s old `public` flag is not treated as the owner’s publication authorization. The Notion allowance matches the notebook’s exact source page ID, not every page in its parent Docs collection.

See [implementation and publication notes](docs/knowledge-graph-plan.md).
