---
name: hr-compliance
description: U.S. labor law scheduling compliance database. Use when answering questions about overtime, meal breaks, rest breaks, predictive scheduling, minor labor, reporting time pay, or split shift regulations across federal, state, and local jurisdictions. Provides structured JSON data for 88 regulations covering all 50 states, DC, and select municipalities.
license: Apache-2.0
metadata:
  author: zivtech
  version: "1.0.0"
  argument-hint: <state-or-jurisdiction-or-law-type>
---

# U.S. Labor Law Scheduling Compliance

Structured database of U.S. labor law scheduling compliance regulations maintained by Zivtech. Contains 88 regulation records covering federal (FLSA), all 50 states, Washington D.C., and select local jurisdictions (Los Angeles, New York City, Philadelphia).

## When to Use

Reference this skill when:
- Answering questions about U.S. labor law scheduling requirements
- Looking up overtime, meal break, rest break, or predictive scheduling rules
- Comparing regulations across states or jurisdictions
- Checking employer obligations for specific industries or employee types
- Identifying applicable regulations for a given business scenario

## Data Location

All regulation data is in `data/regulations/` organized by jurisdiction:

```
data/regulations/
  federal/          # FLSA overtime, breaks, child labor, PUMP Act
  states/{st}/      # State-level regulations (e.g., states/ca/, states/ny/)
  local/{city-st}/  # Municipal regulations (e.g., local/los-angeles-ca/)
```

## Law Types Covered

| Law Type | Slug | Description |
|----------|------|-------------|
| Overtime | `overtime` | Weekly/daily overtime thresholds and pay rates |
| Meal Breaks | `meal-breaks` | Required meal period duration and triggers |
| Rest Breaks | `rest-breaks` | Required rest period frequency and duration |
| Predictive Scheduling | `predictive-scheduling` | Advance notice, predictability pay, right to rest |
| Minor Labor | `minor-labor` | Hour restrictions and prohibited occupations for minors |
| Reporting Time Pay | `reporting-time-pay` | Minimum pay for reporting to work |
| Split Shift | `split-shift` | Premium pay for split work schedules |
| Nursing Breaks | `nursing-breaks` | Lactation accommodation requirements |
| Maximum Hours | `maximum-hours` | Caps on daily or weekly work hours |
| Minimum Wage | `minimum-wage` | Minimum hourly wage rates |
| Pay Frequency | `pay-frequency` | Required pay period intervals |
| Recordkeeping | `recordkeeping` | Employer record retention requirements |

## Record Schema

Each regulation JSON file contains:

```json
{
  "id": "ca-meal-breaks",
  "jurisdiction": {
    "level": "state",
    "state": "CA",
    "locality": null
  },
  "law_type": "meal-breaks",
  "title": "California Meal Period Requirements",
  "statute_citation": "Cal. Lab. Code § 512",
  "regulatory_citation": null,
  "summary": "Plain-language description of the regulation.",
  "effective_date": "2000-01-01",
  "sunset_date": null,
  "last_amended": "2024-01-01",
  "status": "active",
  "applicability": {
    "employer_size_minimum": null,
    "industries": null,
    "employee_types": ["non-exempt"],
    "age_groups": ["adult", "16-17"]
  },
  "requirements": {
    "meal_period_duration_minutes": 30,
    "trigger_hours": 5,
    "second_meal_trigger_hours": 10,
    "description": "Detailed requirements text..."
  },
  "penalties": {
    "description": "One hour of pay at regular rate for each violation.",
    "per_violation_amount": null,
    "statute_of_limitations_years": 3
  },
  "notes": "Additional context and edge cases.",
  "source_urls": ["https://leginfo.legislature.ca.gov/..."],
  "last_verified": "2026-01-15",
  "record_updated": "2026-01-15",
  "contributors": ["initial-data-load"]
}
```

### Key Fields

- **jurisdiction.level**: `federal`, `state`, or `local`
- **jurisdiction.state**: Two-letter abbreviation (null for federal)
- **jurisdiction.locality**: City name (only for local)
- **law_type**: One of the 12 types listed above
- **status**: `active`, `pending`, `expired`, `repealed`, or `superseded`
- **applicability**: Who the law applies to (employer size, location thresholds, franchise rules, industries, employee types, age groups)
  - **employer_size_minimum**: Minimum employees (null = no minimum)
  - **minimum_locations**: Minimum business locations (null = no location threshold)
  - **counting_scope**: Geographic scope for counting: `single_location`, `statewide`, `nationwide`, `worldwide`, or null
  - **includes_franchise_network**: `true` if franchise/chain network totals count toward thresholds (a franchisee with 20 employees is covered if the brand meets the threshold)
- **requirements**: Structured data varying by law type (thresholds, durations, descriptions)
- **source_urls**: Official government sources for verification

## How to Query

### Find regulations for a specific state

Read all JSON files in `data/regulations/states/{st}/` where `{st}` is the lowercase two-letter state code.

Example: California regulations are in `data/regulations/states/ca/`

### Find regulations by law type

Search across all files for `"law_type": "meal-breaks"` (or any other type slug).

### Find all active regulations

Filter records where `"status": "active"`.

### Check if a state has a specific regulation

Look for `data/regulations/states/{st}/{st}-{law-type}.json`. If the file does not exist, check if the state follows federal rules (file may be named `{st}-follows-federal.json`).

### Compare across states

Read multiple state files for the same law type and compare `requirements` objects for numerical thresholds (e.g., `trigger_hours`, `meal_period_duration_minutes`).

## Important Caveats

- This database is for **informational purposes only** and does not constitute legal advice.
- Laws change frequently. Always verify against official sources in `source_urls` before relying on any data.
- The `requirements` object structure varies by law type. There is no single schema for all requirement fields.
- Some states follow federal rules with no additional state requirements — these are recorded as `{st}-follows-federal.json`.
- The `last_verified` field indicates when data was last checked against official sources.

## Validation

Run `npm run validate` to check all records against the JSON Schema at `data/schema/regulation.schema.json`. The schema enforces jurisdiction field requirements per level:
- Federal: `state` and `locality` must be null
- State: `state` required (2-letter code), `locality` must be null
- Local: both `state` and `locality` required

## Live Site

Browse the database at: https://zivtech.github.io/hr-compliance/
