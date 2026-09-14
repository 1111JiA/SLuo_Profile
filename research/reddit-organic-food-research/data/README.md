# Data and provenance

## Corpus

`Dataset.csv` contains **1,827 German-language Reddit comments** collected from `r/de` and `r/FragReddit` for the period 2019–2022. The original collection used keyword searches related to organic food and the PSAWR interface to Pushshift.

| Field | Meaning |
| --- | --- |
| `index` | Row index created during preparation |
| `comments_id` | Reddit comment identifier returned during collection |
| `created_utc` | Recorded creation timestamp |
| `subreddit` | `de` or `FragReddit` |
| `body` | Public comment text captured at collection time |
| `year` | Calendar year derived from `created_utc` |

The dataset contains 48 comments from 2019, 118 from 2020, 540 from 2021, and 1,121 from 2022. It contains no username field and no missing rows in the six included columns.

## Collection and analysis

- `analysis/Data-Collection.qmd` documents the original collection procedure and search terms.
- `analysis/Term-paper.qmd` contains the original cleaning, tokenisation, keyword grouping, and sentiment analysis.
- `analysis/build_readme_figures.R` rebuilds the visual summaries and writes compact aggregates into `data/derived/`.
- Sentiment scoring uses [SentiWS](https://osf.io/x89wq/), a German-language polarity lexicon.

## Responsible reuse

The source comments were publicly available when collected, but public availability does not remove the need for careful research use. The corpus may contain text later edited or deleted by its author. Do not use it to identify, contact, profile, or quote individual users. Review Reddit's current terms and your institution's research-ethics requirements before redistributing or extending the collection.

For recruiter-facing review, the README figures and derived summaries are sufficient. The full comment text is retained here only as a reproducibility record.

## Interpretation limits

- Keyword matching defines the corpus; it is not a representative sample of Reddit or people living in Germany.
- Subreddit membership does not establish nationality or residence.
- The 2019 base is very small (`n = 48`).
- Keyword-based themes overlap and may miss relevant wording.
- Lexicon scoring cannot reliably interpret negation, sarcasm, irony, or context.
