# joyus-hr-compliance

Because who knew that HR compliance could be so... *Joyus*?

Spoiler: it can't. It's a nightmarish patchwork of 50 states, countless municipalities, and a federal government that couldn't agree on whether you deserve a lunch break. California alone has more scheduling rules than most countries have laws. But *somebody* has to deal with it — and that somebody is now an AI skill.

**joyus-hr-compliance** is a compliance guardrail skill that ensures employee scheduling adheres to local, state, and federal HR laws and regulations. It covers overtime, breaks, shift scheduling, predictive scheduling, and minor/youth labor protections — because apparently letting a 15-year-old work past 7 PM requires a regulatory framework spanning thousands of pages.

## What It Does

- Validates shift schedules against applicable labor laws
- Checks break and meal period compliance (yes, California, we see you and your premium pay penalties)
- Calculates overtime obligations across jurisdictions that can't agree on what "overtime" means
- Enforces minor/youth work restrictions so teenagers don't accidentally violate 17 Hazardous Occupation Orders they've never heard of
- Applies predictive scheduling rules for the lucky cities that decided employers should plan ahead

## How It Works

Works as both a **standalone Claude skill** for conversational compliance checking and a **reusable guardrail module** that other Joyus AI applications invoke automatically to validate HR decisions before they're applied.

## Coverage

- Federal (FLSA, OSHA, PUMP Act)
- All 50 states
- Local ordinances: Philadelphia, Los Angeles, New York City (more to come, because cities keep passing these)
- Adults and minors/youth (ages 14-17)

## Status

Research and planning phase.
