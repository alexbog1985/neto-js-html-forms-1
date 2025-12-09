import puppeteer from "puppeteer";

describe("Popover test", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      devtools: true,
      args: ["--no-sandbox"],
    });

    page = await browser.newPage();
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
