var express = require('express');
var router = express.Router();
let sqlQuery = require("./mysql")

router.get('/',async function(req,res){
  let sqlStr = 'select data from category'
  let result = await sqlQuery(sqlStr)
  result = JSON.parse(result[0].data)
  res.send(result)
})

module.exports = router;
