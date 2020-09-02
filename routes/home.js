var express = require('express');
var router = express.Router();
let sqlQuery = require("./mysql")

router.get('/multidata',async function(req,res){
  let sqlStr = 'select data from home_multidata'
  let result = await sqlQuery(sqlStr)
  result = JSON.parse(result[0].data)
  res.send(result)
})

router.get('/data',async function(req,res){
  let type = req.query.type
  let page = req.query.page
  let sqlStr = `select data from home_data where type = ? and page = ?`
  let result = await sqlQuery(sqlStr,[type,page])
  result = JSON.parse(result[0].data)
  res.send(result)
})

module.exports = router;


