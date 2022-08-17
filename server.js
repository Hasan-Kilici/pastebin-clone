const http = require("http");
const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const server = http.createServer(app);
const path = require("path");

const cookieParser = require("cookie-parser");
const axios = require("axios");

app.use(cookieParser());
const port = 8080;

app.use(bodyParser.json()).use(
  bodyParser.urlencoded({
    extended: true,
  })
);
//Statik
app.use(express.static("public"));
app.set("src", "path/to/views");
//Generate token
function generate_token(length) {
  var a =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_".split("");
  var b = [];
  for (var i = 0; i < length; i++) {
    var j = (Math.random() * (a.length - 1)).toFixed(0);
    b[i] = a[j];
  }
  return b.join("");
}
//MongoDB
const dbURL = process.env.db;
mongoose
  .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    server.listen(port, () => {
      console.log("mongoDB Bağlantı kuruldu");
    });
  })
  .catch((err) => console.log(err));
//Collections
let Texts = require("./models/text.js");
//viewPort
app.set("view engine", "ejs");
//DB Support
app.use(morgan("dev"));
//Pages
//Home
app.get('/',(req,res)=>{
  res.render(`${__dirname}/src/pages/index.ejs`)
})
//Text Page
app.get('/view/:token',(req,res)=>{
  let token = req.params.token;

  Texts.findOne({token : token})
  .then((textResult)=>{
    res.render(`${__dirname}/src/pages/text.ejs`,{
      title : textResult.title,
      text : textResult.text,
      user : textResult.user,
    })
  })
})
//Forms
//New text
app.post('/new/text/',(req,res)=>{
  let user = req.body.user;
  let text = req.body.text;
  let title = req.body.title;
  let token = generate_token(36);
  
  let NText = new Texts ({
    user : user,
    text : text,
    title : title,
    token : token,
  })
  NText.save()
  .then((result)=>{
    res.send(`
    Metin Linki : <a href="https://${req.headers.host}/view/${result.token}"><span>https://${req.headers.host}/view/${result.token}</span></a>
    <br>
    <button onclick="copyUrl()">Kopyala</button>
    <script>
    function copyUrl(){
      let domain = "${req.headers.host}";
      let token = "${result.token}";

      navigator.clipboard.writeText(domain+"/view/"+token);
     }
    </scipt>
    `)
  })
}) 
