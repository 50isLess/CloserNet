import fs from "fs";
import { spawnSync } from "child_process";
import readline from "readline";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
const envFile = `${root}/.env.local`;
const defaultFrom = "CloserNet <support@closernet.net>";
const defaultNotify = "support@closernet.net";

const keyFromArg = process.argv[2]?.trim();
const apiKey =
  keyFromArg ||
  (await new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question("Paste your RESEND_API_KEY (starts with re_): ", (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  }));

if (!apiKey) {
  console.error("No API key entered.");
  process.exit(1);
}

if (!apiKey.startsWith("re_")) {
  console.warn("Warning: Resend keys usually start with re_");
}

function setEnvLine(name, value) {
  const lines = fs.existsSync(envFile) ? fs.readFileSync(envFile, "utf8").split(/\r?\n/) : [];
  const pattern = new RegExp(`^${name}=`);
  let found = false;
  const updated = lines.map((line) => {
    if (pattern.test(line)) {
      found = true;
      return `${name}=${value}`;
    }
    return line;
  });
  if (!found) updated.push(`${name}=${value}`);
  fs.writeFileSync(envFile, updated.join("\n") + "\n");
}

setEnvLine("RESEND_API_KEY", apiKey);
setEnvLine("RESEND_FROM_EMAIL", defaultFrom);
setEnvLine("WAITLIST_NOTIFY_EMAIL", defaultNotify);

console.log("Saved to .env.local");

function run(cmd, args, input) {
  const result = spawnSync(cmd, args, {
    input: input ? `${input}\n` : undefined,
    encoding: "utf8",
    stdio: ["pipe", "inherit", "inherit"],
    shell: process.platform === "win32",
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run("npx", ["vercel", "env", "add", "RESEND_API_KEY", "production", "--force"], apiKey);
console.log("Synced RESEND_API_KEY to Vercel");
run("npx", ["vercel", "--prod", "--yes"]);
console.log("Done. Check https://closernet.vercel.app/api/waitlist");