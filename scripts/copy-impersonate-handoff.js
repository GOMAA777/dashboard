const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "..", "public", "impersonate-handoff", "index.html");
const destDir = path.join(__dirname, "..", "out", "impersonate-handoff");
const dest = path.join(destDir, "index.html");

if (!fs.existsSync(src)) {
  console.warn("[copy-impersonate-handoff] source missing:", src);
  process.exit(0);
}

fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(src, dest);
console.log("[copy-impersonate-handoff] wrote", dest);
