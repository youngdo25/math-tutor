import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "math-tutor";
const DB_VERSION = 1;
const ATTEMPTS_STORE = "attempts";
const MASTERY_STORE = "mastery";

export interface AttemptRecord {
  id?: number;
  problemKey: string;
  moduleId: string;
  difficulty: string;
  isCorrect: boolean;
  timeMs: number;
  attemptedAt: number;
}

export interface MasteryRecord {
  problemKey: string;
  moduleId: string;
  correctCount: number;
  totalCount: number;
  avgTimeMs: number;
  lastSeenAt: number;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb() {
  if (typeof window === "undefined") return null;
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(ATTEMPTS_STORE)) {
          const store = db.createObjectStore(ATTEMPTS_STORE, {
            keyPath: "id",
            autoIncrement: true,
          });
          store.createIndex("attemptedAt", "attemptedAt");
          store.createIndex("problemKey", "problemKey");
        }
        if (!db.objectStoreNames.contains(MASTERY_STORE)) {
          db.createObjectStore(MASTERY_STORE, { keyPath: "problemKey" });
        }
      },
    });
  }
  return dbPromise;
}

export async function recordAttempt(
  record: Omit<AttemptRecord, "id" | "attemptedAt"> & { attemptedAt?: number },
) {
  const db = await getDb();
  if (!db) return;
  const attemptedAt = record.attemptedAt ?? Date.now();
  const full: Omit<AttemptRecord, "id"> = { ...record, attemptedAt };
  await db.add(ATTEMPTS_STORE, full);

  const tx = db.transaction(MASTERY_STORE, "readwrite");
  const existing = (await tx.store.get(record.problemKey)) as
    | MasteryRecord
    | undefined;
  const totalCount = (existing?.totalCount ?? 0) + 1;
  const correctCount = (existing?.correctCount ?? 0) + (record.isCorrect ? 1 : 0);
  const prevTotalTime = (existing?.avgTimeMs ?? 0) * (existing?.totalCount ?? 0);
  const avgTimeMs = Math.round((prevTotalTime + record.timeMs) / totalCount);
  await tx.store.put({
    problemKey: record.problemKey,
    moduleId: record.moduleId,
    correctCount,
    totalCount,
    avgTimeMs,
    lastSeenAt: attemptedAt,
  } satisfies MasteryRecord);
  await tx.done;
}

export async function getRecentAttempts(limit = 50): Promise<AttemptRecord[]> {
  const db = await getDb();
  if (!db) return [];
  const tx = db.transaction(ATTEMPTS_STORE, "readonly");
  const idx = tx.store.index("attemptedAt");
  const all: AttemptRecord[] = [];
  let cursor = await idx.openCursor(null, "prev");
  while (cursor && all.length < limit) {
    all.push(cursor.value as AttemptRecord);
    cursor = await cursor.continue();
  }
  return all;
}

export async function getAllMastery(): Promise<MasteryRecord[]> {
  const db = await getDb();
  if (!db) return [];
  return (await db.getAll(MASTERY_STORE)) as MasteryRecord[];
}
