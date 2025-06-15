import express from 'express';
import { clickRouter } from './ArticleClicks';
import { hrefRouter } from './ArticleLinks';

const app = express()

app.use(express.json())

const PORT = 3001;

app.get("/ping", (_, res) => {
  res.json("pong")
})

app.use("/api/v1", clickRouter)
app.use("/api/v1", hrefRouter);

app.listen(PORT, () => {
  console.log("server listening on port 3001")
})
