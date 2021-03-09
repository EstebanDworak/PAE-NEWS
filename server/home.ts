import { Request, Response, Router } from "express";
import fetch from "node-fetch";
import User from "./User";

var multer = require("multer");
var upload = multer({ dest: "uploads/" });

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

router.post("/register", upload.single("avatar"), function (req, res, next) {
  console.log(req.body);
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    user.save();
    res.render("register", { success: true });
  } catch {
    res.render("register", { error: true });
  }
});

router.get("/register", async (req: Request, res: Response) => {
  res.render("register", {});
});
router.get("/", async (req: Request, res: Response) => {
  res.redirect("/Apple");
});

router.get("/:search", async (req: Request, res: Response) => {
  const { search } = req.params;
  const { articles: news } = await fetchNews(search);
  res.render("home", { search, news });
});

export default router;
