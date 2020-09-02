let axios = require('axios')
let mysql = require('mysql')
let querystring = require("querystring");

// *********************************//
// ******** 封装网络请求 ************//
// *********************************//
// 数据请求
function request(config) {
  const instance = axios.create({
    baseURL: 'http://XXXXXXXXXXX',
    timeout: 5000
  })
  instance.interceptors.request.use(config => {
    return config
  }, err => {
    console.log(err);
  })
  instance.interceptors.response.use(res => {
    return res.data
  }, err => {
    console.log(err);
  })
  return instance(config)
}

// 获取首页数据：multidata，data
function getHomeMultidata() {
  return request({
    url: '/home/multidata'
  })
}

function getHomeGoods(type,page) {
  return request({
    url:'/home/data',
    params: {
      type,
      page
    }
  })
}

// 获取详情页数据
function getDetail(iid) {
  return request({
    url: '/detail',
    params: {
      iid
    }
  })
}

function getRecommend() {
  return request({
    url: '/recommend'
  })
}

// 获取分类页数据
function getCategory() {
  return request({
    url: '/category'
  })
}

function getSubcategory(maitKey) {
  return request({
    url: '/subcategory',
    params: {
      maitKey
    }
  })
}

function getCategoryDetail(miniWallkey, type) {
  return request({
    url: '/subcategory/detail',
    params: {
      miniWallkey,
      type
    }
  })
}

// 等待函数,防止访问速度过快造成的数据读取失败
function wait(millSeconds) {
  return new Promise(function(resolve,reject){
    setTimeout(() => {
      resolve('成功执行延迟函数，延迟时间：' + millSeconds)
    }, millSeconds);
  })
}

// *********************************//
// ********** 连接数据库 ************//
// *********************************//

let sqlOptions = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '112233',
  database: 'mall'
}
let con = mysql.createConnection(sqlOptions)
con.connect();

