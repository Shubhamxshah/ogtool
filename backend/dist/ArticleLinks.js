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
exports.hrefRouter = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const express_1 = require("express");
exports.hrefRouter = (0, express_1.Router)();
function unescapeSelector(selector) {
    return selector.replace(/\\\\/g, "\\").replace(/\\"/g, '"');
}
exports.hrefRouter.post("/href", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { source, tagForArticleLinks, titleTag, markdownTag } = req.body;
    // Unescape all selectors before using them
    const cleanTagForArticleLinks = unescapeSelector(tagForArticleLinks);
    const cleanTitleTag = unescapeSelector(titleTag);
    const cleanMarkdownTag = unescapeSelector(markdownTag);
    const browser = yield puppeteer_1.default.launch({
        headless: true,
        defaultViewport: null,
    });
    const page = yield browser.newPage();
    yield page.goto(source, {
        waitUntil: "domcontentloaded",
    });
    const articleLinks = yield page.evaluate((selector) => {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements)
            .map((link) => link.href)
            .filter((href) => !!href);
    }, cleanTagForArticleLinks);
    const extractDataFromLinks = (links) => __awaiter(void 0, void 0, void 0, function* () {
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
                }, cleanTitleTag, cleanMarkdownTag);
                markdown.push(info);
            }
            catch (err) {
                console.error(`Error scraping ${link}:`, err);
            }
        }
        return markdown;
    });
    if (!articleLinks || articleLinks.length === 0) {
        console.warn("No article links found.");
        yield browser.close();
        return;
    }
    const markdown = yield extractDataFromLinks(articleLinks);
    res
        .status(200)
        .json({
        title: "Links scraper",
        content: markdown,
        content_type: "blog",
        source_url: "...",
        author: "shubham shah",
        user_id: "123",
    });
    yield browser.close();
}));
