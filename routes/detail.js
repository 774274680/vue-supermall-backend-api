var express = require('express');
var router = express.Router();
let sqlQuery = require("./mysql")

router.get('/',async function(req,res){
  let iid = req.query.iid
  let sqlStr = `select data from detail where iid = ?`
  let result = await sqlQuery(sqlStr,iid)
  result = JSON.parse(result[0].data)
  res.send(result)
})

module.exports = router;
