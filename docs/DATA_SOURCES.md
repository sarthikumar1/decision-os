# Data Sources

## Policy

Decision OS does **not** scrape, crawl, or fetch data from external websites or APIs. All data in the application is either:

1. **User-provided**: Entered manually by the user
2. **Demo data**: Preloaded example data with clearly labeled subjective scores

## Demo Data Provenance

### "Best City to Relocate To" Demo

- **Source**: Entirely fictional/subjective scores created by the project authors
- **Purpose**: Demonstrate the app's functionality
- **Scores**: All scores (0–10) are subjective assessments, not derived from external data
- **No real-world accuracy claim**: The demo scores do not represent actual data about Austin, Denver, or Raleigh

## Rules for Future Data Integration

If external datasets are added in future versions:

1. **Open data only**: Must use publicly available, permissively licensed datasets
2. **License documented**: Dataset license must be recorded in this file
3. **Source linked**: Direct URL to the original data source
4. **Provenance label**: In-app UI must show "Source: [name]" next to any external data
5. **User-optional**: External data must be optional — the app must function without it
6. **No scraping**: Web scraping is prohibited. Use official APIs or downloadable datasets only
7. **No ToS violations**: Do not use data from services that prohibit programmatic access

## Current External Dependencies

| Dependency | Purpose | License | URL |
| ---------- | ------- | ------- | --- |
| None       | —       | —       | —   |

The MVP has **zero external data dependencies**. All scoring is done on user-provided inputs.
