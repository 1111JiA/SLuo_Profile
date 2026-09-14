/*
 * YOUR PORTFOLIO CONTENT
 * ======================
 * Normally, edit only the text inside double quotation marks.
 * Keep the commas, brackets, and property names in place.
 * An apostrophe is fine: "I'm interested in research."
 * For a double quote within text, write \"like this\".
 * Save this file, then refresh index.html in your browser.
 * Full instructions are in HOW_TO_EDIT.md.
 */

window.PORTFOLIO_CONTENT = {
  // 01. PAGE TITLE AND CONTACT DETAILS
  // Leave unavailable details empty. Empty links are visibly disabled.
  meta: {
    title: "Shengjia Luo · Portfolio & Research",
    description: "With an interest in what people want, why markets move, and where businesses can improve.",
    language: "en"
  },
  links: {
    email: "luoshengjia01@gmail.com",
    linkedin: "https://www.linkedin.com/in/luoshengjia/",
    resume: ""
  },

  // 02. NAVIGATION
  // Keep section targets as written unless you change the page structure.
  navigation: {
    brand: "SHENGJIA LUO",
    home: "#top",
    items: [
      { label: "EXPERIENCE", target: "#experience" },
      { label: "WORK", target: "#work" },
      { label: "SKILLS", target: "#skills" },
      { label: "ABOUT", target: "#about" },
      { label: "CONTACT", target: "#contact" }
    ],
    resumeLabel: "RESUME"
  },

  // 03. HERO
  hero: {
    label: "",
    headlineLines: ["Bridging People,", "Data, and"],
    headlineAccent: "Real-World Decisions.",
    background: "Social science background × entrepreneurship",
    description: "With an interest in what people want, why markets move, and where businesses can improve.",
    contactLabel: "CONTACT ME",
    contactTarget: "#contact",
    resumeLabel: "DOWNLOAD RESUME"
  },

  // 04. EXPERIENCE — add or edit entries here, keeping the same fields.
  experience: {
    label: "02 / BACKGROUND",
    heading: "From Research to Real-World Practice",
    entries: [
      {
        date: "2020 — 2024",
        category: "Undergraduate Degree",
        title: "B.A. in Sociology, Minor in Statistics",
        institution: "LMU Munich",
        description: "Investigated human behaviour using quantitative and qualitative methods, and learned how to turn social questions into research that can be tested with data."
      },
      {
        date: "2026",
        category: "Entrepreneurship",
        title: "Founder — FERO CASA",
        institution: "DTC Brand · China",
        description: "Built and independently ran a pet-lifestyle brand from scratch, covering market research, brand positioning, sourcing, pricing, content, and e-commerce operations."
      },
      {
        date: "2026 — PRESENT",
        category: "Graduate Studies",
        title: "M.Sc. Survey Statistics and Data Analysis",
        institution: "University of Bamberg",
        description: "Currently building stronger skills in survey statistics, data analysis, statistical modelling, and computational methods."
      }
    ]
  },

  // 05. SELECTED WORK — keep keyLine empty when no key line is needed.
  // "image" refers to a named image slot in section 10 below.
  work: {
    label: "03 / PORTFOLIO",
    heading: "Selected Work",
    projects: [
      {
        category: "01 / ENTREPRENEURSHIP",
        title: "Building a Brand from Scratch",
        keyLine: "",
        description: "Learned how to work with people, solve problems, and make product decisions shaped by demand, cost, suppliers, and timing.",
        methods: "Market Research · Product Strategy · Pricing · Sourcing",
        image: "feroCasa",
        linkLabel: "",
        link: ""
      },
      {
        category: "02 / QUANTITATIVE RESEARCH",
        title: "When Country Context Changes Behaviour",
        keyLine: "13 Countries · 17,762 Respondents",
        description: "Studied how group differences change across social contexts.",
        methods: "R · PCA · Multilevel Regression",
        image: "crossNational",
        linkLabel: "VIEW RESEARCH",
        link: "https://github.com/1111JiA/SLuo_Profile/tree/main/research/cross-national-environmental-behaviour"
      },
      {
        category: "03 / SOCIAL LISTENING",
        title: "Reading Public Attitudes Online",
        keyLine: "1,827 Reddit Comments · 50 YouTube Videos",
        description: "Reddit + YouTube research on topics, sentiment, and online discussion.",
        methods: "R · APIs · Topic Modelling · Sentiment Analysis",
        image: "socialListening",
        linkLabel: "VIEW REDDIT RESEARCH",
        link: "https://github.com/1111JiA/SLuo_Profile/tree/main/research/reddit-organic-food-research"
      }
    ]
  },

  // 06. SKILLS & TOOLS — the complete approved list.
  skills: {
    label: "04 / CAPABILITIES",
    heading: "Skills & Tools",
    groups: [
      {
        heading: "RESEARCH & Analysis",
        items: [
          "Quantitative & Qualitative Research",
          "Market Research & Social Listening",
          "Regression & Multilevel Modelling",
          "PCA",
          "Topic & Sentiment Analysis",
          "API-Based Data Collection",
          "AI-Assisted Research Workflow"
        ]
      },
      {
        heading: "BUSINESS",
        items: [
          "Market & Competitor Analysis",
          "Product Strategy",
          "Pricing",
          "Supplier Sourcing & Evaluation",
          "Content Strategy",
          "E-commerce Operations"
        ]
      },
      {
        heading: "TOOLS",
        items: [
          "R",
          "Stata",
          "Python",
          "Excel",
          "Power Query",
          "PowerPoint",
          "Generative AI (Lovart, Midjourney)",
          "LLM Applications (ChatGPT, Gemini, Claude)"
        ]
      },
      {
        heading: "LANGUAGES",
        items: [
          "Mandarin Chinese — Native",
          "English — Professional Working Proficiency",
          "German — Professional Working Proficiency"
        ]
      }
    ]
  },

  // 07. CREDENTIALS
  // All are PLANNED, as confirmed. Status may be "PLANNED",
  // "IN PREPARATION", or "COMPLETED". COMPLETED hides the status badge.
  // Add your actual certificate/verification URL only after completion.
  // Links stay disabled unless the status is COMPLETED and url is filled in.
  credentials: {
    label: "05 / CERTIFICATIONS",
    heading: "Credentials",
    entries: [
      { provider: "HackerRank", name: "HackerRank SQL Intermediate", status: "PLANNED", url: "" },
      { provider: "DataCamp", name: "DataCamp SQL Associate", status: "PLANNED", url: "" },
      { provider: "DataCamp", name: "DataCamp Python Data Associate", status: "PLANNED", url: "" },
      { provider: "Microsoft", name: "Microsoft Certified: Power BI Data Analyst Associate (PL-300)", status: "PLANNED", url: "" },
      { provider: "Microsoft", name: "Microsoft Applied Skills: Create and Manage Automated Processes with Power Automate", status: "PLANNED", url: "" },
      { provider: "Microsoft", name: "Microsoft Office Specialist: Excel Associate (MO-210)", status: "PLANNED", url: "" },
      { provider: "GitHub", name: "GitHub Foundations", status: "PLANNED", url: "" }
    ]
  },

  // 08. ABOUT
  about: {
    label: "06 / PERSONAL",
    heading: "The Human Behind the CV",
    description: "Outside of work, you'll usually find me exploring somewhere new, spending time outdoors, or trying something I haven't done before.",
    // To show only four photos, remove the final , "about05" below.
    photos: ["about01", "about02", "about03", "about04", "about05"]
  },

  // 09. CONTACT AND FOOTER — contact addresses are in section 01.
  contact: {
    label: "07 / CONTACT",
    heading: "Let's get in touch.",
    emailLabel: "EMAIL ME",
    linkedinLabel: "LINKEDIN",
    resumeLabel: "RESUME",
    footer: "Shengjia Luo · 2026"
  },

  // 10. ALL IMAGE SLOTS
  // Replace files in assets/ using these exact names, or change "src".
  // "alt" describes the real image for screen readers; update it with the photo.
  // "placeholder" appears only when the image is missing or cannot be loaded.
  // "fit": "cover" fills the slot and crops; "contain" shows the whole image.
  // "position": "center", "center top", or percentages such as "50% 35%".
  images: {
    portrait: {
      src: "assets/portrait.jpg", alt: "Portrait of SJ Luo",
      placeholder: "Portrait", fit: "cover", position: "center"
    },
    feroCasa: {
      src: "assets/fero-casa.jpg", alt: "FERO CASA pet-lifestyle brand photograph",
      placeholder: "FERO CASA", fit: "cover", position: "center"
    },
    crossNational: {
      src: "assets/cross-national.png", alt: "Cross-national research visualization of the Gender Inequality Index and private pro-environmental behaviour",
      placeholder: "Cross-national research", fit: "contain", position: "center"
    },
    socialListening: {
      src: "assets/social-listening.png", alt: "German Reddit organic-food research: negative sentiment share and mean SentiWS score from 2019 to 2022",
      placeholder: "Social Listening", fit: "contain", position: "center"
    },
    about01: {
      src: "assets/about-01.jpg", alt: "Personal photograph 1",
      placeholder: "01", fit: "cover", position: "center"
    },
    about02: {
      src: "assets/about-02.jpg", alt: "Personal photograph 2",
      placeholder: "02", fit: "cover", position: "center"
    },
    about03: {
      src: "assets/about-03.jpg", alt: "Personal photograph 3",
      placeholder: "03", fit: "cover", position: "center"
    },
    about04: {
      src: "assets/about-04.jpg", alt: "Personal photograph 4",
      placeholder: "04", fit: "cover", position: "center"
    },
    about05: {
      src: "assets/about-05.jpg", alt: "Personal photograph 5",
      placeholder: "05", fit: "cover", position: "center"
    }
  },

  // 11. SMALL INTERFACE LABELS AND ACCESSIBILITY TEXT
  interface: {
    skipLink: "Skip to content",
    navigationLabel: "Main navigation",
    menuOpen: "MENU",
    menuClose: "CLOSE",
    homeLabel: "Back to top",
    imagePlaceholder: "Image placeholder",
    missingLink: "Link will be added soon",
    missingEmail: "Email address will be added soon",
    missingLinkedin: "LinkedIn link will be added soon",
    missingCertificate: "Certificate link is not yet available",
    newTab: "opens in a new tab",
    arrow: "→",
    externalArrow: "↗",
    credentialStatuses: {
      planned: "PLANNED",
      inPreparation: "IN PREPARATION"
    }
  }
};
