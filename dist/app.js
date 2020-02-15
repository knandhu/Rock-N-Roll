var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
var router = require("./router");
app.use("/viatges", router);

app.listen(process.env.PORT || 3000, function() {
  console.log("up and running on port " + process.env.PORT);
});
