# Rebuild the three reader-facing figures embedded in README.md.
# Run from the repository root: Rscript analysis/build_readme_figures.R
# To use a local SentiWS file:
# SENTIWS_PATH=/path/to/sentiws.csv Rscript analysis/build_readme_figures.R

suppressPackageStartupMessages({
  library(dplyr)
  library(ggplot2)
  library(lsa)
  library(patchwork)
  library(readr)
  library(scales)
  library(SnowballC)
  library(stringr)
  library(tidyr)
  library(tidytext)
})

paper <- "#f7f6f2"
ink <- "#202c37"
muted <- "#657078"
blue <- "#567187"
orange <- "#b56f49"
line <- "#d8dad6"
palette <- c(Health = "#5f7f92", Taste = "#b27a59", Environment = "#6f8374", Price = "#8b6873")

theme_portfolio <- function(base_size = 14) {
  theme_minimal(base_size = base_size, base_family = "Arial") +
    theme(
      plot.background = element_rect(fill = paper, color = NA),
      panel.background = element_rect(fill = paper, color = NA),
      plot.title = element_text(color = ink, size = 24, face = "bold", margin = margin(b = 7)),
      plot.subtitle = element_text(color = muted, size = 13, lineheight = 1.15, margin = margin(b = 20)),
      plot.caption = element_text(color = muted, size = 10, hjust = 0, margin = margin(t = 18)),
      axis.title = element_text(color = ink, size = 12),
      axis.text = element_text(color = muted, size = 11),
      panel.grid.minor = element_blank(),
      panel.grid.major.x = element_blank(),
      panel.grid.major.y = element_line(color = line, linewidth = 0.35),
      legend.position = "top",
      legend.justification = "left",
      legend.title = element_blank(),
      legend.text = element_text(color = muted),
      plot.margin = margin(30, 34, 26, 30)
    )
}

save_plot <- function(filename, plot, width = 12, height = 7) {
  dir.create("figures", showWarnings = FALSE)
  ggsave(file.path("figures", filename), plot, width = width, height = height,
         dpi = 180, bg = paper)
}

comments <- read_csv("data/Dataset.csv", show_col_types = FALSE) |>
  mutate(year = as.integer(year))

if (nrow(comments) != 1827 || !identical(sort(unique(comments$year)), 2019:2022)) {
  stop("Unexpected Reddit dataset. Expected 1,827 comments from 2019–2022.")
}

volume <- comments |>
  count(year, subreddit) |>
  group_by(year) |>
  mutate(total = sum(n)) |>
  ungroup()

p_volume <- ggplot(volume, aes(factor(year), n, fill = subreddit)) +
  geom_col(width = 0.62) +
  geom_text(data = distinct(volume, year, total), aes(factor(year), total, label = comma(total)),
            inherit.aes = FALSE, vjust = -0.6, color = ink, size = 4.2) +
  scale_fill_manual(values = c(de = blue, FragReddit = orange)) +
  scale_y_continuous(expand = expansion(mult = c(0, 0.12)), labels = comma) +
  labs(
    title = "Organic-food discussion accelerated after 2020",
    subtitle = "Collected comments matching the study keywords in r/de and r/FragReddit.",
    x = NULL,
    y = "Comments",
    caption = "Counts describe the collected corpus, not all Reddit activity or the German population."
  ) + theme_portfolio()
save_plot("comment-volume-by-year.png", p_volume)

patterns <- c(
  Health = "gesund|ungesund|Gesundheit|Immum|gesünder|ungesünder|fit|Qualität|unschädlich",
  Taste = "schmeck|schmack|wohlschmeckend|lecker|deliziös|köstlich|schmeckend|Geschmack",
  Environment = "umwelt|nachhaltig|ökologisch|Ökologie|umweltverantwortlich|umweltbewusst|umweltschädlich",
  Price = "preis|billig|teuer|günstig|luxus|aufwendig|kost"
)

themes <- bind_rows(lapply(names(patterns), function(label) {
  comments |>
    filter(str_detect(body, patterns[[label]])) |>
    count(year, name = "comments_matching") |>
    mutate(theme = label)
})) |>
  left_join(comments |> count(year, name = "all_comments"), by = "year") |>
  mutate(share = comments_matching / all_comments)

