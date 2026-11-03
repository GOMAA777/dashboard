/**
 * Zip the static `out/` export with POSIX forward-slash paths.
 * Windows Compress-Archive uses backslashes, which break `_next/` on Linux/cPanel
 * and leave the dashboard stuck on the loading spinner (JS 404).
 */
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  rmSync,
  statSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "out");
const localZip = path.join(root, "out.zip");
const parentZip = path.join(root, "..", "out.zip");
const buildZip = path.join(root, "..", "dashboard-build.zip");

if (!existsSync(outDir) || !statSync(outDir).isDirectory()) {
  console.error("[zip-out] Missing out/ — run npm run build first.");
  process.exit(1);
}

if (!existsSync(path.join(outDir, "_next"))) {
  console.error("[zip-out] out/_next missing — static assets will 404 after upload.");
  process.exit(1);
}

if (!existsSync(path.join(outDir, ".htaccess"))) {
  console.warn("[zip-out] Warning: out/.htaccess missing.");
}

for (const file of [localZip, parentZip, buildZip]) {
  if (existsSync(file)) rmSync(file);
}

mkdirSync(path.dirname(parentZip), { recursive: true });

const result = spawnSync(
  "tar",
  ["-a", "-c", "-f", localZip, "-C", outDir, "."],
  { stdio: "inherit", cwd: root }
);

if (result.status !== 0) {
  console.error("[zip-out] tar failed — install/enable Windows tar or zip manually with forward slashes.");
  process.exit(result.status ?? 1);
}

copyFileSync(localZip, parentZip);
copyFileSync(localZip, buildZip);

const sizeMb = (statSync(localZip).size / (1024 * 1024)).toFixed(2);
console.log(`[zip-out] wrote ${localZip} (${sizeMb} MB)`);
console.log(`[zip-out] copied → ${parentZip}`);
console.log(`[zip-out] copied → ${buildZip}`);
console.log("[zip-out] Upload zip CONTENTS into public_html/dashboard/ (keep _next next to index.html).");
