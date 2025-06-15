"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ArticleClicks_1 = require("./ArticleClicks");
const ArticleLinks_1 = require("./ArticleLinks");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const PORT = 3001;
app.get("/ping", (_, res) => {
    res.json("pong");
});
app.use("/api/v1", ArticleClicks_1.clickRouter);
app.use("/api/v1", ArticleLinks_1.hrefRouter);
app.listen(PORT, () => {
    console.log("server listening on port 3001");
});
