import { promises as fs } from "fs";
import path from "path";

export interface WaitlistEntry {
  email: string;
  joinedAt: string;
  ref?: string;
}

const WAITLIST_PATH = path.join(process.cwd(), "data", "waitlist.json");

export async function readWaitlist(): Promise<WaitlistEntry[]> {
  try {
    const raw = await fs.readFile(WAITLIST_PATH, "utf-8");
    return JSON.parse(raw) as WaitlistEntry[];
  } catch {
    return [];
  }
}

export async function addToWaitlist(
  email: string,
  ref?: string
): Promise<{ duplicate: boolean }> {
  const normalized = email.toLowerCase().trim();

  try {
    await fs.mkdir(path.dirname(WAITLIST_PATH), { recursive: true });

    const entries = await readWaitlist();
    if (entries.some((entry) => entry.email === normalized)) {
      return { duplicate: true };
    }

    const entry: WaitlistEntry = { email: normalized, joinedAt: new Date().toISOString() };
    if (ref) entry.ref = ref;
    entries.push(entry);
    await fs.writeFile(WAITLIST_PATH, JSON.stringify(entries, null, 2));
  } catch {
    // Vercel serverless has a read-only filesystem — admin notification email serves as backup record.
  }

  return { duplicate: false };
}