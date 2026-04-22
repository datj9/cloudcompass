<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Dependency upgrade routine

When asked to upgrade or bump library, framework, or runtime versions:

1. **Check current versions.** Read `package.json`, `next.config.ts`, `tsconfig.json`, and any `engines` constraints.
2. **Identify outdated deps.** Compare against the latest stable releases. Flag major-version bumps separately from patch/minor.
3. **Analyze codebase impact before bumping.** For every library with a breaking change, search the repo for usage (imports, API calls, config keys) and produce a file-path list of required fixes. Do not assume the bump is safe.
4. **Propose the upgrade as a PR.** In the PR body list breaking changes, affected files/lines, and the suggested migration per file.
5. **Do not claim the build passes without running it.** Mark required follow-ups in the Test Plan. Major bumps almost always require a migration commit before the build is green.
6. **Notify if requested.** Draft a summary email when the PR is opened.

This repo is a Next.js 16 + React 19 + Tailwind v4 app — on Next majors re-check App Router conventions against `node_modules/next/dist/docs/`; on React majors watch for `forwardRef`/`defaultProps` removals; on Tailwind majors watch for config-file format changes.
