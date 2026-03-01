import fs from "fs";
import path from "path";

export default function (eleventyConfig) {
  // Load all regulation JSON files into a single collection
  eleventyConfig.addGlobalData("regulations", () => {
    const regulationsDir = path.resolve("data/regulations");
    const regulations = [];
    const today = new Date().toISOString().slice(0, 10);

    function walkDir(dir) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walkDir(full);
        } else if (entry.name.endsWith(".json")) {
          const raw = fs.readFileSync(full, "utf-8");
          const reg = JSON.parse(raw);

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
        }
      }
    }

    walkDir(regulationsDir);
    return regulations;
  });

  // Unique jurisdictions for browse pages
  eleventyConfig.addGlobalData("jurisdictions", () => {
    const regulationsDir = path.resolve("data/regulations");
    const keys = new Set();
    const result = [];

    function walkDir(dir) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walkDir(full);
        } else if (entry.name.endsWith(".json")) {
          const reg = JSON.parse(fs.readFileSync(full, "utf-8"));
          const key =
            reg.jurisdiction.level === "federal"
              ? "federal"
              : (reg.jurisdiction.state || "unknown").toLowerCase();
          if (!keys.has(key)) {
            keys.add(key);
            result.push({
              key,
              label:
                reg.jurisdiction.level === "federal"
                  ? "Federal"
                  : reg.jurisdiction.state,
              level: reg.jurisdiction.level,
            });
          }
        }
      }
    }

    walkDir(regulationsDir);
    return result.sort((a, b) => a.label.localeCompare(b.label));
  });

  // Unique law types for browse pages
  eleventyConfig.addGlobalData("lawTypes", () => {
    const regulationsDir = path.resolve("data/regulations");
    const seen = new Set();
    const result = [];

    function walkDir(dir) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walkDir(full);
        } else if (entry.name.endsWith(".json")) {
          const reg = JSON.parse(fs.readFileSync(full, "utf-8"));
          if (!seen.has(reg.law_type)) {
            seen.add(reg.law_type);
            result.push(reg.law_type);
          }
        }
      }
    }

    walkDir(regulationsDir);
    return result.sort();
  });

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