p_themes <- ggplot(themes, aes(year, share, color = theme)) +
  geom_line(linewidth = 1.25) +
  geom_point(size = 3.2) +
  scale_color_manual(values = palette) +
  scale_x_continuous(breaks = 2019:2022) +
  scale_y_continuous(labels = percent_format(accuracy = 1), limits = c(0, NA)) +
  labs(
    title = "Price remained the most visible discussion theme",
    subtitle = "Share of each year's comments matching the four keyword groups used in the original study.",
    x = NULL,
    y = "Share of collected comments",
    caption = "Themes are not mutually exclusive; a comment can match more than one keyword group."
  ) + theme_portfolio()
save_plot("discussion-themes-over-time.png", p_themes)

tokens <- comments |>
  unnest_tokens(word, body) |>
  filter(str_detect(word, "[a-z]"))
data(stopwords_de, package = "lsa")
german_stopwords <- tibble(word = stopwords_de)
tokens_clean <- tokens |>
  drop_na() |>
  anti_join(german_stopwords, by = "word") |>
  filter(
    !str_detect(word, "[0-9]"),
    !word %in% c("du", "gibt", "also", "https", "doch", "er", "dir", "z.b",
                 "amp", "etc", "paar", "a", "e", "ca", "mal", "musst", "schon",
                 "man", "vom", "gt")
  )

senti_source <- Sys.getenv("SENTIWS_PATH", unset = "https://osf.io/x89wq/?action=download")
sentiws <- read_csv(senti_source, show_col_types = FALSE)
sentiment_tokens <- tokens_clean |>
  inner_join(sentiws, by = "word", relationship = "many-to-many") |>
  mutate(value = as.numeric(value))

sentiment <- sentiment_tokens |>
  group_by(index, year) |>
  summarise(score = sum(value), .groups = "drop") |>
  mutate(polarity = if_else(score >= 0, "Positive", "Negative")) |>
  group_by(year) |>
  summarise(
    comments_scored = n(),
    mean_score = mean(score),
    negative_share = mean(polarity == "Negative"),
    .groups = "drop"
  )

p_negative <- ggplot(sentiment, aes(year, negative_share)) +
  geom_line(color = blue, linewidth = 1.2) +
  geom_point(color = blue, size = 3.2) +
  geom_text(aes(label = percent(negative_share, accuracy = 1)), vjust = -0.8, color = ink, size = 3.6) +
  scale_x_continuous(breaks = 2019:2022) +
  scale_y_continuous(labels = percent_format(accuracy = 1), limits = c(0.35, 0.60)) +
  labs(title = "Share classified as negative", x = NULL, y = NULL) +
  theme_portfolio(13) + theme(plot.title = element_text(size = 17))

p_mean <- ggplot(sentiment, aes(year, mean_score)) +
  geom_hline(yintercept = 0, color = ink, linewidth = 0.45) +
  geom_line(color = orange, linewidth = 1.2) +
  geom_point(color = orange, size = 3.2) +
  geom_text(aes(label = number(mean_score, accuracy = 0.01)), vjust = -0.8, color = ink, size = 3.6) +
  scale_x_continuous(breaks = 2019:2022) +
  scale_y_continuous(limits = c(-0.46, 0.04)) +
  labs(title = "Mean SentiWS score", x = NULL, y = NULL) +
  theme_portfolio(13) + theme(plot.title = element_text(size = 17))

p_sentiment <- (p_negative / p_mean) +
  plot_annotation(
    title = "Negative sentiment became less prevalent",
    subtitle = "Average scores remained below zero among comments containing at least one SentiWS match; the 2019 base is small.",
    caption = "SentiWS does not reliably capture context, negation, irony, or sarcasm. Results describe detected words, not respondents.",
    theme = theme_portfolio() + theme(plot.margin = margin(28, 34, 24, 30))
  )
save_plot("sentiment-over-time.png", p_sentiment, height = 8.5)

dir.create("data/derived", recursive = TRUE, showWarnings = FALSE)
write_csv(volume, "data/derived/comment-volume.csv")
write_csv(themes, "data/derived/discussion-themes.csv")
write_csv(sentiment, "data/derived/sentiment-by-year.csv")

message("Built three README figures and three compact summary files.")
