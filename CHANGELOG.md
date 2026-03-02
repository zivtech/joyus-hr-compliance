# Changelog

All notable changes to the Joyus HR Compliance database are documented in this file.

This log tracks data additions, regulation updates, schema changes, and site improvements. For individual regulation changes, check the `record_updated` and `last_verified` fields on each record.

## [Unreleased]

## 2026-03-02

### Changed
- Replaced separate jurisdiction and law type browse pages with client-side JavaScript faceted filtering on the homepage
- Filter bar supports Jurisdiction, Law Type, and Status dropdowns with multi-select checkboxes, cross-filter-aware counts, and URL parameter sync for shareable links
- Jurisdiction dropdown includes search input for filtering ~50 jurisdictions
- Removed 4 browse page templates (~60 generated HTML pages eliminated from build output)
- Simplified site navigation to "Database" + "Disclaimer"

### Added
- `site/js/facets.js` — vanilla JS faceted filter engine with progressive enhancement
- Source quality classification system — regulation pages now show warnings for non-government sources and notes for trusted secondary sources (e.g., Cornell LII)
- `CONTRIBUTING.md` source policy guidance (prefer official .gov sources, Cornell LII acceptable as supplemental)
- PR CI workflow (`.github/workflows/ci.yml`) runs `npm run check` on all pull requests

### Fixed
- GitHub Pages asset paths — added `pathPrefix` to Eleventy config and converted all template paths to use `| url` filter
- Clean build step — `rm -rf _site` runs before Eleventy to prevent stale artifacts

### Improved
- Jurisdiction schema constraints — `if/then` rules now enforce required fields per level (federal: no state/locality; state: state required; local: state + locality required)
- Validator enforces local directory naming convention (`{locality}-{state}/`)
- Replaced non-government source URLs in GA and TN regulation records with official sources

## 2026-03-01

### Changed
- Redesigned site with "Legal Modernism" aesthetic — Crimson Pro / Outfit / JetBrains Mono typography, dark header/footer, teal-to-gold gradient accent, card animations
- Added stats bar to homepage showing regulation, jurisdiction, and law type counts
- Improved 404 page, disclaimer page, and Pagefind search styling

### Added
- `record_updated` field to all 88 regulation records — tracks when each database record was last modified (distinct from `last_verified` which tracks when data was checked against official sources)
- `record_updated` to JSON Schema as a required field
- GitHub Pages demo link in README

## 2026-02-28

### Added
- Complete coverage for all 50 U.S. states plus Washington, D.C. (88 regulations total)
- Consolidated eleventy config into single data-loading pass
- Custom 404 page

### Changed
- Improved Pagefind filter metadata on regulation cards

## 2026-02-27

### Added
- 26 additional state regulations (meal breaks, rest breaks, reporting time, overtime)
- Improved Nunjucks templates for requirements rendering
- Pagefind filter support for status, jurisdiction, and law type

## 2026-02-26

### Added
- Initial scaffold: Eleventy v3 static site with Pagefind search
- 25 regulations covering federal (FLSA), California, New York, Washington, Colorado, Oregon
- JSON Schema validation with AJV
- GitHub Actions for CI validation and GitHub Pages deployment
- Browse by jurisdiction and law type
- Full-text search with faceted filtering

## Date Field Reference

| Field | Meaning |
|-------|---------|
| `effective_date` | When the law/regulation took effect |
| `last_amended` | When the law itself was last amended by legislators |
| `last_verified` | When this record's data was last retrieved/verified against official sources |
| `record_updated` | When this database record was last modified |
