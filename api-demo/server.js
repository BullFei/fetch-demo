const express = require("express");
const app = express();

app.use(express.json()); //处理json格式的转换
app.use(express.urlencoded({ extended: true })); //处理querystring这种格式的数据处理



//处理一下跨域
app.use((req, res, next) => {

  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type,token",
  });
  //如果请求方式是OPTIONS 预检请求，直接通过
  if(req.method === "OPTIONS"){
    res.send('');
  }else{
    next();
  }

});

//中间件
app.use((req, res, next) => {
  //判断请求头中是否有token字段，有就下一步，否则报错
  if(req.get('token')){
    req.auth = req.get("token");
    next();
  }else{
    res.status(401).send("未授权");
  }
})

app.get("/a", (req, res) => {
  res.send("/a " + req.auth);
})

app.get("/b", (req, res) => {
  res.send("/b " + + req.auth);
})
app.post("/hello", (req, res) => {
  /*
    ?get 请求也能传请求体数据么？
    当然可以，千万不要局限了，get请求时也可以传 请求体数据
                          post请求也可以传 query 数据(?参数)

    后台提供的接口，可能一个get请求，他需要前端也传递一个请求体过来
                  可能一个post请求，它需要前端也传递一些query数据过来。
  */
  console.log(req.body);
  console.log(req.query);

  //前端必须要在请求体中，传递一个password，然后值是123456，我才响应正确的内容。
  if (req.body.password === "123456") {
    res.send(req.query);
  } else {
    res.status(400).send("请求参数有误");
  }
});

app.post("/world", (req, res) => {
  if (req.body.name === "张三") {
    res.send("ok");
  } else {
    res.status(400).send("no ok");
  }
});

app.listen(3000, () => {
  console.log("服务启动成功");
});
