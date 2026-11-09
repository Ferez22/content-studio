# P1 Research
GSC tools: mcp__gsc__get_search_analytics (dimensions query|page|query,page), get_performance_overview,
compare_search_periods, inspect_url_enhanced / batch_url_inspection (indexing). Default window 90 days.
Filter non-human queries (see SKILL.md Rules).

## Audit mode -> brands/<b>/seo/audit.md (dated)
1. Lost pages: GSC pages with impressions -> curl -s -o /dev/null -w "%{http_code}" each URL (live). 404/410 with
   impressions = top priority: restore content (old source?) or 301 to the closest live page.
2. Quick wins: query/page at position 5-20 with impressions -> refresh target.
3. Low CTR: position <= 10 and CTR well under peers -> rewrite title + description.
4. Cannibalization: one query, several of our pages -> merge or differentiate.
5. Gaps: business queries (offer keywords) with impressions but position > 30 or no page -> new article/page.
6. Tech: duplicate hosts (www vs bare, unprefixed vs locale), indexing errors (URL inspection on top pages).
Out: table | priority | issue | evidence (GSC numbers) | action (write|refresh|redirect|meta) | effort |. Show the owner, they pick.

## Article (write/refresh) -> articles/<folder>/serp.md
1. Target query + intent (informational | commercial | navigational). Our current rank/impressions for it (GSC).
2. SERP: WebSearch the query (top 5-8). Per result: angle, format, depth, freshness, what's missing.
   Need full text of a top result (structure, H2s, depth) -> Firecrawl firecrawl_scrape (markdown), max 3 pages,
   cost gate per CLAUDE.md Tools.
3. People also ask / related questions, entities that must appear, sources worth citing (primary, dated).
4. Internal link targets: our pages that should link in and out (sitemap + keywords.md).
