import puppeteer from "puppeteer";
import { Router } from "express";

interface ScrapedArticle {
  title: string;
  data: string;
}

export const hrefRouter = Router()

hrefRouter.post("/href", async (req, res) => {
  const {source, tagForArticleLinks, titleTag, markdownTag} = req.body;
  
    const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto(source, {
    waitUntil: "domcontentloaded",
  });

  const articleLinks: string[] = await page.evaluate(
    (selector) => {
      const elements = document.querySelectorAll<HTMLAnchorElement>(selector);
      return Array.from(elements)
        .map((link) => link.href)
        .filter((href) => !!href);
    },
    tagForArticleLinks
  );

  const extractDataFromLinks = async (links: string[]): Promise<ScrapedArticle[]> => {
    const markdown: ScrapedArticle[] = [];

    for (const link of links) {
      try {
        await page.goto(link, {
          waitUntil: "domcontentloaded",
        });

        const info: ScrapedArticle = await page.evaluate(
          (titleSelector, markdownSelector) => {
            const title =
              (document.querySelector(titleSelector) as HTMLElement | null)?.innerText || "";
            const paragraphs = Array.from(
              document.querySelectorAll(markdownSelector) as NodeListOf<HTMLElement>
            );
            const data = paragraphs.map((p) => p.innerText).join("\n");
            return { title, data };
          },
          titleTag,
          markdownTag
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

  res.status(200).json(markdown)

  await browser.close();
})

