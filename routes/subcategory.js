var express = require('express');
var router = express.Router();
let sqlQuery = require("./mysql")

router.get('/',async function(req,res){
  let maitKey = req.query.maitKey
  let sqlStr = `select data from subcategory where maitKey = ?`
  let result = await sqlQuery(sqlStr,[maitKey])
  result = JSON.parse(result[0].data)
  res.send(result)
})

router.get('/detail',async function(req,res){
  let miniWallkey = req.query.miniWallkey
  let type = req.query.type
  let sqlStr = `select data from subcategory_detail where miniWallkey = ? and type = ?`
  let result = await sqlQuery(sqlStr,[miniWallkey,type])
  result = JSON.parse(result[0].data)
  res.send(result)
})

module.exports = router;
