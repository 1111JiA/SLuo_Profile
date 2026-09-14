"""Build the recruiter-facing PDF report from verified project outputs."""

from __future__ import annotations

import csv
from collections import defaultdict
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Image,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "paper" / "Organic-food-attitudes-on-German-Reddit.pdf"
FIGURES = ROOT / "figures"
DERIVED = ROOT / "data" / "derived"

NAVY = colors.HexColor("#172633")
BLUE = colors.HexColor("#5E7D92")
ORANGE = colors.HexColor("#BC7349")
GREEN = colors.HexColor("#718979")
MUTED = colors.HexColor("#687681")
PALE = colors.HexColor("#F4F2ED")
LINE = colors.HexColor("#D8DCD9")
WHITE = colors.white

PAGE_W, PAGE_H = A4
LEFT = 20 * mm
RIGHT = 20 * mm
TOP = 20 * mm
BOTTOM = 18 * mm
CONTENT_W = PAGE_W - LEFT - RIGHT


def read_csv(name: str) -> list[dict[str, str]]:
    with (DERIVED / name).open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


volume_rows = read_csv("comment-volume.csv")
sentiment_rows = read_csv("sentiment-by-year.csv")
theme_rows = read_csv("discussion-themes.csv")

annual = defaultdict(dict)
for row in volume_rows:
    annual[int(row["year"])][row["subreddit"]] = int(row["n"])

theme_totals = defaultdict(int)
for row in theme_rows:
    theme_totals[row["theme"]] += int(row["comments_matching"])


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="ReportTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=29,
        leading=34,
        textColor=NAVY,
        alignment=TA_LEFT,
        spaceAfter=7 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="ReportSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=15,
        leading=20,
        textColor=MUTED,
        spaceAfter=10 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="SectionTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=21,
        leading=25,
        textColor=NAVY,
        spaceAfter=6 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="Subhead",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=12.5,
        leading=16,
        textColor=NAVY,
        spaceBefore=3 * mm,
        spaceAfter=2 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="BodyClean",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=10.2,
        leading=15.2,
        textColor=NAVY,
        spaceAfter=3.2 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="BodySmall",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=8.8,
        leading=12.5,
        textColor=MUTED,
        spaceAfter=2.5 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="Caption",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=12,
        textColor=MUTED,
        spaceBefore=2.2 * mm,
        alignment=TA_LEFT,
    )
)
styles.add(
    ParagraphStyle(
        name="Metric",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=23,
        textColor=NAVY,
        alignment=TA_CENTER,
    )
)
styles.add(
    ParagraphStyle(
        name="MetricLabel",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.3,
        leading=10.5,
        textColor=MUTED,
        alignment=TA_CENTER,
    )
)
styles.add(
    ParagraphStyle(
        name="BulletClean",
        parent=styles["BodyClean"],
        leftIndent=5 * mm,
        firstLineIndent=-3.5 * mm,
        bulletIndent=0,
        spaceAfter=2.2 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="CoverMeta",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=15,
        textColor=MUTED,
    )
)
styles.add(
    ParagraphStyle(
        name="Tag",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8.5,
        leading=11,
        textColor=WHITE,
        alignment=TA_CENTER,
    )
)


def para(text: str, style: str = "BodyClean") -> Paragraph:
    return Paragraph(text, styles[style])


def bullet(text: str) -> Paragraph:
    return Paragraph(text, styles["BulletClean"], bulletText="-")


def section(title: str) -> list:
    return [Paragraph(title, styles["SectionTitle"]), Table([[""]], colWidths=[22 * mm], rowHeights=[1.5 * mm], style=TableStyle([("BACKGROUND", (0, 0), (-1, -1), ORANGE), ("LINEBELOW", (0, 0), (-1, -1), 0, ORANGE)])), Spacer(1, 5 * mm)]


def callout(text: str, color=BLUE) -> Table:
    table = Table([[Paragraph(text, styles["BodyClean"])]], colWidths=[CONTENT_W])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PALE),
                ("BOX", (0, 0), (-1, -1), 0.7, LINE),
                ("LINEBEFORE", (0, 0), (0, -1), 4, color),
                ("LEFTPADDING", (0, 0), (-1, -1), 6 * mm),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5 * mm),
                ("TOPPADDING", (0, 0), (-1, -1), 4 * mm),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2 * mm),
            ]
        )
    )
    return table


def metric_cards() -> Table:
    items = [
        ("1,827", "German-language comments"),
        ("2019-2022", "Observation period"),
        ("2", "Subreddit communities"),
    ]
    cells = []
    for value, label in items:
        cells.append([Paragraph(value, styles["Metric"]), Paragraph(label, styles["MetricLabel"])])
    table = Table([cells], colWidths=[CONTENT_W / 3] * 3, rowHeights=[24 * mm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PALE),
                ("BOX", (0, 0), (-1, -1), 0.7, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.7, LINE),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 4 * mm),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
            ]
        )
    )
    return table


