import puppeteer from "puppeteer";
import { Router } from "express";
export const clickRouter = Router();

interface ScrapedArticle {
  title: string;
  data: string;
}

// Helper function to unescape CSS selectors
function unescapeSelector(selector: string): string {
  return selector.replace(/\\\\/g, '\\').replace(/\\"/g, '"');
}

clickRouter.post("/click", async (req, res) => {
  const { source, tagForArticleLinks, titleTag, markdownTag } = req.body;
  
  // Unescape all selectors before using them
  const cleanTagForArticleLinks = unescapeSelector(tagForArticleLinks);
  const cleanTitleTag = unescapeSelector(titleTag);
  const cleanMarkdownTag = unescapeSelector(markdownTag);
  
  console.log('Original selectors:', { tagForArticleLinks, titleTag, markdownTag });
  console.log('Cleaned selectors:', { cleanTagForArticleLinks, cleanTitleTag, cleanMarkdownTag });
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  
  try {
    const page = await browser.newPage();
    await page.goto(source, {
      waitUntil: "domcontentloaded",
    });
    
    const links: string[] = [];
    
    // Get count of clickable elements using cleaned selector
    const clickableCount: number = await page.$$eval(
      cleanTagForArticleLinks,
      (divs) => divs.length,
    );
    
    for (let i = 0; i < clickableCount; i++) {
      // Re-select fresh divs because DOM is reset after navigation
      const clickableDivs = await page.$$(cleanTagForArticleLinks);
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
          cleanTitleTag,    // Use cleaned selectors
          cleanMarkdownTag  // Use cleaned selectors
        );
        
        markdown.push(info);
      } catch (err) {
        console.error(`Error scraping ${link}:`, err);
      }
    }
    
    // Combine all scraped content into a single markdown string
    const combinedMarkdown = markdown.map(article => 
      `# ${article.title}\n\n${article.data}\n\n---\n\n`
    ).join('');
    
    res.status(200).json({
      title: "Click scraper", 
      content: combinedMarkdown, 
      content_type: "blog", 
      source_url: source, 
      author: "shubham shah", 
      user_id: "123"
    });
    
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'Failed to scrape content', details: error });
  } finally {
    await browser.close();
  }
});
