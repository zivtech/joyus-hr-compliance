# Contributing to Joyus HR Compliance

Thank you for helping build a comprehensive, accurate database of U.S. labor law compliance regulations. This guide covers how to add or update regulation data.

## What You Can Contribute

- **New regulations** — Add a regulation not yet in the database
- **Data corrections** — Fix errors in existing regulation records
- **Verification updates** — Confirm existing data is still current and update the `last_verified` date
- **Source links** — Add or fix links to official statute text

## Before You Start

1. Check [existing issues](https://github.com/zivtech/joyus-hr-compliance/issues) to see if someone is already working on the regulation you want to add.
2. Familiarize yourself with the [JSON Schema](data/schema/regulation.schema.json) that all regulation files must conform to.

## Adding a New Regulation

### 1. Copy the Template

Start from the template file:

```bash
cp data/schema/regulation.template.json data/regulations/states/xx/xx-regulation-name.json
```

Place the file in the correct directory:
- `data/regulations/federal/` for federal regulations
- `data/regulations/states/{state-code}/` for state regulations (e.g., `states/ca/`)
- `data/regulations/local/{city-state}/` for local ordinances

### 2. Fill In the Data

**Required fields:**
- `id` — Must match the filename (without `.json`), lowercase with hyphens
- `jurisdiction` — Must match the directory location
- `law_type` — Must be one of: `overtime`, `meal-breaks`, `rest-breaks`, `predictive-scheduling`, `minor-labor`, `reporting-time-pay`, `split-shift`, `maximum-hours`, `minimum-wage`, `pay-frequency`, `recordkeeping`, `nursing-breaks`
- `title` — Human-readable regulation name
- `statute_citation` — Official legal citation (e.g., `Cal. Lab. Code § 510`)
- `summary` — Plain-language description (minimum 10 characters)
- `effective_date` — ISO 8601 date (`YYYY-MM-DD`)
- `status` — One of: `active`, `pending`, `repealed`, `superseded`, `expired`
- `requirements` — Object with regulation-specific details (at least one property)
- `source_urls` — Array of URLs to official law text (at least one)
- `last_verified` — ISO 8601 date when you verified the data

**Citation standards:**
- Use the standard legal citation format for the jurisdiction
- Federal: `29 U.S.C. § 207`, `29 CFR § 785.18`
- State: `Cal. Lab. Code § 510`, `RCW 49.46.130`
- Include both statute and regulatory citations when applicable

### 3. Validate Locally

```bash
npm install
npm run validate
```

This runs the JSON Schema validator against all data files. Fix any errors before submitting.

### 4. Submit a Pull Request

- Create a branch from `main`
- Include one regulation per commit when adding multiple regulations
- In the PR description, link to the official source you used

## Updating an Existing Regulation

1. Edit the JSON file directly
2. Update the `last_amended` date if the law itself changed
3. Update the `last_verified` date to today
4. Update `source_urls` if the official link changed
5. Run `npm run validate` locally
6. Submit a PR explaining what changed and linking to the official source

## Review Checklist

Reviewers will check:

- [ ] JSON Schema validation passes
- [ ] `id` matches filename
- [ ] File is in the correct directory for its jurisdiction
- [ ] Statute citation is correctly formatted
- [ ] `source_urls` link to official government sources (not third-party summaries)
- [ ] `effective_date` matches the official source
- [ ] `requirements` object captures the key numerical thresholds
- [ ] `summary` is accurate and plain-language
- [ ] No sensitive or copyrighted content is included

## Questions?

Open an issue with the question label if you're unsure about any aspect of contributing.
