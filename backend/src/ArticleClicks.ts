import puppeteer from "puppeteer";
import { Router } from "express";

export const clickRouter = Router();

interface ScrapedArticle {
  title: string;
  data: string;
}

clickRouter.post("/click" ,async (req, res) => {
  const {source, tagForArticleLinks, titleTag, markdownTag} = req.body;
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto(source, {
    waitUntil: "domcontentloaded",
  });

  const links: string[] = [];

  // Get count of clickable elements
  const clickableCount: number = await page.$$eval(
    tagForArticleLinks,
    (divs) => divs.length,
  );

  for (let i = 0; i < clickableCount; i++) {
    // Re-select fresh divs because DOM is reset after navigation
    const clickableDivs = await page.$$(tagForArticleLinks);

    if (i >= clickableDivs.length) {
      console.warn(`Index ${i} is out of bounds after navigation.`);
      break;
    }

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
  const markdown: ScrapedArticle[] = [];
  for (const link of links) {
    try {
      await page.goto(link, {
        waitUntil: "domcontentloaded",
      });

      const info: ScrapedArticle = await page.evaluate(
        (titleSelector, markdownSelector) => {
          const title = (document.querySelector(titleSelector) as HTMLElement | null)?.innerText || "";
          const paragraphs = Array.from(
            document.querySelectorAll(markdownSelector) as NodeListOf<HTMLElement>,
          );
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

  res.status(200).json(markdown)

  await browser.close();
})

