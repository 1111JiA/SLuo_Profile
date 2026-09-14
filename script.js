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
    nav.append(list, link(content.navigation.resumeLabel, content.links.resume, { className: "resume-button", arrow: false, external: true }));
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

  function hero() {
    const section = element("section", "hero container");
    section.id = "top";
    section.setAttribute("aria-labelledby", "hero-heading");
    section.tabIndex = -1;
    const copy = element("div", "hero-copy");
    const heading = element("h1", "hero-heading");
    heading.id = "hero-heading";
    content.hero.headlineLines.forEach(line => heading.append(element("span", "headline-line", line), " "));
    heading.append(element("em", "headline-accent", content.hero.headlineAccent));
    const introduction = element("div", "hero-introduction");
    introduction.append(element("p", "hero-background", content.hero.background), element("p", "hero-description", content.hero.description));
    const actions = element("div", "hero-actions");
    actions.append(link(content.hero.contactLabel, content.hero.contactTarget), link(content.hero.resumeLabel, content.links.resume, { download: true }));
    copy.append(element("p", "eyebrow", content.hero.label), heading, introduction, actions);
    section.append(copy, photo("portrait", "portrait", true));
    return section;
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

  function experience() {
    const { node, inner } = section("experience", content.experience);
    const entries = element("ol", "experience-list");
    content.experience.entries.forEach(item => {
      const entry = element("li", "experience-entry");
      const details = element("div", "experience-details");
      details.append(
        element("p", "experience-category", item.category),
        element("h3", "experience-title", item.title),
        element("p", "experience-institution", item.institution),
        element("p", "experience-description", item.description)
      );
      entry.append(element("p", "experience-date", item.date), details);
      entries.append(entry);
    });
    inner.append(entries);
    return node;
  }

  function work() {
    const { node, inner } = section("work", content.work);
    const grid = element("div", "work-grid");
    content.work.projects.forEach(item => {
      const card = element("article", "project-card");
      const body = element("div", "project-body");
      body.append(element("p", "eyebrow project-category", item.category), element("h3", "project-title", item.title));
      if (item.keyLine) body.append(element("p", "project-keyline", item.keyLine));
      body.append(element("p", "project-description", item.description), element("p", "project-methods", item.methods));
      if (item.linkLabel) {
        body.append(link(item.linkLabel, item.link, {
          className: "text-link project-link",
          external: true
        }));
      }
      card.append(photo(item.image, "project-image"), body);
      grid.append(card);
    });
    inner.append(grid);
    return node;
  }

  function skills() {
    const { node, inner } = section("skills", content.skills);
    const grid = element("div", "skills-grid");
    content.skills.groups.forEach(group => {
      const column = element("div", "skill-group");
      const list = element("ul", "skill-list");
      group.items.forEach(item => list.append(element("li", "", item)));
      column.append(element("h3", "eyebrow skill-heading", group.heading), list);
      grid.append(column);
    });
    inner.append(grid);
    return node;
  }

  function credentials() {
    const { node, inner } = section("credentials", content.credentials);
    const grid = element("ul", "credentials-grid");
    content.credentials.entries.forEach(item => {
      // Unknown or mistyped status values must never imply completion.
      const status = String(item.status || "").trim().toUpperCase();
      const completed = status === "COMPLETED";
      const row = element("li", "credential");
      const entry = link("", completed ? item.url : "", {
        className: "credential-link", arrow: false, external: true,
        unavailable: content.interface.missingCertificate
      });
      const text = element("div", "credential-text");
      const provider = element("div", "credential-provider-row");
      provider.append(element("span", "credential-provider", item.provider));
      if (!completed) {
        provider.append(element("span", "credential-status", status === "IN PREPARATION"
          ? content.interface.credentialStatuses.inPreparation : content.interface.credentialStatuses.planned));
      }
      text.append(provider, element("h3", "credential-name", item.name));
      entry.append(text, arrow(true));
      // Preserve the full name for screen readers, including disabled links.
      entry.setAttribute("aria-label", `${item.name}${!completed ? ` — ${status === "IN PREPARATION" ? content.interface.credentialStatuses.inPreparation : content.interface.credentialStatuses.planned}` : ""} — ${entry.hasAttribute("href") ? content.interface.newTab : content.interface.missingCertificate}`);
      row.append(entry);
      grid.append(row);
    });
    inner.append(grid);
    return node;
  }

  function about() {
    const { node, inner, intro } = section("about", content.about);
    intro.append(element("p", "about-description", content.about.description));
    const gallery = element("div", "about-gallery");
    gallery.dataset.count = content.about.photos.length;
    content.about.photos.forEach(key => gallery.append(photo(key, "about-photo")));
    inner.append(gallery);
    return node;
  }

  function contact() {
    const { node, inner } = section("contact", content.contact, "contact-section");
    const links = element("div", "contact-links");
    const email = content.links.email.trim();
    const emailUrl = email ? (email.startsWith("mailto:") ? email : `mailto:${email}`) : "";
    links.append(
      link(content.contact.emailLabel, emailUrl, { unavailable: content.interface.missingEmail }),
      link(content.contact.linkedinLabel, content.links.linkedin, { unavailable: content.interface.missingLinkedin, external: true }),
      link(content.contact.resumeLabel, content.links.resume, { external: true })
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
  main.append(hero(), experience(), work(), skills(), credentials(), about(), contact());
  root.append(skip, header(), main);
})();
