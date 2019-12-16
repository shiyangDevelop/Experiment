const express = require("express");
const Mock = require("mockjs");
const app = express();
app.get("/getData", function(req, res) {
  let arr = []
  for (var i = 0; i < 30; i++) {
    arr.push({
        "name": Mock.Random.cname()
      })
  }
  res.send('<!DOCTYPE html><html><head><title>返回的网页</title></head><body>123456789</body></html>');
});
app.listen(9000, () => console.log("Example app listening on port 9000!"));
