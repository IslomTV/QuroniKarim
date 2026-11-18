#!/usr/bin/env node
/**
 * Mirror the Way2Quran audio catalog into a local folder.
 *
 *   node scripts/sync-media.mjs                     # full mirror -> public/media
 *   node scripts/sync-media.mjs --dry-run --limit 10
 *   node scripts/sync-media.mjs --only abdul-basit  # one reciter only
 *   node scripts/sync-media.mjs --out D:\w2q-media --concurrency 8
 *
 * Files are written with a .part suffix and renamed when complete, so an
 * interrupted run resumes where it left off. Existing files are skipped.
 * Reciter paths mirror the CDN layout, so setting
 * NEXT_PUBLIC_MEDIA_BASE=/media/ makes the site read them locally.
 */
import { createWriteStream, existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REMOTE = "https://media.way2quran.com/";

function parseArgs(argv) {
  const out = { out: join(ROOT, "public", "media"), concurrency: 6, limit: 0, retries: 3, only: "", dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const [key, inline] = argv[i].replace(/^--/, "").split("=");
    const take = () => (inline !== undefined ? inline : argv[++i]);
    if (key === "out") out.out = resolve(take());
    else if (key === "concurrency") out.concurrency = Math.max(1, Number(take()) || 6);
    else if (key === "limit") out.limit = Math.max(0, Number(take()) || 0);
    else if (key === "retries") out.retries = Math.max(1, Number(take()) || 3);
    else if (key === "only") out.only = take().toLowerCase();
    else if (key === "dry-run") out.dryRun = true;
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));

const readJson = (name) => JSON.parse(readFileSync(join(ROOT, "src", "data", name), "utf8"));
const encodePath = (path) => path.split("/").map(encodeURIComponent).join("/");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Build a de-duplicated manifest of { url, dest } entries. */
function buildManifest() {
  const byDest = new Map();

  for (const reciter of readJson("reciters.json")) {
    for (const rec of reciter.recitations) {
      for (const parts of Object.values(rec.audio)) {
        for (const [path] of parts) {
          byDest.set(path, { url: REMOTE + encodePath(path), dest: path });
        }
      }
    }
  }

  for (const mixed of readJson("mixed-mushafs.json")) {
    for (const track of mixed.tracks) {
      const name = `${String(track.n).padStart(3, "0")}.mp3`;
      const url = mixed.base + name;
      const rel = decodeURIComponent(new URL(url).pathname).replace(/^\/+/, "");
      byDest.set(rel, { url, dest: rel });
    }
  }

  return [...byDest.values()];
}

async function download(entry) {
  const dest = join(args.out, entry.dest);
  const part = dest + ".part";
  mkdirSync(dirname(dest), { recursive: true });

  if (existsSync(dest) && statSync(dest).size > 0) return { skipped: true, bytes: 0 };

  let lastError;
  for (let attempt = 1; attempt <= args.retries; attempt++) {
    const start = existsSync(part) ? statSync(part).size : 0;
    try {
      const res = await fetch(entry.url, {
        headers: start > 0 ? { Range: `bytes=${start}-` } : {},
        redirect: "follow",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const type = res.headers.get("content-type") || "";
      if (type.includes("text/html")) throw new Error(`unexpected content-type ${type}`);

      const resuming = start > 0 && res.status === 206;
      await pipeline(
        Readable.fromWeb(res.body),
        createWriteStream(part, { flags: resuming ? "a" : "w" })
      );
      const bytes = statSync(part).size;
      if (bytes === 0) throw new Error("empty file");
      renameSync(part, dest);
      return { skipped: false, bytes };
    } catch (error) {
      lastError = error;
      if (attempt < args.retries) await sleep(750 * attempt);
    }
  }
  throw lastError;
}

const all = buildManifest();
const entries = args.only ? all.filter((e) => e.dest.toLowerCase().includes(args.only)) : all;
const selected = args.limit ? entries.slice(0, args.limit) : entries;

console.log(`source:     ${REMOTE}`);
console.log(`target:     ${args.out}`);
console.log(`files:      ${selected.length} of ${all.length}${args.only ? ` (filter: ${args.only})` : ""}`);
console.log(`concurrency:${args.concurrency}${args.dryRun ? "  [dry run]" : ""}`);
if (args.dryRun) {
  for (const entry of selected.slice(0, 20)) console.log(`  ${entry.dest}`);
  if (selected.length > 20) console.log(`  ... ${selected.length - 20} more`);
  process.exit(0);
}

mkdirSync(args.out, { recursive: true });

let cursor = 0;
let done = 0;
let skipped = 0;
let bytes = 0;
const failures = [];
const started = Date.now();

async function worker() {
  while (true) {
    const index = cursor++;
    if (index >= selected.length) return;
    const entry = selected[index];
    try {
      const result = await download(entry);
      if (result.skipped) skipped++;
      else {
        done++;
        bytes += result.bytes;
      }
    } catch (error) {
      failures.push({ url: entry.url, dest: entry.dest, error: String(error?.message || error) });
    }
    const seen = done + skipped + failures.length;
    if (seen % 25 === 0 || seen === selected.length) {
      const gb = (bytes / 1024 ** 3).toFixed(2);
      const secs = (Date.now() - started) / 1000;
      const rate = secs > 0 ? (bytes / 1024 ** 2 / secs).toFixed(1) : "0";
      console.log(`[${seen}/${selected.length}] new ${done} · skipped ${skipped} · failed ${failures.length} · ${gb} GB · ${rate} MB/s`);
    }
  }
}

await Promise.all(Array.from({ length: args.concurrency }, worker));

const report = join(ROOT, "scripts", "media-failures.json");
if (failures.length) writeFileSync(report, JSON.stringify(failures, null, 2));
console.log(
  `\nfinished: ${done} downloaded, ${skipped} skipped, ${failures.length} failed, ` +
    `${(bytes / 1024 ** 3).toFixed(2)} GB in ${Math.round((Date.now() - started) / 1000)}s`
);
if (failures.length) console.log(`failures written to ${report} — rerun the command to retry them.`);
console.log(`\nTo serve the mirror: set NEXT_PUBLIC_MEDIA_BASE=/media/ before starting Next.`);
