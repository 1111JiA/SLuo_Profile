# Prepare the compact, non-identifying summaries used by the README figures.
# Run from the repository root:
# Rscript analysis/prepare_public_data.R /path/to/ZA7650_v1-0-0.dta /path/to/Gender\ Inequality\ Index.xlsx

suppressPackageStartupMessages({
  library(dplyr)
  library(haven)
  library(readr)
  library(readxl)
  library(tidyr)
})

args <- commandArgs(trailingOnly = TRUE)
if (length(args) != 2) {
  stop("Provide the ISSP .dta file and the Gender Inequality Index .xlsx file.")
}

raw <- read_dta(args[[1]]) |> filter(c_alphan != "TW")
raw[raw == -9] <- NA
raw$v52[raw$v52 == -4] <- NA

recode_values <- function(x, replacements) {
  original <- x
  recoded <- x
  for (key in names(replacements)) {
    recoded[original == as.numeric(key)] <- replacements[[key]]
  }
  recoded
}

raw <- raw |>
  mutate(
    v52_recode = recode_values(v52, c(`1` = 3, `2` = 2, `3` = 1, `4` = 0)),
    v53_recode = recode_values(v53, c(`1` = 3, `2` = 2, `3` = 1, `4` = 0)),
    v54_recode = recode_values(v54, c(`1` = 1, `2` = 0)),
    v55_recode = recode_values(v55, c(`1` = 1, `2` = 0)),
    v56_recode = recode_values(v56, c(`1` = 1, `2` = 0)),
    v57_recode = recode_values(v57, c(`1` = 1, `2` = 0)),
    private_peb = rowMeans(pick(v52_recode, v53_recode), na.rm = TRUE),
    public_peb = rowMeans(pick(v54_recode, v55_recode, v56_recode, v57_recode), na.rm = TRUE),
    concern = v15,
    v26_recode = recode_values(v26, c(`1` = 5, `2` = 4, `3` = 3, `4` = 2, `5` = 1)),
    v27_recode = recode_values(v27, c(`1` = 5, `2` = 4, `3` = 3, `4` = 2, `5` = 1)),
    v28_recode = recode_values(v28, c(`1` = 5, `2` = 4, `3` = 3, `4` = 2, `5` = 1)),
    willingness_to_sacrifice = rowMeans(pick(v26_recode, v27_recode, v28_recode), na.rm = TRUE)
  ) |>
  select(c_alphan, SEX, EDUCYRS, AGE, WORK, TOPBOT, private_peb,
         public_peb, concern, willingness_to_sacrifice, WRKSUP) |>
  drop_na()

country_names <- c(
  AT = "Austria", CH = "Switzerland", DE = "Germany", DK = "Denmark",
  FI = "Finland", HU = "Hungary", IS = "Iceland", JP = "Japan",
  NZ = "New Zealand", PH = "Philippines", RU = "Russian Federation",
  SI = "Slovenia", TH = "Thailand"
)

gii_raw <- read_excel(args[[2]], skip = 5)
gii <- tibble(
  country = as.character(gii_raw[[2]]),
  gii = suppressWarnings(as.numeric(gii_raw[[3]]))
) |>
  filter(country %in% unname(country_names)) |>
  distinct(country, .keep_all = TRUE)

analysis_data <- raw |>
  mutate(
    country = unname(country_names[as.character(c_alphan)]),
    gender = recode(as.numeric(SEX), `1` = "Men", `2` = "Women")
  ) |>
  inner_join(gii, by = "country")

if (nrow(analysis_data) != 17762 || n_distinct(analysis_data$country) != 13) {
  stop("Unexpected analytical sample. Expected 17,762 observations across 13 countries.")
}

country_summary <- analysis_data |>
  group_by(country, gii, gender) |>
  summarise(
    n = n(),
    private_peb = mean(private_peb),
    public_peb = mean(public_peb),
    .groups = "drop"
  ) |>
  pivot_wider(
    names_from = gender,
    values_from = c(n, private_peb, public_peb),
    names_glue = "{.value}_{tolower(gender)}"
  ) |>
  mutate(
    n_total = n_men + n_women,
    private_peb_mean = (private_peb_men * n_men + private_peb_women * n_women) / n_total,
    public_peb_mean = (public_peb_men * n_men + public_peb_women * n_women) / n_total,
    private_gender_gap = private_peb_women - private_peb_men,
    public_gender_gap = public_peb_women - public_peb_men
  ) |>
  arrange(gii)

dir.create("data/derived", recursive = TRUE, showWarnings = FALSE)
write_csv(country_summary, "data/derived/country-summary.csv")

message("Prepared country-summary.csv: 13 countries; analytical N = 17,762.")
