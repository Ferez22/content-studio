# P5 Ship: pull request on the site repo (from config.md)
1. Never touch the owner's checkout. Worktree from fresh main:
   git -C <site> fetch origin && git -C <site> worktree add <site>/../.seo-worktrees/<slug> -b seo/<slug> origin/<default>
2. Copy article into the content dir (file name = slug), images into the image folder. Refresh: edit the existing file.
   Redirect actions: edit the site's redirect config the way the site already does it.
3. Site rules: update TODO/DONE files if the site uses them; run its install (if needed) + build + typecheck. Fail -> fix.
4. Commit only intended files, message per site rules (+ co-author trailer). Push branch.
5. gh pr create (title "SEO: <title>", body: target keyword, intent, GSC evidence, checklist result, li-human score).
6. index.md row status=pr + PR URL. Tell the owner the PR link. Remove the worktree after merge or close.
Never merge, never push the default branch.
