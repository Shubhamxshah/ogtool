import puppeteer from "puppeteer";

const ScrapeArticlesWithClicks = async (
  source,
  tagForArticleLinks,
  titleTag,
  markdownTag,
) => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto(source, {
    waitUntil: "domcontentloaded",
  });

  let links = [];

  // Get count of clickable elements
  const clickableCount = await page.$$eval(
    tagForArticleLinks,
    (divs) => divs.length,
  );

  for (let i = 0; i < clickableCount; i++) {
    // Re-select fresh divs because DOM is reset after navigation
    const clickableDivs = await page.$$(tagForArticleLinks);

    // Click the current div
    await Promise.all([
      clickableDivs[i].click(),
      page.waitForNavigation({ waitUntil: "domcontentloaded" }),
    ]);

    // Capture URL
    links.push(page.url());

    // Go back to blog list
    await page.goBack({ waitUntil: "domcontentloaded" });
  }

  // Now scrape the links
  const markdown = [];
  for (const link of links) {
    try {
      await page.goto(link, {
        waitUntil: "domcontentloaded",
      });

      const info = await page.evaluate(
        (titleTag, markdownTag) => {
          const title = document.querySelector(titleTag)?.innerText || "";
          const paragraphs = Array.from(document.querySelectorAll(markdownTag));
          const data = paragraphs.map((p) => p.innerText).join("\n");
          return { title, data };
        },
        titleTag,
        markdownTag,
      );

      markdown.push(info);
    } catch (err) {
      console.error(`Error scraping ${link}:`, err);
    }
  }

  console.log(markdown);

  await browser.close();
};

ScrapeArticlesWithClicks(
  "https://quill.co/blog",
  ".bg-white.p-\\[30px\\].hover\\:bg-slate-50",
  'h1[class*="text-[48px]"]',
  ".text-slate-700.px-7.md\\:px-12.py-1.text-\\[18px\\]",
);
