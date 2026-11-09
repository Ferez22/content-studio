# P0 Setup (once per brand; adapts to the user)
Ask in one batch, prefill what you can detect, confirm:
1. Site repo: local path and/or GitHub URL. Check: git remote, default branch, current branch + uncommitted work (never touch).
2. Stack + content: find blog source (MDX/MD folder, CMS, DB). Read the site's CLAUDE.md/README, the blog template and
   2 recent posts: frontmatter schema, file naming = URL rule, image folder, locale folders.
3. Languages to write (start with one).
4. Build/check commands (package manager, build, typecheck, lint) + site rules (branch naming, TODO/DONE files,
   commit trailer).
5. GSC property (mcp__gsc__list_properties; prefer sc-domain:). Canonical host (www or not).
6. Sitemap/routes for internal links (app/sitemap.ts or /sitemap.xml).
Write brands/<b>/seo/config.md from templates/config.md. Create keywords.md and index.md headers. Commit.
