# Quest Blog (Next.js)

This repo now serves the Shakewing Quest blog, built with Next.js inside the `quest-blog` directory and deployed through GitHub Pages using static export.

## Deploying to Production

1. Run `npm ci` and `npm run build` from `quest-blog/` locally to confirm the static export in `quest-blog/out` looks correct.
2. Commit your changes and push to `main`; the GitHub Actions workflow at `.github/workflows/deploy.yml` will build and publish the site to https://shakewingo.github.io automatically.
3. Monitor the *Deploy Next.js static site* workflow run in GitHub → Actions and wait for a green check.
4. Hard refresh https://shakewingo.github.io once the deployment finishes.
