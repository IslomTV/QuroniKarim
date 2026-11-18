import { writeFile } from "node:fs/promises";

const CITY = "toshkent";
const BASE = "https://namozvaqti.uz";
const OUT = process.argv[2] ?? new URL("../src/data/prayer-times.json", import.meta.url);

const MONTH_NAMES = {
  yanvar: 1,
  fevral: 2,
  mart: 3,
  aprel: 4,
  may: 5,
  iyun: 6,
  iyul: 7,
  avgust: 8,
  sentabr: 9,
  sentyabr: 9,
  oktabr: 10,
  oktyabr: 10,
  noyabr: 11,
  dekabr: 12,
};

function cellText(html) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const days = {};
const monthYears = new Set();

for (let month = 1; month <= 12; month += 1) {
  const url = `${BASE}/oylik/${month}/${CITY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} returned ${res.status}`);
  const html = await res.text();

  const heading = html.match(/<h4[^>]*>\s*([A-Za-z]+)\s+(\d{4})\s*<\/h4>/);
  if (!heading) throw new Error(`No month heading on ${url}`);
  const monthName = heading[1].toLowerCase();
  const year = Number(heading[2]);
  if (MONTH_NAMES[monthName] !== month) {
    throw new Error(`Unexpected heading "${heading[0]}" on ${url}`);
  }
  monthYears.add(year);

  let parsed = 0;
  for (const row of html.matchAll(/<tr>([\s\S]*?)<\/tr>/g)) {
    const cells = [...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((cell) => cellText(cell[1]));
    if (cells.length < 7) continue;
    const day = Number(cells[0].match(/^(\d+)/)?.[1]);
    if (!day) continue;
    const times = cells.slice(1, 7);
    if (!times.every((time) => /^\d{2}:\d{2}$/.test(time))) {
      throw new Error(`Invalid times on ${url} day ${day}: ${times.join(", ")}`);
    }
    const key = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (days[key]) throw new Error(`Duplicate date ${key}`);
    days[key] = times;
    parsed += 1;
  }

  if (parsed < 28 || parsed > 31) {
    throw new Error(`Suspicious row count (${parsed}) for ${url}`);
  }
  console.log(`${heading[1]} ${year}: ${parsed} days`);
}

if (monthYears.size !== 1) {
  throw new Error(`Mixed years in schedule: ${[...monthYears].join(", ")}`);
}
const year = [...monthYears][0];

const payload = {
  city: "Toshkent",
  country: "Oʻzbekiston",
  year,
  source: `${BASE}/oylik/11/${CITY}`,
  verified: new Date().toISOString().slice(0, 10),
  days,
};

await writeFile(OUT, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Wrote ${Object.keys(days).length} days to ${OUT}`);
console.log(`Nov 18: ${days[`${year}-11-18`]?.join(", ")}`);