def image_with_caption(filename: str, caption: str, max_height: float) -> KeepTogether:
    path = FIGURES / filename
    image = Image(str(path))
    image._restrictSize(CONTENT_W, max_height)
    image.hAlign = "CENTER"
    return KeepTogether([image, Paragraph(caption, styles["Caption"])])


def data_table(data, widths) -> Table:
    table = Table(data, colWidths=widths, repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), NAVY),
                ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 8.8),
                ("LEADING", (0, 0), (-1, -1), 11),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, PALE]),
                ("GRID", (0, 0), (-1, -1), 0.4, LINE),
                ("ALIGN", (1, 1), (-1, -1), "RIGHT"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 2.5 * mm),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5 * mm),
                ("LEFTPADDING", (0, 0), (-1, -1), 3 * mm),
                ("RIGHTPADDING", (0, 0), (-1, -1), 3 * mm),
            ]
        )
    )
    return table


def draw_page(canvas, doc):
    page = canvas.getPageNumber()
    canvas.saveState()
    if page == 1:
        canvas.setFillColor(NAVY)
        canvas.rect(0, PAGE_H - 14 * mm, PAGE_W, 14 * mm, fill=1, stroke=0)
        canvas.setFillColor(ORANGE)
        canvas.rect(0, PAGE_H - 16 * mm, PAGE_W, 2 * mm, fill=1, stroke=0)
    else:
        canvas.setStrokeColor(LINE)
        canvas.setLineWidth(0.5)
        canvas.line(LEFT, PAGE_H - 13 * mm, PAGE_W - RIGHT, PAGE_H - 13 * mm)
        canvas.setFont("Helvetica", 7.8)
        canvas.setFillColor(MUTED)
        canvas.drawString(LEFT, PAGE_H - 10 * mm, "ORGANIC FOOD ATTITUDES IN GERMAN REDDIT DISCUSSIONS")
        canvas.drawRightString(PAGE_W - RIGHT, 10 * mm, str(page))
    canvas.restoreState()


story = []

# Cover
story.append(Spacer(1, 20 * mm))
tag = Table([[Paragraph("PORTFOLIO RESEARCH REPORT", styles["Tag"])]], colWidths=[54 * mm], rowHeights=[8 * mm])
tag.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), ORANGE), ("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))
story.append(tag)
story.append(Spacer(1, 15 * mm))
story.append(Paragraph("Is the COVID-19 Pandemic a Chance for Organic Food in Germany?", styles["ReportTitle"]))
story.append(Paragraph("Evidence from Reddit", styles["ReportSubtitle"]))
story.append(metric_cards())
story.append(Spacer(1, 15 * mm))
story.append(callout("This portfolio edition presents the verified study design, principal findings, interpretation limits, and reproducibility materials from the original term-paper source.", ORANGE))
story.append(Spacer(1, 15 * mm))
story.append(Paragraph("Shengjia Luo", styles["Subhead"]))
story.append(Paragraph("Ludwig-Maximilians-Universität München<br/>Original term paper: 2023<br/>Portfolio edition prepared from the archived Qmd source and verified project outputs", styles["CoverMeta"]))
story.append(PageBreak())

# Executive summary
story.extend(section("Executive summary"))
story.append(para("This project examines how organic food was discussed in two German-language Reddit communities before and during the COVID-19 period. It combines API-based data collection, German text preprocessing, keyword analysis, and lexicon-based sentiment scoring."))
story.append(Paragraph("Research questions", styles["Subhead"]))
story.append(bullet("Can Reddit text analysis reveal patterns in attitudes toward organic food, including changes around the COVID-19 period?"))
story.append(bullet("How did discussions of health, taste, environmental impact, and price develop between 2019 and 2022?"))
story.append(Spacer(1, 3 * mm))
story.append(Paragraph("Principal findings", styles["Subhead"]))
story.append(bullet("The collected discussion volume rose from <b>118 comments in 2020</b> to <b>540 in 2021</b> and <b>1,121 in 2022</b>."))
story.append(bullet("Price was the most frequently matched study theme: <b>534 comments</b>, compared with 295 health, 232 taste, and 140 environmental matches."))
story.append(bullet("Among comments with at least one SentiWS match, the share classified as negative declined from <b>49% in 2020</b> to <b>44% in 2022</b>, while average annual sentiment remained below zero."))
story.append(Spacer(1, 4 * mm))
story.append(callout("The evidence describes a keyword-matched Reddit corpus. It does not establish that the pandemic caused a population-level change in attitudes or purchasing behaviour.", BLUE))
story.append(Spacer(1, 6 * mm))
story.append(Paragraph("Research contribution", styles["Subhead"]))
story.append(para("I defined the collection keywords, gathered and prepared the Reddit data in R, developed the German-language text-processing workflow, applied the sentiment lexicon, compared discussion themes over time, and wrote the original term paper."))
story.append(PageBreak())

# Research design
story.extend(section("Research design"))
story.append(para("The study used public comments from r/de and r/FragReddit collected for 2019-2022 through organic-food keyword searches. The workflow combined collection, cleaning, tokenisation, thematic keyword matching, and German-language sentiment scoring."))
flow = [
    [para("<b>1. Collect</b><br/>PSAWR and Pushshift keyword searches", "BodySmall"), para("<b>2. Prepare</b><br/>Deduplicate, clean, and tokenize German text", "BodySmall"), para("<b>3. Analyse</b><br/>Theme matching and SentiWS scoring", "BodySmall"), para("<b>4. Interpret</b><br/>Compare years and state evidence limits", "BodySmall")]
]
flow_table = Table(flow, colWidths=[CONTENT_W / 4] * 4, rowHeights=[29 * mm])
flow_table.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), PALE), ("BOX", (0, 0), (-1, -1), 0.6, LINE), ("INNERGRID", (0, 0), (-1, -1), 0.6, LINE), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm), ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm)]))
story.append(flow_table)
story.append(Spacer(1, 7 * mm))
story.append(Paragraph("Analytical scope", styles["Subhead"]))
story.append(bullet("Corpus: 1,827 comments across four calendar years."))
story.append(bullet("Communities: r/de and r/FragReddit."))
story.append(bullet("Theme groups: health, taste, environment, and price."))
story.append(bullet("Sentiment method: SentiWS lexicon scores aggregated within comments."))
story.append(Spacer(1, 5 * mm))
volume_table = [["Year", "r/de", "r/FragReddit", "Total"]]
for year in sorted(annual):
    de = annual[year].get("de", 0)
    frag = annual[year].get("FragReddit", 0)
    volume_table.append([str(year), f"{de:,}", f"{frag:,}", f"{de + frag:,}"])
