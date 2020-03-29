var express = require("express");
var fs = require("fs");
var router = express.Router();

router.get("/main", (req, res, next) => {
  //if (!req.session.user) return res.redirect("/users/login"); //若没有登陆则转入登陆页面
  res.render("gists", { user: req.session.user });
});

router.post("/save", async (req, res, next) => {
  //if (!req.body.name) throw new Error("Gist Name不能为空!");
  const content = await fs.Promises.readFile("index.php");
});

module.exports = router;
