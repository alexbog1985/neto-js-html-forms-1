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
      // slowMo: 100,
      // расскомментировать для локального прогона и закомменитровать для ci/cd
      // headless: false,
      // devtools: false,
    };

    browser = await puppeteer.launch(options);
    page = await browser.newPage();

    await page.goto("http://localhost:9000");
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  beforeEach(async () => {
    const popover = await page.$(".popover");
    if (popover) {
      await page.click("[data-toggle='popover']");
      await page.waitForFunction(() => !document.querySelector(".popover"));
    }
  });

  test("should render popover on click", async () => {
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

  test("should close popover on second click", async () => {
    await page.click("[data-toggle='popover']");
    await page.waitForSelector(".popover", { visible: true });

    let popoverVisible = await page.$(".popover");
    expect(popoverVisible).not.toBeNull();

    await page.click("[data-toggle='popover']");
    await page.waitForFunction(() => !document.querySelector(".popover"));

    popoverVisible = await page.$(".popover");
    expect(popoverVisible).toBeNull();
  });

  test("should have correct popover style and structure", async () => {
    await page.click("[data-toggle='popover']");
    await page.waitForSelector(".popover", { visible: true });

    const hasArrow = await page.$(".popover .arrow");
    const hasHeader = await page.$(".popover .popover-header");
    const hasBody = await page.$(".popover .popover-body");

    expect(hasArrow).not.toBeNull();
    expect(hasHeader).not.toBeNull();
    expect(hasBody).not.toBeNull();

    const popoverClasses = await page.$eval(".popover", (el) => el.className);
    expect(popoverClasses).toContain("popover");
    expect(popoverClasses).toContain("top");
  });

  test("should position popover correctly above button", async () => {
    await page.click("[data-toggle='popover']");
    await page.waitForSelector(".popover", { visible: true });

    // Получаем координаты элементов
    const positions = await page.evaluate(() => {
      const button = document.querySelector("[data-toggle='popover']");
      const popover = document.querySelector(".popover");

      const buttonRect = button.getBoundingClientRect();
      const popoverRect = popover.getBoundingClientRect();

      return {
        button: {
          top: buttonRect.top,
          bottom: buttonRect.bottom,
          left: buttonRect.left,
          width: buttonRect.width,
          height: buttonRect.height,
        },
        popover: {
          top: popoverRect.top,
          bottom: popoverRect.bottom,
          left: popoverRect.left,
          width: popoverRect.width,
          height: popoverRect.height,
        },
        arrow: {
          exists: popover.querySelector(".arrow"),
        },
      };
    });

    // Popover должен быть выше кнопки
    expect(positions.popover.bottom).toBeLessThan(positions.button.top);

    // Popover должен быть центрирован по горизонтали относительно кнопки
    const buttonCenter = positions.button.left + positions.button.width / 2;
    const popoverCenter = positions.popover.left + positions.popover.width / 2;
    const centerDiff = Math.abs(buttonCenter - popoverCenter);

    // Допускаем небольшую погрешность в 5px из-за округления
    expect(centerDiff).toBeLessThan(5);
  });
});
