# Rebuild the three reader-facing figures embedded in README.md.
# Run from the repository root: Rscript analysis/build_readme_figures.R

suppressPackageStartupMessages({
  library(dplyr)
  library(ggplot2)
  library(ggrepel)
  library(patchwork)
  library(readr)
  library(scales)
  library(tidyr)
})

paper <- "#f7f6f2"
ink <- "#202c37"
muted <- "#657078"
blue <- "#567187"
orange <- "#b56f49"
line <- "#d8dad6"

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
      panel.grid.major.y = element_blank(),
      panel.grid.minor = element_blank(),
      panel.grid.major.x = element_line(color = line, linewidth = 0.35),
      strip.text = element_text(color = ink, face = "bold", size = 13),
      strip.background = element_blank(),
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

country <- read_csv("data/derived/country-summary.csv", show_col_types = FALSE)
models <- read_csv("data/derived/model-context-estimates.csv", show_col_types = FALSE) |>
  mutate(
    lower = estimate - 1.96 * std_error,
    upper = estimate + 1.96 * std_error,
    term = factor(term, levels = c("Gender × GII", "Gender inequality (GII)"))
  )

p_context <- ggplot(country, aes(gii, private_peb_mean)) +
  geom_smooth(method = "lm", se = TRUE, color = muted, fill = "#dce2e5", linewidth = 0.8) +
  geom_point(aes(size = n_total), color = blue, alpha = 0.9) +
  geom_text_repel(aes(label = country), color = ink, size = 3.4,
                  min.segment.length = 0, segment.color = line, max.overlaps = Inf) +
  scale_size_continuous(range = c(4, 10), guide = "none") +
  scale_x_continuous(labels = number_format(accuracy = 0.01)) +
  labs(
    title = "Private environmental behaviour varies with country context",
    subtitle = "Country means across 13 ISSP samples; point size reflects the analytical sample in each country.",
    x = "Gender Inequality Index (2021)",
    y = "Mean private PEB score (0–3)",
    caption = "Descriptive country means. The thesis models the relationship using individual controls and multilevel regression."
  ) + theme_portfolio()
save_plot("country-context-and-private-peb.png", p_context)

country_order <- country |> arrange(gii) |> pull(country) |> rev()

gap <- country |>
  select(country, gii, private_gender_gap, public_gender_gap) |>
  pivot_longer(ends_with("gender_gap"), names_to = "sphere", values_to = "gap") |>
  mutate(
    sphere = recode(sphere,
                    private_gender_gap = "Private behaviour",
                    public_gender_gap = "Public behaviour"),
    country = factor(country, levels = country_order)
  )

p_gap <- ggplot(gap, aes(gap, country, color = sphere)) +
  geom_vline(xintercept = 0, color = ink, linewidth = 0.45) +
  geom_segment(aes(x = 0, xend = gap, yend = country), color = line, linewidth = 1.1) +
  geom_point(size = 3.5) +
  facet_wrap(~sphere, scales = "free_x", nrow = 1) +
  scale_color_manual(values = c("Private behaviour" = blue, "Public behaviour" = orange), guide = "none") +
  labs(
    title = "Gender patterns differ across private and public behaviour",
    subtitle = "Positive values indicate higher average participation among women; countries are ordered by increasing GII.",
    x = "Mean difference: women minus men",
    y = NULL,
    caption = "Descriptive differences in the final analytical sample (N = 17,762)."
  ) + theme_portfolio() +
  theme(panel.spacing.x = unit(2, "lines"))
save_plot("gender-patterns-by-country.png", p_gap, height = 7.5)

p_models <- ggplot(models, aes(estimate, term)) +
  geom_vline(xintercept = 0, color = ink, linewidth = 0.45) +
  geom_errorbarh(aes(xmin = lower, xmax = upper), height = 0, color = muted, linewidth = 0.8) +
  geom_point(aes(color = significant), size = 4) +
  facet_wrap(~outcome, scales = "free_x", nrow = 1) +
  scale_color_manual(values = c(`TRUE` = blue, `FALSE` = "#aeb4b5"),
                     labels = c(`TRUE` = "95% interval excludes zero", `FALSE` = "Interval includes zero")) +
  labs(
      title = "Context effects differ by behavioural sphere",
    subtitle = "Selected contextual estimates from the final private (Model 3) and public (Model 6) multilevel models.",
    x = "Coefficient estimate with 95% confidence interval",
    y = NULL,
    caption = "GII was log-transformed in the thesis model. Estimates are reproduced from Tables 3 and 4."
  ) + theme_portfolio() +
  theme(panel.spacing.x = unit(2, "lines"))
save_plot("model-context-effects.png", p_models, height = 6.4)

message("Built three README figures in figures/.")
