#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const parserUrl = pathToFileURL(join(root, "src/lib/msdmd/universal.ts")).href;

const { walkTree, parseText } = await import(parserUrl);

const srcRoot = join(root, "src");
const contracts = walkTree(srcRoot, "CONTRACTS", {
  extensions: new Set([".ts", ".tsx"]),
});
const builds = walkTree(srcRoot, "MODULE_BUILD", {
  extensions: new Set([".ts", ".tsx"]),
});

const skipGap = (p) =>
  p.includes("/lib/auth/") ||
  p.includes("/lib/app-data/") ||
  p.includes("/lib/multiplayer/") ||
  p.includes("/lib/db.ts") ||
  p.includes("preview-host") ||
  p.includes("error-component") ||
  p.includes("/routes/") ||
  p.includes("/components/ui/") ||
  p.includes("/components/preview") ||
  p.includes("/lib/utils.ts") ||
  p.includes("/lib/msdmd/") ||
  p.includes("routeTree") ||
  p.includes("router.tsx");

console.log("msdmd CONTRACTS");
let n = 0;
for (const [file, entries] of contracts.annotated) {
  for (const e of entries) {
    n += 1;
    console.log(`  · ${e.id}  (${file.replace(root + "/", "")})`);
  }
}
const gaps = contracts.untested.filter((p) => !skipGap(p));
console.log(`${n} contracts · ${gaps.length} source gaps (filtered)`);
for (const p of gaps.slice(0, 20)) console.log(`  gap ${p.replace(root + "/", "")}`);

console.log("\nmsdmd MODULE_BUILD");
let b = 0;
for (const [file, entries] of builds.annotated) {
  for (const e of entries) {
    b += 1;
    console.log(`  · ${e.id}  kind=${e.module_kind ?? "?"}  ${e.summary ?? ""}`);
  }
}
console.log(`${b} module builds`);

const sample = readFileSync(join(root, "src/lib/faces/catalog.ts"), "utf8");
const parsed = parseText(sample, "CONTRACTS", "//");
if (parsed.length < 1) {
  console.error("parser failed to read catalog CONTRACTS");
  process.exit(1);
}
