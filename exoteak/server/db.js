// Basit JSON dosya tabanli veritabani.
// Ileride MongoDB Atlas'a gecmek istersen sadece bu dosyadaki
// read/write fonksiyonlarini mongoose modelleriyle degistirmen yeterli.
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

const DEFAULT_DB = { users: [], products: [], categories: [] };

let cache = null;

async function ensure() {
  if (!existsSync(DATA_DIR)) await mkdir(DATA_DIR, { recursive: true });
  if (!existsSync(DB_PATH)) {
    await writeFile(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2));
  }
}

export async function readDB() {
  if (cache) return cache;
  await ensure();
  const raw = await readFile(DB_PATH, "utf-8");
  cache = JSON.parse(raw);
  // eksik anahtarlari tamamla
  cache = { ...DEFAULT_DB, ...cache };
  return cache;
}

export async function writeDB(db) {
  cache = db;
  await writeFile(DB_PATH, JSON.stringify(db, null, 2));
}
