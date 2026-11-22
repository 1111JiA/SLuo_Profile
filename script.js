/* Page structure and behavior. Edit your copy in content.js instead. */
(() => {
  "use strict";
  const content = window.PORTFOLIO_CONTENT;
  if (!content) return;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  // Insert copy as text, never as executable HTML.
  function arrow(external = false) {
    const node = element("span", "link-arrow", external ? content.interface.externalArrow : content.interface.arrow);
    node.setAttribute("aria-hidden", "true");
    return node;
  }

  function safeUrl(value) {
    if (typeof value !== "string" || !value.trim()) return "";
    const url = value.trim();
    // Accept local files, in-page anchors, email, and http(s) addresses only.
    if (/^[\u0000-\u0020]*[a-z][a-z0-9+.-]*:/i.test(url) && !/^(https?:|mailto:)/i.test(url)) return "";
    if (/[\u0000-\u001f\u007f]/.test(url)) return "";
    return url;
  }

  function link(label, url, options = {}) {
    const node = element("a", options.className || "text-link", label);
    const destination = safeUrl(url);
    if (options.arrow !== false) node.append(arrow(options.external));
    if (destination) {
      node.href = destination;
      if (options.external) {
        node.target = "_blank";
        node.rel = "noopener noreferrer";
        node.setAttribute("aria-label", `${label} (${content.interface.newTab})`);
      }
      if (options.download) node.setAttribute("download", "");
    } else {
      node.setAttribute("role", "link");
      node.setAttribute("aria-disabled", "true");
      node.title = options.unavailable || content.interface.missingLink;
      node.setAttribute("aria-label", `${label} — ${node.title}`);
    }
    return node;
  }

  function photo(key, extraClass = "", eager = false) {
    const config = content.images[key] || {};
    const frame = element("figure", `image-slot ${extraClass}`.trim());
    const placeholder = element("div", "image-placeholder");
    placeholder.setAttribute("role", "img");
    placeholder.setAttribute("aria-label", `${content.interface.imagePlaceholder}: ${config.placeholder || ""}`);
    placeholder.append(element("span", "placeholder-mark"));
    placeholder.append(element("span", "placeholder-label", config.placeholder || ""));
    frame.append(placeholder);

    const src = safeUrl(config.src);
    if (!src) return frame;
    const img = element("img");
    img.alt = config.alt || "";
    img.loading = eager ? "eager" : "lazy";
    img.decoding = "async";
    if (eager) img.setAttribute("fetchpriority", "high");
    img.style.objectFit = config.fit === "contain" ? "contain" : "cover";
    img.style.objectPosition = config.position || "center";
    const show = () => {
      if (!img.naturalWidth) return;
      frame.classList.add("has-image");
      placeholder.hidden = true;
      img.removeAttribute("aria-hidden");
    };
    const fail = () => {
      frame.classList.remove("has-image");
      placeholder.hidden = false;
      img.setAttribute("aria-hidden", "true");
    };
    img.setAttribute("aria-hidden", "true");
    img.addEventListener("load", show);
    img.addEventListener("error", fail);
    frame.append(img);
    img.src = src;
    if (img.complete && img.naturalWidth) show();
    return frame;
  }

  function header() {
    const head = element("header", "site-header");
    const inner = element("div", "header-inner container");
    const brand = link(content.navigation.brand, content.navigation.home, { className: "brand", arrow: false });
    brand.setAttribute("aria-label", `${content.navigation.brand} — ${content.interface.homeLabel}`);
    const nav = element("nav", "site-nav");
    nav.id = "site-navigation";
    nav.setAttribute("aria-label", content.interface.navigationLabel);
    const list = element("ul", "nav-list");
    content.navigation.items.forEach(item => {
      const li = element("li");
      li.append(link(item.label, item.target, { className: "nav-link", arrow: false }));
      list.append(li);
    });
    nav.append(list, link(content.navigation.resumeLabel, content.links.resume, { className: "resume-button", arrow: false, external: true, unavailable: content.interface.missingResume }));
    const toggle = element("button", "menu-toggle", content.interface.menuOpen);
    toggle.type = "button";
    toggle.setAttribute("aria-controls", nav.id);
    toggle.setAttribute("aria-expanded", "false");
    const close = () => {
      head.classList.remove("menu-is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = content.interface.menuOpen;
    };
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      head.classList.toggle("menu-is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? content.interface.menuClose : content.interface.menuOpen;
    });
    nav.addEventListener("click", event => {
      const target = event.target.closest("a[href]");
      if (!target) return;
      close();
      if (target.hash && target.origin === window.location.origin && target.pathname === window.location.pathname) {
        document.getElementById(target.hash.slice(1))?.focus({ preventScroll: true });
      }
    });
    head.addEventListener("keydown", event => {
      if (event.key === "Escape" && head.classList.contains("menu-is-open")) {
        close();
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 761px)").addEventListener("change", close);
    inner.append(brand, toggle, nav);
    head.append(inner);
    return head;
  }

  function home() {
    const node = element("section", "hero container");
    node.id = "top";
    node.tabIndex = -1;
    node.setAttribute("aria-labelledby", "home-heading");
    const copy = element("div", "hero-copy");
    const title = element("h1", "hero-heading", content.home.name);
    title.id = "home-heading";
    const about = element("div", "home-about");
    about.append(element("h2", "about-heading", content.home.aboutHeading));
    content.home.paragraphs.forEach(text => about.append(element("p", "about-paragraph", text)));
    copy.append(element("p", "eyebrow", content.home.label), title,
      element("p", "professional-identity", content.home.identity), about);
    node.append(copy, photo("portrait", "portrait", true));
    return node;
  }

  function section(id, data, className = "") {
    const node = element("section", `section ${className}`.trim());
    node.id = id;
    node.tabIndex = -1;
    node.setAttribute("aria-labelledby", `${id}-heading`);
    const inner = element("div", "container");
    const heading = element("h2", "section-heading", data.heading);
    heading.id = `${id}-heading`;
    const intro = element("div", "section-intro");
    intro.append(element("p", "eyebrow", data.label), heading);
    inner.append(intro);
    node.append(inner);
    return { node, inner, intro };
  }

  function timeline(items) {
    const list = element("ol", "experience-list");
    items.forEach(item => {
      const entry = element("li", "experience-entry");
      const details = element("div", "experience-details");
      details.append(element("p", "experience-category", item.category),
        element("h3", "experience-title", item.title),
        element("p", "experience-institution", item.institution));
      if (item.grade) details.append(element("p", "entry-grade", item.grade));
      if (item.bullets?.length) {
        const bullets = element("ul", "entry-bullets");
        item.bullets.forEach(text => bullets.append(element("li", "", text)));
        details.append(bullets);
      }
      if (item.research?.length) {
        const research = element("div", "degree-research");
        research.append(element("h4", "eyebrow", item.researchHeading));
        const links = element("ul", "research-links");
        item.research.forEach(project => {
          const row = element("li");
          row.append(link(project.title, project.link, { className: "research-link", external: true }),
            element("p", "research-description", project.description));
          links.append(row);
        });
        research.append(links);
        details.append(research);
      }
      entry.append(element("p", "experience-date", item.date), details);
      list.append(entry);
    });
    return list;
  }

  function experience() {
    const { node, inner } = section("experience", content.experience);
    inner.append(timeline(content.experience.entries));
    return node;
  }

  function education() {
    const { node, inner } = section("education", content.education);
    inner.append(timeline(content.education.entries));
    const skills = element("div", "technical-skills");
    skills.append(element("h3", "subsection-heading", content.skills.heading));
    const list = element("ul", "skills-grid");
    content.skills.entries.forEach(skill => {
      const item = element("li", "skill-item");
      item.append(element("h4", "skill-name", skill.name), element("p", "skill-level", skill.level));
      if (skill.detail) item.append(element("p", "skill-detail", skill.detail));
      list.append(item);
    });
    skills.append(list);
    const languages = element("div", "language-section");
    languages.append(element("h3", "subsection-heading", content.skills.languagesHeading));
    const languageList = element("ul", "language-list");
    content.skills.languages.forEach(language => {
      const item = element("li");
      item.append(element("h4", "skill-name", language.name), element("p", "skill-level", language.level));
      languageList.append(item);
    });
    languages.append(languageList);
    const interests = element("div", "interests");
    interests.append(element("h3", "subsection-heading", content.skills.interestsHeading));
    const interestList = element("ul", "interest-list");
    content.skills.interests.forEach(text => interestList.append(element("li", "", text)));
    interests.append(interestList);
    inner.append(skills, languages, interests);
    return node;
  }

  function contact() {
    const { node, inner } = section("contact", content.contact, "contact-section");
    const links = element("div", "contact-links");
    const email = content.links.email.trim();
    const emailUrl = email ? (email.startsWith("mailto:") ? email : `mailto:${email}`) : "";
    links.append(
      link(content.contact.resumeLabel, content.links.resume, { external: true, unavailable: content.interface.missingResume }),
      link(content.contact.githubLabel, content.links.github, { external: true }),
      link(content.contact.linkedinLabel, content.links.linkedin, { unavailable: content.interface.missingLinkedin, external: true }),
      link(content.contact.emailLabel, emailUrl, { unavailable: content.interface.missingEmail })
    );
    // Contact CTAs use the approved right arrow, even when opening a new tab.
    links.querySelectorAll(".link-arrow").forEach(item => { item.textContent = content.interface.arrow; });
    const footer = element("footer", "site-footer", content.contact.footer);
    inner.append(links, footer);
    return node;
  }

  document.title = content.meta.title;
  document.documentElement.lang = content.meta.language;
  document.querySelector('meta[name="description"]').content = content.meta.description;
  const root = document.getElementById("portfolio");
  const skip = link(content.interface.skipLink, "#main", { className: "skip-link", arrow: false });
  const main = element("main");
  main.id = "main";
  main.tabIndex = -1;
  main.append(home(), experience(), education(), contact());
  root.append(skip, header(), main);
})();
