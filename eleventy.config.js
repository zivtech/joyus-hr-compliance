import fs from "fs";
import path from "path";

export default function (eleventyConfig) {
  // Single read of all regulation JSON files — derives regulations,
  // jurisdictions, and lawTypes from one pass over the filesystem.
  function loadAllData() {
    const regulationsDir = path.resolve("data/regulations");
    const regulations = [];
    const today = new Date().toISOString().slice(0, 10);
    const jurKeys = new Set();
    const jurisdictions = [];
    const jurCounts = {};
    const typeSet = new Set();

    function walkDir(dir) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walkDir(full);
        } else if (entry.name.endsWith(".json")) {
          const reg = JSON.parse(fs.readFileSync(full, "utf-8"));

          // Compute status based on dates
          if (reg.effective_date > today) {
            reg.computed_status = "pending";
          } else if (reg.sunset_date && reg.sunset_date < today) {
            reg.computed_status = "expired";
          } else if (reg.status === "repealed") {
            reg.computed_status = "repealed";
          } else if (reg.status === "superseded") {
            reg.computed_status = "superseded";
          } else {
            reg.computed_status = "active";
          }

          regulations.push(reg);

          // Derive jurisdiction key
          let key, label;
          if (reg.jurisdiction.level === "federal") {
            key = "federal";
            label = "Federal";
          } else if (reg.jurisdiction.level === "local") {
            key = `${reg.jurisdiction.locality}-${reg.jurisdiction.state}`
              .toLowerCase()
              .replace(/\s+/g, "-");
            label = `${reg.jurisdiction.locality}, ${reg.jurisdiction.state}`;
          } else {
            key = (reg.jurisdiction.state || "unknown").toLowerCase();
            label = reg.jurisdiction.state;
          }

          jurCounts[key] = (jurCounts[key] || 0) + 1;
          if (!jurKeys.has(key)) {
            jurKeys.add(key);
            jurisdictions.push({
              key,
              label,
              level: reg.jurisdiction.level,
              state: reg.jurisdiction.state || null,
              locality: reg.jurisdiction.locality || null,
            });
          }

          // Collect law types
          typeSet.add(reg.law_type);
        }
      }
    }

    walkDir(regulationsDir);

    // Attach counts to jurisdictions
    for (const jur of jurisdictions) {
      jur.count = jurCounts[jur.key] || 0;
    }

    return {
      regulations,
      jurisdictions: jurisdictions.sort((a, b) =>
        a.label.localeCompare(b.label)
      ),
      lawTypes: [...typeSet].sort(),
    };
  }

  // Cache the single load so all three globals share one read
  let _cache = null;
  function getData() {
    if (!_cache) _cache = loadAllData();
    return _cache;
  }

  eleventyConfig.addGlobalData("regulations", () => getData().regulations);
  eleventyConfig.addGlobalData("jurisdictions", () => getData().jurisdictions);
  eleventyConfig.addGlobalData("lawTypes", () => getData().lawTypes);

  // Build date for footer
  eleventyConfig.addGlobalData("buildDate", () => {
    return new Date().toISOString().slice(0, 10);
  });

  // Nunjucks filters
  eleventyConfig.addFilter("jurisdictionLabel", (jurisdiction) => {
    if (jurisdiction.level === "federal") return "Federal";
    if (jurisdiction.level === "local") {
      return `${jurisdiction.locality}, ${jurisdiction.state}`;
    }
    return jurisdiction.state;
  });

  eleventyConfig.addFilter("lawTypeLabel", (lawType) => {
    return lawType
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  });

  eleventyConfig.addFilter("statusBadgeClass", (status) => {
    const classes = {
      active: "badge-active",
      pending: "badge-pending",
      expired: "badge-expired",
      repealed: "badge-repealed",
      superseded: "badge-superseded",
    };
    return classes[status] || "";
  });

  // Group regulations by a key
  eleventyConfig.addFilter("groupBy", (arr, key) => {
    const groups = {};
    for (const item of arr) {
      const val =
        key.includes(".") ? key.split(".").reduce((o, k) => o?.[k], item) : item[key];
      const groupKey = val || "other";
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(item);
    }
    return Object.entries(groups).map(([k, v]) => ({ key: k, items: v }));
  });

  eleventyConfig.addFilter("unique", (arr, key) => {
    const seen = new Set();
    return arr.filter((item) => {
      const val =
        key.includes(".") ? key.split(".").reduce((o, k) => o?.[k], item) : item[key];
      if (seen.has(val)) return false;
      seen.add(val);
      return true;
    });
  });

  eleventyConfig.addFilter("where", (arr, key, val) => {
    return arr.filter((item) => {
      const itemVal =
        key.includes(".") ? key.split(".").reduce((o, k) => o?.[k], item) : item[key];
      return itemVal === val;
    });
  });

  eleventyConfig.addFilter("sortBy", (arr, key) => {
    return [...arr].sort((a, b) => {
      const aVal =
        key.includes(".") ? key.split(".").reduce((o, k) => o?.[k], a) : a[key];
      const bVal =
        key.includes(".") ? key.split(".").reduce((o, k) => o?.[k], b) : b[key];
      if (aVal < bVal) return -1;
      if (aVal > bVal) return 1;
      return 0;
    });
  });

  eleventyConfig.addFilter("jsonStringify", (val) => {
    return JSON.stringify(val);
  });

  // Render a requirements object as readable HTML
  eleventyConfig.addFilter("renderRequirements", (obj) => {
    function formatKey(key) {
      return key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    function formatValue(val) {
      if (val === true) return '<span class="req-bool req-true">Yes</span>';
      if (val === false) return '<span class="req-bool req-false">No</span>';
      if (val === null || val === undefined) return '<span class="req-null">N/A</span>';
      if (typeof val === "number") return `<span class="req-number">${val}</span>`;
      return String(val);
    }

    function renderObj(o, depth) {
      if (typeof o !== "object" || o === null || Array.isArray(o)) {
        return formatValue(o);
      }

      let html = '<dl class="req-dl' + (depth > 0 ? " req-nested" : "") + '">';
      for (const [k, v] of Object.entries(o)) {
        html += `<dt>${formatKey(k)}</dt>`;
        if (typeof v === "object" && v !== null && !Array.isArray(v)) {
          html += `<dd>${renderObj(v, depth + 1)}</dd>`;
        } else if (Array.isArray(v)) {
          html += `<dd>${v.map((item) => (typeof item === "object" ? renderObj(item, depth + 1) : formatValue(item))).join(", ")}</dd>`;
        } else {
          html += `<dd>${formatValue(v)}</dd>`;
        }
      }
      html += "</dl>";
      return html;
    }

    return renderObj(obj, 0);
  });

  // Pass through static assets
  eleventyConfig.addPassthroughCopy("site/css");
  eleventyConfig.addPassthroughCopy("site/js");

  return {
    dir: {
      input: "site",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
  };
}
