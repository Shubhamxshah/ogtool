"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clickRouter = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const express_1 = require("express");
exports.clickRouter = (0, express_1.Router)();
exports.clickRouter.post("/click", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { source, tagForArticleLinks, titleTag, markdownTag } = req.body;
    const browser = yield puppeteer_1.default.launch({
        headless: true,
        defaultViewport: null,
    });
    const page = yield browser.newPage();
    yield page.goto(source, {
        waitUntil: "domcontentloaded",
    });
    const links = [];
    // Get count of clickable elements
    const clickableCount = yield page.$$eval(tagForArticleLinks, (divs) => divs.length);
    for (let i = 0; i < clickableCount; i++) {
        // Re-select fresh divs because DOM is reset after navigation
        const clickableDivs = yield page.$$(tagForArticleLinks);
        if (i >= clickableDivs.length) {
            console.warn(`Index ${i} is out of bounds after navigation.`);
            break;
        }
        // Click the current div
        yield Promise.all([
            clickableDivs[i].click(),
            page.waitForNavigation({ waitUntil: "domcontentloaded" }),
        ]);
        // Capture URL
        links.push(page.url());
        // Go back to blog list
        yield page.goBack({ waitUntil: "domcontentloaded" });
    }
    // Now scrape the links
    const markdown = [];
    for (const link of links) {
        try {
            yield page.goto(link, {
                waitUntil: "domcontentloaded",
            });
            const info = yield page.evaluate((titleSelector, markdownSelector) => {
                var _a;
                const title = ((_a = document.querySelector(titleSelector)) === null || _a === void 0 ? void 0 : _a.innerText) || "";
                const paragraphs = Array.from(document.querySelectorAll(markdownSelector));
                const data = paragraphs.map((p) => p.innerText).join("\n");
                return { title, data };
            }, titleTag, markdownTag);
            markdown.push(info);
        }
        catch (err) {
            console.error(`Error scraping ${link}:`, err);
        }
    }
    res.status(200).json(markdown);
    yield browser.close();
}));
