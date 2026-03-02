# joyus-hr-compliance

A searchable static database of U.S. labor law scheduling compliance regulations, built with [Eleventy](https://www.11ty.dev/) and [Pagefind](https://pagefind.app/), deployed on GitHub Pages.

Search through the current data sets on the GitHub Pages demo here: [zivtech.github.io/joyus-hr-compliance](https://zivtech.github.io/joyus-hr-compliance/)

## What This Is

A structured, schema-validated collection of federal, state, and local labor law regulations covering:

- **Overtime** — weekly and daily thresholds, pay rates, exemptions
- **Meal Breaks** — timing, duration, waivers, penalty pay
- **Rest Breaks** — frequency, duration, pay requirements
- **Minor/Youth Labor** — hour limits, time-of-day windows, work permits, prohibited occupations
- **Predictive Scheduling** — advance notice, schedule change premiums, right to rest
- **Reporting Time Pay** — minimum pay when sent home early
- **Split Shift Premiums** — extra pay for non-consecutive shifts

## Current Coverage

- **Federal** — FLSA overtime, breaks, child labor, PUMP Act
- **California** — daily/weekly overtime, meal breaks, rest breaks, minor labor, split shift, reporting time
- **New York** — spread of hours, minor labor, reporting time
- **Washington** — overtime, meal breaks, rest breaks, minor labor
- **Colorado** — overtime (daily + weekly), meal breaks, rest breaks, minor labor
- **Oregon** — meal breaks, rest breaks, predictive scheduling, minor labor

## How It Works

Regulation data is stored as individual JSON files in `data/regulations/`, validated against a [JSON Schema](data/schema/regulation.schema.json) on every PR. An Eleventy build generates a static site with Pagefind search, deployed to GitHub Pages.

### Browse the Data

- **By jurisdiction** — federal, then state-by-state
- **By law type** — overtime, breaks, scheduling, etc.
- **Full-text search** — powered by Pagefind
- **Filter by status** — active, pending, expired, repealed
- **Source quality notices** — regulation pages flag non-government sources and identify trusted secondary references (such as Cornell LII)

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

MIT
