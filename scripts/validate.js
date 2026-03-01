import fs from "fs";
import path from "path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

const schemaPath = path.resolve("data/schema/regulation.schema.json");
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
const validate = ajv.compile(schema);

const regulationsDir = path.resolve("data/regulations");
let errors = 0;
let count = 0;

function walkDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(full);
    } else if (entry.name.endsWith(".json")) {
      count++;
      const relative = path.relative(regulationsDir, full);

      // Parse JSON
      let data;
      try {
        data = JSON.parse(fs.readFileSync(full, "utf-8"));
      } catch (e) {
        console.error(`FAIL ${relative}: Invalid JSON — ${e.message}`);
        errors++;
        continue;
      }

      // Validate against schema
      const valid = validate(data);
      if (!valid) {
        console.error(`FAIL ${relative}:`);
        for (const err of validate.errors) {
          console.error(`  ${err.instancePath || "/"} ${err.message}`);
        }
        errors++;
        continue;
      }

      // Check that id matches filename
      const expectedId = entry.name.replace(/\.json$/, "");
      if (data.id !== expectedId) {
        console.error(
          `FAIL ${relative}: id "${data.id}" does not match filename "${expectedId}"`
        );
        errors++;
        continue;
      }

      // Check jurisdiction directory consistency
      const parentDir = path.basename(path.dirname(full));
      const grandparentDir = path.basename(
        path.dirname(path.dirname(full))
      );

      if (data.jurisdiction.level === "federal" && parentDir !== "federal") {
        console.error(
          `FAIL ${relative}: federal regulation must be in federal/ directory`
        );
        errors++;
        continue;
      }

      if (
        data.jurisdiction.level === "state" &&
        data.jurisdiction.state &&
        parentDir !== data.jurisdiction.state.toLowerCase()
      ) {
        console.error(
          `FAIL ${relative}: state "${data.jurisdiction.state}" regulation must be in ${data.jurisdiction.state.toLowerCase()}/ directory`
        );
        errors++;
        continue;
      }

      console.log(`OK   ${relative}`);
    }
  }
}

walkDir(regulationsDir);

console.log(`\n${count} files checked, ${errors} error(s)`);

if (errors > 0) {
  process.exit(1);
}
