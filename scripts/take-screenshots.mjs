import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT_DIR, "out");
const SCREENSHOTS_DIR = path.join(ROOT_DIR, "docs", "screenshots");

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// 1. Static file server for out/
const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split("?")[0]);
  if (reqPath === "/") reqPath = "/index.html";
  const filePath = path.join(OUT_DIR, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    // 404 fallback
    const f404 = path.join(OUT_DIR, "404.html");
    if (fs.existsSync(f404)) {
      res.writeHead(404, { "Content-Type": "text/html" });
      fs.createReadStream(f404).pipe(res);
    } else {
      res.writeHead(404);
      res.end("Not Found");
    }
  }
});

const PORT = 4567;
await new Promise((resolve) => server.listen(PORT, resolve));
console.log(`Static server running on http://localhost:${PORT}`);

// 2. Launch Chrome with remote debugging
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const chromeProcess = spawn(chromePath, [
  "--headless=new",
  "--remote-debugging-port=9222",
  "--disable-gpu",
  "--hide-scrollbars",
  "--window-size=1440,900",
  "about:blank",
]);

// Wait for Chrome to be ready
let wsUrl = null;
for (let i = 0; i < 30; i++) {
  await new Promise((r) => setTimeout(r, 300));
  try {
    const res = await fetch("http://localhost:9222/json/version");
    const json = await res.json();
    wsUrl = json.webSocketDebuggerUrl;
    if (wsUrl) break;
  } catch (e) {}
}

if (!wsUrl) {
  console.error("Could not connect to Chrome debugger");
  chromeProcess.kill();
  server.close();
  process.exit(1);
}

console.log("Connected to Chrome:", wsUrl);

// Simple CDP client over native WebSocket
class CDPClient {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { resolve, reject } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.ws.close();
  }
}

// Create new target tab
const tabRes = await fetch("http://localhost:9222/json/new?http://localhost:" + PORT, { method: "PUT" });
const tabData = await tabRes.json();
const client = new CDPClient(tabData.webSocketDebuggerUrl);
await client.connect();

await client.send("Page.enable");
await client.send("Emulation.setDeviceMetricsOverride", {
  width: 1440,
  height: 900,
  deviceScaleFactor: 2,
  mobile: false,
});

// Wait 3.5s for Framer Motion and Three.js hero to render
console.log("Waiting for animations to settle...");
await new Promise((r) => setTimeout(r, 3500));

// Capture sections
const sections = [
  { name: "01_hero.png", selector: "#top", scroll: 0 },
  { name: "02_about.png", selector: "#about", scroll: null },
  { name: "03_skills.png", selector: "#skills", scroll: null },
  { name: "04_projects.png", selector: "#projects", scroll: null },
  { name: "05_journal.png", selector: "#diary", scroll: null },
  { name: "06_contact.png", selector: "#contact", scroll: null },
];

for (const sec of sections) {
  if (sec.scroll !== null) {
    await client.send("Runtime.evaluate", {
      expression: `window.scrollTo({ top: ${sec.scroll}, behavior: "instant" });`,
    });
  } else if (sec.selector) {
    await client.send("Runtime.evaluate", {
      expression: `
        (() => {
          const el = document.querySelector("${sec.selector}");
          if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top, behavior: "instant" });
          }
        })();
      `,
    });
  }

  // Wait for reveal animations to trigger upon scroll
  await new Promise((r) => setTimeout(r, 2000));

  const shot = await client.send("Page.captureScreenshot", {
    format: "png",
  });

  const outPath = path.join(SCREENSHOTS_DIR, sec.name);
  fs.writeFileSync(outPath, Buffer.from(shot.data, "base64"));
  console.log(`Saved screenshot: ${sec.name}`);
}

// Also capture a full landing view
await client.send("Runtime.evaluate", { expression: "window.scrollTo(0, 0);" });
await new Promise((r) => setTimeout(r, 1000));
const heroFull = await client.send("Page.captureScreenshot", {
  format: "png",
});
fs.writeFileSync(path.join(SCREENSHOTS_DIR, "hero_overview.png"), Buffer.from(heroFull.data, "base64"));
console.log("Saved screenshot: hero_overview.png");

client.close();
chromeProcess.kill();
server.close();
console.log("Screenshots captured successfully!");
process.exit(0);
