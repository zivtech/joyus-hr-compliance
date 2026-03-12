# hr-compliance

A searchable static database of U.S. labor law scheduling compliance regulations, built with [Eleventy](https://www.11ty.dev/) and [Pagefind](https://pagefind.app/), deployed on GitHub Pages.

Search through the current data sets on the GitHub Pages demo here: [zivtech.github.io/hr-compliance](https://zivtech.github.io/hr-compliance/)

## What This Is

A structured, schema-validated collection of federal, state, and local labor law regulations covering:

- **Overtime** — weekly and daily thresholds, pay rates, exemptions
- **Meal Breaks** — timing, duration, waivers, penalty pay
- **Rest Breaks** — frequency, duration, pay requirements
- **Minor/Youth Labor** — hour limits, time-of-day windows, work permits, prohibited occupations
- **Predictive Scheduling** — advance notice, schedule change premiums, right to rest
- **Reporting Time Pay** — minimum pay when sent home early
- **Split Shift Premiums** — extra pay for non-consecutive shifts

Each regulation includes structured applicability data — employer size thresholds, location requirements, franchise/chain network rules, industry restrictions, and employee type coverage — so you can determine which laws apply to a specific business.

## Current Coverage

- **Federal** — FLSA overtime, breaks, child labor, PUMP Act
- **All 50 states + DC** — 88 regulations covering overtime, meal breaks, rest breaks, minor labor, predictive scheduling, reporting time pay, split shift, and more
- **Select municipalities** — Los Angeles, New York City, Philadelphia

## How It Works

Regulation data is stored as individual JSON files in `data/regulations/`, validated against a [JSON Schema](data/schema/regulation.schema.json) on every PR. An Eleventy build generates a static site with Pagefind search, deployed to GitHub Pages.

### Browse the Data

- **Faceted filtering** — filter by jurisdiction, law type, status, and company size with combinable dropdowns
- **Full-text search** — powered by Pagefind
- **Shareable filters** — URL parameters persist filter selections for bookmarking and sharing
- **Source quality notices** — regulation pages flag non-government sources and identify trusted secondary references (such as Cornell LII)

## Install as an Agent Skill

This database is available as a skill for AI coding agents via [skills.sh](https://skills.sh):

```bash
npx skills add zivtech/hr-compliance
```

Once installed, your AI agent can query U.S. labor law scheduling compliance data directly from the structured JSON records.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add or update regulation data. Contributions from HR professionals, employment lawyers, and anyone familiar with labor law are welcome.

## Development

```bash
npm install
npm run validate   # Check all data files against schema
npm run build      # Build the static site + Pagefind index
npm run serve      # Local development server
```

## Architecture

| Layer | Technology | Purpose |
|---|---|---|
| Data | JSON files + JSON Schema | Structured regulation records |
| Validation | AJV (in CI) | Schema enforcement on every PR |
| SSG | Eleventy v3 | HTML generation from data |
| Search | Pagefind | Client-side full-text search + faceted filtering |
| Hosting | GitHub Pages | Zero-infrastructure deployment |

## Disclaimer

This database is for informational purposes only and does not constitute legal advice. Laws change frequently. Verify all information against official sources before relying on it. See the full [disclaimer](/disclaimer/).

## License

Apache-2.0
