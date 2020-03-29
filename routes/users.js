const GH_CLIENT_ID = "ffe884d420da770fd3a9";
const GH_CLIENT_SECRET = "9609fec27137d3685e848e9f839deee1051de241";
const GH_CALLBACK = "http://localhost:3000/users/ghcallback";

//构成表单数据
require("url-search-params-polyfill");
//发起HTTP请求
const axios = require("axios");
//分析URL里的参数
const querystring = require("querystring");

var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

//GitHub登陆页面
router.get("/login", function(req, res, next) {
  const url =
    "https://github.com/login/oauth/authorize" +
    "?client_id=" +
    encodeURIComponent(GH_CLIENT_ID) +
    "&redirect_url=" +
    encodeURIComponent(GH_CALLBACK);
  res.render("login", { url });
});

//退出登陆逻辑
router.get("/logout", async (req, res) => {
  if (req.session) await req.session.destroy(); //销毁服务器上session文件
  res.redirect("/");
});

router.get("/ghcallback", async (req, res) => {
  if (!req.query.code) res.status(500).send("bad code!");
  console.log("in callback");
  console.log(req.query.code);

  //拼接POST请求参数
  let params = new URLSearchParams();
  params.append("client_id", GH_CLIENT_ID);
  params.append("client_secret", GH_CLIENT_SECRET);
  params.append("code", req.query.code);
  params.append("redirect_url", GH_CALLBACK);

  //发起请求
  const { data } = await axios.post(
    "https://github.com/login/oauth/access_token",
    params
  );

  //使用querystring提取access_token的值
  if (data) {
    const acode = querystring.parse(data).access_token;
    //使用access_token调用Github接口查询当前用户的信息
    const user = await axios.get(
      "https://api.github.com/user?access_token=" + acode
    );
    console.log("Got user info:", user.data);

    //将用户数据存入session
    req.session.user = user.data;
    res.redirect("/"); //转回主页
  }
});
module.exports = router;
