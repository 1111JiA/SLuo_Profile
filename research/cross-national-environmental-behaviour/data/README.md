# Data and provenance

This project combines two sources:

1. **ISSP Environment IV (2020), ZA7650, Version 1.0.0.** The thesis used the GESIS data file identified by DOI [10.4232/1.13921](https://doi.org/10.4232/1.13921).
2. **Gender Inequality Index (2021).** Values came from Table 5 of the UNDP Human Development Report 2021/2022 statistical annex. The source workbook used for the analysis is included as `source/Gender Inequality Index.xlsx`.

## What is included

- `derived/country-summary.csv` contains non-identifying country and gender aggregates used by the README figures.
- `derived/model-context-estimates.csv` reproduces the selected estimates and standard errors reported in Tables 3 and 4 of the thesis.
- `source/Gender Inequality Index.xlsx` is the macro-level source workbook used in the analysis.

## Why the ISSP microdata are not included

`ZA7650_v1-0-0.dta` is intentionally not redistributed here. Section 3 of the [GESIS usage regulations](https://www.gesis.org/fileadmin/admin/Dateikatalog/pdf/sonstiges/20230630_datenservices_usage_regulations.pdf) permits disclosure to third parties only when a licence allows it or GESIS provides separate written permission. No such permission is included with the files supplied for this portfolio. Obtain the matching version through the [official study record](https://search.gesis.org/research_data/ZA7650?doi=10.4232/1.13921) and follow its applicable access terms. The included country summaries present aggregated results.

To reproduce the full analysis, download the matching ZA7650 Version 1.0.0 file, place it beside `analysis/Gender_PEB.Rmd`, and retain the original filename `ZA7650_v1-0-0.dta`. Copy the included `source/Gender Inequality Index.xlsx` beside the Rmd as well, and run with the `analysis/` folder as the working directory. Install the R packages listed in the original source first. The source is preserved as supplied; local package versions may affect rendering.

## Analytical sample

- Taiwan was excluded because a matching GII value was unavailable in the source used by the thesis.
- Negative missing-value codes were handled according to `Gender_PEB.Rmd`.
- The final complete-case sample contains **17,762 respondents across 13 countries**.
- Private PEB combines recycling and product-avoidance items on a 0–3 scale.
- Public PEB combines four forms of environmental participation on a 0–1 scale.
- Gender is coded as men and women in the source analysis. The source does not support claims about gender identities outside those response categories.

The compact CSVs are presentation extracts. They do not replace the original study documentation, questionnaires, weighting information, or codebook.