story.append(data_table(volume_table, [35 * mm, 38 * mm, 45 * mm, 38 * mm]))
story.append(Paragraph("Table 1. Collected comments by year and subreddit.", styles["Caption"]))
story.append(Spacer(1, 6 * mm))
story.append(callout("The number of comments is a property of the collection design and keyword query. It should not be interpreted as a direct measure of market demand.", GREEN))
story.append(PageBreak())

# Volume result
story.extend(section("Result 1: discussion volume"))
story.append(para("The collected discussion volume rose sharply after 2020, from 118 comments in 2020 to 540 in 2021 and 1,121 in 2022. Prior to 2021, most comments in the corpus came from r/de; by 2022, the counts from the two communities were similar."))
story.append(Spacer(1, 3 * mm))
story.append(image_with_caption("comment-volume-by-year.png", "Figure 1. Annual comment counts in the collected corpus, split by subreddit.", 108 * mm))
story.append(Spacer(1, 6 * mm))
story.append(callout("The increase supports a finding about the visibility of organic-food discussion within this collected corpus. It does not prove that overall German consumer interest increased by the same amount.", BLUE))
story.append(PageBreak())

# Themes result
story.extend(section("Result 2: discussion themes"))
story.append(para("Price was the most frequently matched of the four study themes. Across the full corpus, price-related terms appeared in 534 comments, compared with 295 health matches, 232 taste matches, and 140 environmental matches. Health-related discussion became more visible after 2020, while environmental terms remained the least frequently matched group."))
story.append(Spacer(1, 3 * mm))
story.append(image_with_caption("discussion-themes-over-time.png", "Figure 2. Annual share of collected comments matching each keyword group. Groups are not mutually exclusive.", 105 * mm))
story.append(Spacer(1, 5 * mm))
theme_table = [["Theme", "Comments matched"]]
for theme in ["Price", "Health", "Taste", "Environment"]:
    theme_table.append([theme, f"{theme_totals[theme]:,}"])
story.append(data_table(theme_table, [90 * mm, 66 * mm]))
story.append(PageBreak())

# Sentiment result
story.extend(section("Result 3: sentiment patterns"))
story.append(para("Each detected SentiWS term contributed a polarity score. Comment-level scores were calculated by summing matched terms; comments with scores below zero were classified as negative. The proportion classified as negative declined over time, but average annual scores remained below zero."))
story.append(Spacer(1, 2 * mm))
story.append(image_with_caption("sentiment-over-time.png", "Figure 3. Negative classification share and mean SentiWS score among comments with at least one lexicon match.", 119 * mm))
story.append(Spacer(1, 4 * mm))
sentiment_table = [["Year", "Comments scored", "Mean score", "Negative share"]]
for row in sentiment_rows:
    sentiment_table.append([
        row["year"],
        f"{int(row['comments_scored']):,}",
        f"{float(row['mean_score']):.3f}",
        f"{100 * float(row['negative_share']):.0f}%",
    ])
