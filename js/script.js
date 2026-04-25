(function () {
  const data = window.portfolioData;
  if (!data) {
    return;
  }

  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sectionNodes = Array.from(document.querySelectorAll("main section[id]"));

  function setText(id, value) {
    const node = document.getElementById(id);
    if (node) {
      node.textContent = value || "";
    }
  }

  function setSrc(id, src, alt) {
    const node = document.getElementById(id);
    if (!node) {
      return;
    }
    node.src = src;
    node.alt = alt;
  }

  function renderCards(containerId, items) {
    const root = document.getElementById(containerId);
    if (!root) {
      return;
    }

    root.innerHTML = (items || [])
      .map(
        (item) =>
          '<article class="reflect-card">' +
          '<p class="question">' + (item.title || item.skill || "") + "</p>" +
          '<p class="answer">' + (item.copy || item.level || "") + "</p>" +
          "</article>"
      )
      .join("");
  }

  function renderHighlights(containerId, items) {
    const root = document.getElementById(containerId);
    if (!root) {
      return;
    }

    root.innerHTML = (items || [])
      .map(
        (item) =>
          '<article class="roadmap-item">' +
          '<p class="roadmap-time">' + (item.label || "") + "</p>" +
          '<p class="roadmap-copy">' + (item.value || "") + "</p>" +
          "</article>"
      )
      .join("");
  }

  function renderParagraphs(containerId, items) {
    const root = document.getElementById(containerId);
    if (!root) {
      return;
    }

    root.innerHTML = (items || [])
      .map(
        (item) =>
          '<article class="story-block">' +
          '<p class="story-copy">' + item + "</p>" +
          "</article>"
      )
      .join("");
  }

  function renderAssessment(containerId, assessment) {
    const root = document.getElementById(containerId);
    if (!root) {
      return;
    }

    const fallbackRows = (assessment.items || []).map((item) => ({
      criterion: item.prompt || "",
      rating: item.rating || "",
      notes: item.reflection || ""
    }));

    const tables = assessment.tables && assessment.tables.length
      ? assessment.tables
      : [
          {
            label: "Reflective Leadership Self-Assessment",
            columns: ["Criterion", "Rating", "Reflection"],
            rows: fallbackRows
          }
        ];

    root.innerHTML = tables
      .map((table) => {
        const headers = table.columns || ["Criterion", "Rating", "Reflection"];
        const rows = table.rows || [];

        const headHtml = headers
          .map((header) => "<th>" + header + "</th>")
          .join("");

        const bodyHtml = rows
          .map((row) => {
            const values = Array.isArray(row.cells)
              ? row.cells
              : [
                  row.criterion || row.prompt || "",
                  row.rating || "",
                  row.notes || row.reflection || row.answer || ""
                ];

            return "<tr>" + values.map((value) => "<td>" + value + "</td>").join("") + "</tr>";
          })
          .join("");

        return (
          '<section class="assessment-table-wrap panel">' +
          '<p class="question-set-kicker">' + (table.label || "Assessment Table") + "</p>" +
          '<div class="assessment-table-scroll">' +
          '<table class="assessment-table">' +
          "<thead><tr>" + headHtml + "</tr></thead>" +
          "<tbody>" + bodyHtml + "</tbody>" +
          "</table>" +
          "</div>" +
          "</section>"
        );
      })
      .join("");
  }

  function renderActivities(containerId, items) {
    const root = document.getElementById(containerId);
    if (!root) {
      return;
    }

    root.innerHTML = (items || [])
      .map((item) => {
        const entries = (item.entries || [])
          .map(
            (entry) => {
              const questionHtml = entry.q
                ? '<p class="question">' + entry.q + "</p>"
                : "";

              return (
                '<article class="reflect-card">' +
                questionHtml +
                '<p class="answer">' + (entry.a || "") + "</p>" +
                "</article>"
              );
            }
          )
          .join("");

        return (
          '<section class="question-set">' +
          '<p class="question-set-kicker">' + (item.activity || "") + "</p>" +
          '<h4 class="question-set-title serif">' + (item.title || "") + "</h4>" +
          '<div class="reflect-grid">' + entries + "</div>" +
          "</section>"
        );
      })
      .join("");
  }

  function renderRoadmap(containerId, items) {
    const root = document.getElementById(containerId);
    if (!root) {
      return;
    }

    root.innerHTML = (items || [])
      .map(
        (item) =>
          '<article class="roadmap-item">' +
          '<p class="roadmap-time">' + item.period + "</p>" +
          '<p class="roadmap-copy">' + item.plan + "</p>" +
          "</article>"
      )
      .join("");
  }

  function renderLinks(containerId, items) {
    const root = document.getElementById(containerId);
    if (!root) {
      return;
    }

    root.innerHTML = (items || [])
      .map(
        (item) =>
          '<a class="action-link" href="' +
          item.href +
          '" target="_blank" rel="noopener noreferrer">' +
          item.label +
          "</a>"
      )
      .join("");
  }

  function renderHeroActions(containerId, items) {
    const root = document.getElementById(containerId);
    if (!root) {
      return;
    }

    root.innerHTML = (items || [])
      .map(
        (item) =>
          '<a class="action-link" href="' +
          item.href +
          '">' +
          item.label +
          "</a>"
      )
      .join("");
  }

  function renderMilestones(containerId, items) {
    const root = document.getElementById(containerId);
    if (!root) {
      return;
    }

    root.innerHTML = (items || [])
      .map(
        (item) =>
          '<article class="story-block">' +
          '<p class="story-title">' + (item.title || "") + "</p>" +
          '<p class="story-copy">' + (item.copy || "") + "</p>" +
          "</article>"
      )
      .join("");
  }

  function setupNavSpy() {
    const linkMap = navLinks.reduce((acc, link) => {
      const id = (link.getAttribute("href") || "").replace("#", "");
      if (id) {
        acc[id] = link;
      }
      return acc;
    }, {});

    const setActive = (id) => {
      navLinks.forEach((link) => {
        const selected = link.getAttribute("href") === "#" + id;
        link.classList.toggle("active", selected);
        link.setAttribute("aria-current", selected ? "page" : "false");
      });
    };

    if (sectionNodes.length > 0 && typeof IntersectionObserver !== "undefined") {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && linkMap[entry.target.id]) {
              setActive(entry.target.id);
            }
          });
        },
        { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
      );

      sectionNodes.forEach((section) => observer.observe(section));
    }

    navLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href") || "";
        if (!href.startsWith("#")) {
          return;
        }

        const target = document.querySelector(href);
        if (!target) {
          return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    if (sectionNodes[0]) {
      setActive(sectionNodes[0].id);
    }
  }

  function wireImageFallbacks() {
    const imageNodes = Array.from(document.querySelectorAll("img[data-fallback]"));
    imageNodes.forEach((img) => {
      img.addEventListener("error", () => {
        const fallbackId = img.dataset.fallback;
        const fallback = document.getElementById(fallbackId);
        if (fallback) {
          img.style.display = "none";
          fallback.style.display = "grid";
        }
      });
    });
  }

  function hydrate() {
    document.title = "Digital Portfolio | " + data.meta.name;

    setText("brandName", data.meta.name);
    setText("heroTitle", data.meta.name);
    setText("heroSubtitle", data.meta.heroSubtitle);
    setText("heroMeta", data.meta.heroMeta);

    setText("aboutTitle", data.about.title);
    setText("assessmentTitle", data.assessment.title);
    setText("assessmentIntro", data.assessment.intro);
    setText("passionTitle", data.passion.title);
    setText("communityTitle", data.community.title);
    setText("communityCaption", data.community.caption);
    setText("activitiesTitle", data.activities.title);
    setText("activitiesIntro", data.activities.intro);
    setText("journeyTitle", data.journey.title);
    setText("journeyIntro", data.journey.intro);
    setText("conversionTitle", data.conversion.title);
    setText("conversionIntro", data.conversion.intro);
    setText("learningTitle", data.learning.title);
    setText("growthTitle", data.growth.title);
    setText("growthQuestion", data.growth.question);
    setText("growthAnswer", data.growth.answer);
    setText("reflectionTitle", data.reflection.title);
    setText("futureReflection", data.reflection.message);
    setText("reflectionSignature", data.reflection.signature);

    setText("fullIdentity", data.meta.name + " | " + data.meta.program + " | " + data.meta.school);

    setText("passionMission", data.passion.mission);
    setText("passionValues", data.passion.values);
    setText("passionImpact", data.passion.impact);
    setText("passionPrayer", data.passion.prayer);

    setText("footerCopy", "Copyright " + new Date().getFullYear() + " " + data.meta.name);
    setText("footerTag", data.meta.footerTag);

    setSrc("classPhoto", data.media.classPhoto, "Class photo");
    setSrc("portraitPhoto", data.media.portraitPhoto, "Portrait photo");
    setSrc("journeyMap", data.media.journeyMap, "Journey map");

    const conversionPdf = document.getElementById("conversionPdf");
    if (conversionPdf) {
      conversionPdf.src = data.conversion.pdfUrl;
    }

    renderHeroActions("heroActions", data.hero.actions);
    renderParagraphs("aboutParagraphs", data.about.paragraphs);
    renderHighlights("aboutHighlights", data.about.highlights);
    renderCards("aboutSkills", (data.about.skills || []).map((item) => ({ title: item.skill, copy: item.level })));
    renderAssessment("assessmentItems", data.assessment || {});
    renderRoadmap("passionRoadmap", data.passion.roadmap);
    renderLinks("passionLinks", data.passion.links);
    renderActivities("activitiesList", data.activities.items);
    renderMilestones("journeyMilestones", data.journey.milestones);
    renderCards("learningIdeas", data.learning.ideas);

    wireImageFallbacks();
  }

  hydrate();
  setupNavSpy();
})();