// *********************************//
// ********* 开始爬取数据 ***********//
// *********************************//

  // 爬取首页Multidata数据
  async function homeMultidata() {
    let res = await getHomeMultidata()
    // console.log(res);
    
    // let data = querystring.stringify(res)
    // console.log(data);
    
    let data = await JSON.stringify(res)
    console.log(data);
    // 写入数据
    let srtSql = "insert into home_multidata (data) values (?)"

    await con.query(srtSql,data, (err,res)=>{
      if(err){
        console.log("错误信息：" + err);
      }else{
        console.log("写入成功");}
    })
    console.log("全部写入完成");
  }
  
  // 爬取首页data数据，因为三个分类（pop.sell，new）存在页数不同的问题，这里我分成2个函数来写，本来想加个判断的，这样能用，就先这样写着吧
  async function homeDataPop(thisType){
    // 循环一下页数
    for (let page = 1; page <= 50; page++) {
      await wait(200*page)
      let type = thisType
      let res = await getHomeGoods(type,page)
      let data = await JSON.stringify(res)
      // 写入数据
      let arr = [type,page,data]
      let srtSql = "insert into home_data (type,page,data) values (?,?,?)"
      await con.query(srtSql, arr, (err,res)=>{
        if(err){
          console.log("错误信息：" + err);
        }else{
          console.log(type +'，第'+ page + '页，数据写入成功');
        }
      })
    }
    console.log("全部写入完成");
  }

  async function homeDataSell(sell){
    // 循环一下页数
    for (let page = 1; page <= 20; page++) {
      await wait(200*page)
      let type = sell
      let res = await getHomeGoods(type,page)
      let data = await JSON.stringify(res)
      // 写入数据
      let arr = [type,page,data]
      let srtSql = "insert into home_data (type,page,data) values (?,?,?)"
      await con.query(srtSql, arr, (err,res)=>{
        if(err){
          console.log("错误信息：" + err);
        }else{
          console.log(type +'，第'+ page + '页，数据写入成功');
        }
      })
    }
    console.log("全部写入完成");
  }

  // 获取detail详情页的数据，还是分开来写，里面好像有很多重复的数据
  async function detailDataPop(thisType){
    // 循环一下页数
    for (let page = 1; page <= 50; page++) {
      await wait(200*page)
      let type = thisType
      let res = await getHomeGoods(type,page)
      let iidList = res.data.list
      await iidList.forEach(async (item,i) =>{
        await wait(200*i)
        let iid = item.iid
        let res =  await getDetail(iid)
        let data = await JSON.stringify(res)
        let arr = [iid,data]
        let srtSql = "insert into detail (iid,data) values (?,?)"
        await con.query(srtSql, arr, (err,res)=>{
          if(err){
            console.log("错误信息：" + err);
          }else{
            console.log( iid + '，数据写入成功');
          }
        })
      })
    }
    console.log("全部写入完成");
    
  }

  async function detailDataSell(sell){
    // 循环一下页数
    for (let page = 1; page <= 20; page++) {
      await wait(200*page)
      let type = sell
      let res = await getHomeGoods(type,page)
      let iidList = res.data.list
      iidList.forEach(async (item,i) =>{
        await wait(200*i)
        let iid = item.iid
        let res =  await getDetail(iid)
        let data = await JSON.stringify(res)
        let arr = [iid,data]
        let srtSql = "insert into detail (iid,data) values (?,?)"
        await con.query(srtSql, arr, (err,res)=>{
          if(err){
            console.log("错误信息：" + err);
          }else{
            console.log( iid + '，数据写入成功');
          }
        })
      })
    }
    console.log("全部写入完成");
  }

  // 获取recommend数据
  async function recommendData() {
    let res = await getRecommend()
    let data = await JSON.stringify(res)
    // 写入数据
    let srtSql = "insert into recommend (data) values (?)"
    await con.query(srtSql,data, (err,res)=>{
      if(err){
        console.log("错误信息：" + err);
      }else{
        console.log("写入成功");}
    })
    console.log("全部写入完成");
  }

  // 获取分类页数据
  async function categoryData() {
    let res = await getCategory()
    let data = await JSON.stringify(res)
    // 写入数据
    let srtSql = "insert into category (data) values (?)"
    await con.query(srtSql,data, (err,res)=>{
      if(err){
        console.log("错误信息：" + err);
      }else{
        console.log("写入成功");}
    })
    console.log("全部写入完成");
  }
  // 获取Subcategory数据
  async function subcategoryData() {
    let res = await getCategory()
    let list = res.data.category.list
    await list.forEach(async (item,i) => {
      await wait(200*i)
      let maitKey = item.maitKey
      let res = await getSubcategory(maitKey)
      let data = JSON.stringify(res)
      let arr = [maitKey,data]
      let srtSql = "insert into subcategory (maitKey,data) values (?,?)"
      await con.query(srtSql, arr, (err,res)=>{
        if(err){
          console.log("错误信息：" + err);
        }else{
          console.log(maitKey + '，数据写入成功');
        }
      })
    });
    console.log("全部写入完成");
  }

  // 获取CategoryDetail数据
  async function categoryDetailData() {
    let res = await getCategory()
    let list = res.data.category.list
    await list.forEach(async (item,i) => {
      await wait(200*i)
      let miniWallkey = item.miniWallkey
      let types = ['pop','new','sell']
      types.forEach(async (type,i) => {
        await wait(200*i)
        let res = await getCategoryDetail(miniWallkey, type)
        let data = await JSON.stringify(res)
        let arr = [miniWallkey,type,data]
        let srtSql = "insert into subcategory_detail (miniWallkey,type,data) values (?,?,?)"
        await con.query(srtSql, arr, (err,res)=>{
          if(err){
            console.log("错误信息：" + err);
          }else{
            console.log( miniWallkey + '，数据写入成功');
          }
        })
      });

    });
    console.log("全部写入完成");
  }



// 爬取数据
  homeMultidata()
  // homeDataPop('pop')
  // homeDataPop('new')  
  // homeDataSell('sell')
  // detailDataPop('pop')
  // detailDataPop('new')
  // detailDataSell('sell')
  // recommendData()
  // categoryData()
  // subcategoryData()
  // categoryDetailData()