story.append(data_table(sentiment_table, [31 * mm, 43 * mm, 42 * mm, 40 * mm]))
story.append(PageBreak())

# Interpretation
story.extend(section("Interpretation and limits"))
story.append(Paragraph("Interpretation", styles["Subhead"]))
story.append(para("The results point to a discussion shaped strongly by price and personal product experience. Health gained visibility during the pandemic period, while environmental language appeared less often. The sentiment trend suggests that negative language became less prevalent within the scored subset, without demonstrating a positive overall polarity."))
story.append(para("Because the design observes keyword-matched comments rather than the same users over time, the findings do not establish that the pandemic caused a change in public opinion. Consumer expression, purchase intention, and observed purchasing behaviour represent different forms of evidence."))
story.append(Paragraph("Limitations", styles["Subhead"]))
story.append(bullet("The data come from two subreddits and do not represent the German population."))
story.append(bullet("User nationality and residence cannot be verified."))
story.append(bullet("The 2019 base is small, with 48 collected comments."))
story.append(bullet("Manual keyword groups may omit relevant language or include off-topic uses."))
story.append(bullet("Lexicon-based sentiment has limited sensitivity to German context, irony, sarcasm, and negation."))
story.append(Spacer(1, 5 * mm))
story.append(callout("The report separates descriptive patterns from causal claims. The figures show what appeared in the collected corpus and how the selected measures changed; they do not infer individual behaviour.", ORANGE))
story.append(Spacer(1, 8 * mm))
story.append(Paragraph("Practical value", styles["Subhead"]))
story.append(para("The workflow demonstrates research design, API-based data collection, unstructured-text preparation, German-language sentiment analysis, data visualisation, analytical judgement, and concise insight communication."))
story.append(PageBreak())

# Reproducibility and sources
story.extend(section("Reproducibility and sources"))
story.append(Paragraph("Repository materials", styles["Subhead"]))
files = [
    ("analysis/Term-paper.qmd", "Original term-paper narrative and analysis source."),
    ("analysis/Data-Collection.qmd", "Original data-collection procedure and search terms."),
    ("analysis/build_readme_figures.R", "Rebuilds the three verified visual summaries."),
    ("data/Dataset.csv", "Archived 1,827-comment corpus."),
    ("data/derived/", "Compact aggregates used for figures and verification."),
    ("data/README.md", "Field definitions, provenance, ethics, and interpretation limits."),
]
repo_data = [["File", "Purpose"]] + [
    [Paragraph(name, styles["BodySmall"]), Paragraph(purpose, styles["BodySmall"])]
    for name, purpose in files
]
story.append(data_table(repo_data, [58 * mm, 98 * mm]))
story.append(Spacer(1, 7 * mm))
story.append(Paragraph("Method resources", styles["Subhead"]))
story.append(bullet("Reddit comments were collected in the original study through PSAWR and the Pushshift interface."))
story.append(bullet("German-language sentiment scoring uses SentiWS, available at <link href='https://osf.io/x89wq/' color='#5E7D92'>https://osf.io/x89wq/</link>."))
story.append(bullet("The original academic source remains available in Qmd format. The supplied archive did not include its separate references.bib file, so this portfolio edition cites the method resources directly and preserves the Qmd as the authoritative full source."))
story.append(Spacer(1, 6 * mm))
story.append(Paragraph("Responsible reuse", styles["Subhead"]))
story.append(para("The corpus contains public comments but should still be handled carefully. It should not be used to identify, contact, profile, or quote individual users. Any redistribution or extension should follow current platform terms and relevant research-ethics requirements."))
story.append(Spacer(1, 6 * mm))
story.append(callout("Suggested citation: Luo, Shengjia. <i>Is the COVID-19 Pandemic a Chance for Organic Food in Germany? Evidence from Reddit.</i> Term paper, Ludwig-Maximilians-Universität München, 2023.", GREEN))


OUTPUT.parent.mkdir(parents=True, exist_ok=True)
document = SimpleDocTemplate(
    str(OUTPUT),
    pagesize=A4,
    rightMargin=RIGHT,
    leftMargin=LEFT,
    topMargin=TOP,
    bottomMargin=BOTTOM,
    title="Is the COVID-19 Pandemic a Chance for Organic Food in Germany? Evidence from Reddit",
    author="Shengjia Luo",
    subject="Portfolio research report based on the original term-paper source",
)
document.build(story, onFirstPage=draw_page, onLaterPages=draw_page)
print(f"Created {OUTPUT}")
