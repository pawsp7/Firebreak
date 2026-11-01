/**
 * Captures the main Firebreak screens into /screenshots.
 * Uses system Google Chrome via puppeteer-core.
 */
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const OUT = path.resolve("screenshots");
fs.mkdirSync(OUT, { recursive: true });

const chrome =
  process.env.CHROME_PATH ??
  ["/usr/bin/google-chrome-stable", "/usr/local/bin/google-chrome", "/usr/bin/google-chrome"].find((p) =>
    fs.existsSync(p),
  );

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--hide-scrollbars",
    "--window-size=1440,900",
  ],
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
});

const page = await browser.newPage();
page.setDefaultTimeout(45000);

async function waitForMap(p) {
  await p.waitForSelector(".map-el canvas", { timeout: 25000 });
  await p.waitForFunction(
    () => {
      const c = document.querySelector(".map-el canvas");
      return c && c.width > 80 && c.height > 80;
    },
    { timeout: 20000 },
  );
  await new Promise((r) => setTimeout(r, 2800));
}

async function dismissAnswer(p) {
  const close = await p.$(".answer button");
  if (close) {
    await close.click();
    await p.waitForSelector(".answer", { hidden: true, timeout: 4000 }).catch(() => {});
  }
}

async function shot(name, url, after) {
  await page.goto(url, { waitUntil: "networkidle0", timeout: 45000 });
  await new Promise((r) => setTimeout(r, 1200));
  if (after) await after(page);
  await page.screenshot({ path: path.join(OUT, name), type: "png" });
  console.log("wrote", name);
}

const jasper = `${BASE}/?mode=demo&view=map&q=Jasper&hour=20`;

try {
  await shot("01-landing.png", `${BASE}/`);

  await shot("02-live-map.png", `${BASE}/?view=map`, async (p) => {
    await waitForMap(p);
    await new Promise((r) => setTimeout(r, 2500));
  });

  await shot("06-jasper-replay.png", jasper, async (p) => {
    await waitForMap(p);
    await dismissAnswer(p);
    await new Promise((r) => setTimeout(r, 800));
  });

  await shot("03-am-i-safe.png", jasper, async (p) => {
    await waitForMap(p);
    await p.waitForSelector(".answer", { timeout: 20000 });
    await new Promise((r) => setTimeout(r, 600));
  });

  await shot("04-briefing.png", jasper, async (p) => {
    await waitForMap(p);
    await dismissAnswer(p);
    await p.waitForSelector(".side-right", { timeout: 20000 });
    await p.evaluate(() => {
      const el = document.querySelector(".side-right");
      if (el) el.scrollTop = 0;
    });
    await new Promise((r) => setTimeout(r, 500));
  });

  await shot("05-escape-routes.png", jasper, async (p) => {
    await waitForMap(p);
    await dismissAnswer(p);
    await p.waitForSelector(".route, .side-right", { timeout: 20000 });
    await p.evaluate(() => {
      const el = document.querySelector(".side-right");
      if (el) el.scrollTop = el.scrollHeight;
    });
    await new Promise((r) => setTimeout(r, 800));
  });

  await shot("07-community-list.png", jasper, async (p) => {
    await waitForMap(p);
    await dismissAnswer(p);
    await p.waitForSelector(".side-left", { timeout: 20000 });
    await new Promise((r) => setTimeout(r, 400));
  });

  await shot("08-about-model.png", `${BASE}/?mode=demo&view=map&hour=20`, async (p) => {
    await waitForMap(p);
    const buttons = await p.$$("button");
    for (const b of buttons) {
      const text = await p.evaluate((el) => el.textContent, b);
      if (text && text.toLowerCase().includes("model")) {
        await b.click();
        break;
      }
    }
    await p.waitForSelector(".modal", { timeout: 8000 });
    await new Promise((r) => setTimeout(r, 400));
  });

  await shot("09-french.png", `${BASE}/?mode=demo&view=map&q=Jasper&lang=fr&hour=20`, async (p) => {
    await waitForMap(p);
    await dismissAnswer(p);
    await p.waitForSelector(".side-right", { timeout: 20000 });
    await new Promise((r) => setTimeout(r, 500));
  });

  await shot("10-arabic.png", `${BASE}/?mode=demo&view=map&q=Jasper&lang=ar&hour=20`, async (p) => {
    await waitForMap(p);
    await dismissAnswer(p);
    await p.waitForSelector(".side-right", { timeout: 20000 });
    await new Promise((r) => setTimeout(r, 500));
  });

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await shot("11-mobile-landing.png", `${BASE}/`);
  await shot("12-mobile-map.png", jasper, async (p) => {
    await waitForMap(p);
    await dismissAnswer(p);
    await new Promise((r) => setTimeout(r, 800));
  });
} finally {
  await browser.close();
}
