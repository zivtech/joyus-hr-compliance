# Changelog

All notable changes to the Joyus HR Compliance database are documented in this file.

This log tracks data additions, regulation updates, schema changes, and site improvements. For individual regulation changes, check the `record_updated` and `last_verified` fields on each record.

## [Unreleased]

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
