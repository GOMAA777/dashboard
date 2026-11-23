/**
 * Zip the static `out/` export with STRICT POSIX forward-slash (/) paths.
 * Windows tools (`tar.exe`, `Compress-Archive`) write backslashes (\), which
 * break `_next/` on Linux/cPanel and cause every JavaScript chunk to 404.
 *
 * This pure Node.js implementation guarantees 100% standard POSIX ZIP paths
 * on any OS without external dependencies.
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";

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

function toDosDateTime(date) {
  const d = new Date(date);
  const time =
    ((d.getHours() & 0x1f) << 11) |
    ((d.getMinutes() & 0x3f) << 5) |
    (Math.floor(d.getSeconds() / 2) & 0x1f);
  const dosDate =
    (((d.getFullYear() - 1980) & 0x7f) << 9) |
    (((d.getMonth() + 1) & 0x0f) << 5) |
    (d.getDate() & 0x1f);
  return { time, date: dosDate };
}

function createPosixZip(sourceDir, targetZip) {
  const localHeaders = [];
  const centralHeaders = [];
  let currentOffset = 0;

  function walk(dir, baseDir = "") {
    const items = readdirSync(dir, { withFileTypes: true });
    items.sort((a, b) => a.name.localeCompare(b.name));

    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      // STRICT POSIX FORWARD SLASH:
      const posixRelPath = baseDir ? `${baseDir}/${item.name}` : item.name;

      if (item.isDirectory()) {
        walk(fullPath, posixRelPath);
      } else if (item.isFile()) {
        const fileContent = readFileSync(fullPath);
        const stat = statSync(fullPath);
        const { time, date } = toDosDateTime(stat.mtime);
        const crc = zlib.crc32(fileContent);
        const compressed = zlib.deflateRawSync(fileContent);

        const nameBuffer = Buffer.from(posixRelPath, "utf8");

        // Local header (30 bytes)
        const localHeader = Buffer.alloc(30);
        localHeader.writeUInt32LE(0x04034b50, 0); // signature
        localHeader.writeUInt16LE(20, 4);         // version needed (2.0)
        localHeader.writeUInt16LE(0x0800, 6);     // flags: UTF-8
        localHeader.writeUInt16LE(8, 8);          // compression method: deflate
        localHeader.writeUInt16LE(time, 10);
        localHeader.writeUInt16LE(date, 12);
        localHeader.writeUInt32LE(crc, 14);
        localHeader.writeUInt32LE(compressed.length, 18);
        localHeader.writeUInt32LE(fileContent.length, 22);
        localHeader.writeUInt16LE(nameBuffer.length, 26);
        localHeader.writeUInt16LE(0, 28);         // extra len

        const localPart = Buffer.concat([localHeader, nameBuffer, compressed]);
        localHeaders.push(localPart);

        // Central directory header (46 bytes)
        const centralHeader = Buffer.alloc(46);
        centralHeader.writeUInt32LE(0x02014b50, 0); // signature
        centralHeader.writeUInt16LE(20, 4);          // version made by
        centralHeader.writeUInt16LE(20, 6);          // version needed
        centralHeader.writeUInt16LE(0x0800, 8);      // flags: UTF-8
        centralHeader.writeUInt16LE(8, 10);          // compression method: deflate
        centralHeader.writeUInt16LE(time, 12);
        centralHeader.writeUInt16LE(date, 14);
        centralHeader.writeUInt32LE(crc, 16);
        centralHeader.writeUInt32LE(compressed.length, 20);
        centralHeader.writeUInt32LE(fileContent.length, 24);
        centralHeader.writeUInt16LE(nameBuffer.length, 28);
        centralHeader.writeUInt16LE(0, 30);          // extra len
        centralHeader.writeUInt16LE(0, 32);          // comment len
        centralHeader.writeUInt16LE(0, 34);          // disk start
        centralHeader.writeUInt16LE(0, 36);          // internal attrs
        centralHeader.writeUInt32LE((0o100644 << 16) >>> 0, 38); // POSIX rw-r--r--
        centralHeader.writeUInt32LE(currentOffset, 42);          // offset of local header

        centralHeaders.push(Buffer.concat([centralHeader, nameBuffer]));
        currentOffset += localPart.length;
      }
    }
  }

  walk(sourceDir);

  const centralDirBuffer = Buffer.concat(centralHeaders);
  const centralDirOffset = currentOffset;
  const centralDirSize = centralDirBuffer.length;
  const totalEntries = centralHeaders.length;

  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(totalEntries, 8);
  eocd.writeUInt16LE(totalEntries, 10);
  eocd.writeUInt32LE(centralDirSize, 12);
  eocd.writeUInt32LE(centralDirOffset, 16);
  eocd.writeUInt16LE(0, 20);

  const finalZip = Buffer.concat([...localHeaders, centralDirBuffer, eocd]);
  writeFileSync(targetZip, finalZip);
  return totalEntries;
}

for (const file of [localZip, parentZip, buildZip]) {
  try {
    if (existsSync(file)) rmSync(file, { force: true });
  } catch {}
}

mkdirSync(path.dirname(parentZip), { recursive: true });

console.log("[zip-out] Creating POSIX forward-slash ZIP archive...");
const count = createPosixZip(outDir, localZip);
console.log(`[zip-out] Packed ${count} files with POSIX forward-slash paths.`);

try { copyFileSync(localZip, parentZip); } catch {}
try { copyFileSync(localZip, buildZip); } catch {}

const sizeMb = (statSync(localZip).size / (1024 * 1024)).toFixed(2);
console.log(`[zip-out] wrote ${localZip} (${sizeMb} MB)`);
console.log(`[zip-out] copied → ${parentZip}`);
console.log(`[zip-out] copied → ${buildZip}`);
console.log("[zip-out] Upload zip CONTENTS into public_html/dashboard/ (keep _next next to index.html).");
