import puppeteer from "puppeteer";
import { fork } from "child_process";

jest.setTimeout(30000); // default puppeteer timeout

describe("Popover test", () => {
  let browser;
  let page;
  let server;

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      if (server.connected) {
        process.send("ok");
        resolve();
      } else {
        reject();
      }
    });

    const options = {
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // настройка для сред ci/cd
      slowMo: 100,
      // расскомментировать для локального прогона и закомменитровать для ci/cd
      // headless: false,
      // devtools: false,
    };

    browser = await puppeteer.launch(options);
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  test("should render popover on click", async () => {
    await page.goto("http://localhost:9000");

    await page.click("[data-toggle='popover']");
    await page.waitForSelector(".popover", { visible: true });

    const popover = await page.$(".popover");
    const isVisible = popover.hidden !== false;
    expect(isVisible).toBe(true);

    const title = await page.$eval(".popover-header", (el) => {
      return el.textContent.trim();
    });
    const content = await page.$eval(".popover-body", (el) => {
      return el.textContent.trim();
    });

    expect(title).toBe("Popover title");
    expect(content).toBe(
      "And here's some amazing content. It's very engaging. Right?",
    );
  });

  afterAll(async () => {
    await browser.close();
  });
});
