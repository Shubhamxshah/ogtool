import puppeteer from "puppeteer";
import { Router } from "express";

interface ScrapedArticle {
  title: string;
  data: string;
}

export const hrefRouter = Router();

function unescapeSelector(selector: string): string {
  return selector.replace(/\\\\/g, "\\").replace(/\\"/g, '"');
}

hrefRouter.post("/href", async (req, res) => {
  const { source, tagForArticleLinks, titleTag, markdownTag } = req.body;

  // Unescape all selectors before using them
  const cleanTagForArticleLinks = unescapeSelector(tagForArticleLinks);
  const cleanTitleTag = unescapeSelector(titleTag);
  const cleanMarkdownTag = unescapeSelector(markdownTag);

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto(source, {
    waitUntil: "domcontentloaded",
  });

  const articleLinks: string[] = await page.evaluate((selector) => {
    const elements = document.querySelectorAll<HTMLAnchorElement>(selector);
    return Array.from(elements)
      .map((link) => link.href)
      .filter((href) => !!href);
  }, cleanTagForArticleLinks);

  const extractDataFromLinks = async (
    links: string[],
  ): Promise<ScrapedArticle[]> => {
    const markdown: ScrapedArticle[] = [];

    for (const link of links) {
      try {
        await page.goto(link, {
          waitUntil: "domcontentloaded",
        });

        const info: ScrapedArticle = await page.evaluate(
          (titleSelector, markdownSelector) => {
            const title =
              (document.querySelector(titleSelector) as HTMLElement | null)
                ?.innerText || "";
            const paragraphs = Array.from(
              document.querySelectorAll(
                markdownSelector,
              ) as NodeListOf<HTMLElement>,
            );
            const data = paragraphs.map((p) => p.innerText).join("\n");
            return { title, data };
          },
          cleanTitleTag,
          cleanMarkdownTag,
        );

        markdown.push(info);
      } catch (err) {
        console.error(`Error scraping ${link}:`, err);
      }
    }

    return markdown;
  };

  if (!articleLinks || articleLinks.length === 0) {
    console.warn("No article links found.");
    await browser.close();
    return;
  }

  const markdown = await extractDataFromLinks(articleLinks);

  res.status(200).json({
    title: "Links scraper",
    content: markdown,
    content_type: "blog",
    source_url: "...",
    author: "shubham shah",
    user_id: "123",
  });

  await browser.close();
});
