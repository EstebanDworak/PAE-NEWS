import { Request, Response, Router } from "express";
import fetch from "node-fetch";

const router = Router();

const fetchNews = async (search) => {
  var url =
    "https://newsapi.org/v2/everything?" +
    `q=${search}&` +
    "from=2021-02-25&" +
    "sortBy=popularity&" +
    `apiKey=${process.env.NEWS_API_KEY || "fb7503d86b254f20a7acb7eedfdc855a"}`;

  const request = await fetch(url);

  return await request.json();
};

router.get("/", async (req: Request, res: Response) => {
  res.redirect("/Apple");
});

router.get("/:search", async (req: Request, res: Response) => {
  const { search } = req.params;
  const { articles: news } = await fetchNews(search);
  res.render("home", { search, news });
});

export default router;
