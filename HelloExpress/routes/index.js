var express = require('express');
var router = express.Router();
var mysql = require("mysql");

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

let client = mysql.createConnection({
  user: "root",
  password: "1234",
  database: "mysqltest"
})

router.get('/create', function(req, res, next){
  client.query("SELECT * FROM products;", function(err, result, field){
    if(err){
      console.log(err);
      console.log("쿼리 문제 존재");
    }else{
      res.render('create',{
         results: result
      });
    }
  });
});

router.post('/create', function(req, res, next){
  var body = req.body;

  client.query("INSERT INTO products (name, modelnumber, series) VALUES(?, ?, ?)",[
    body.name, body.modelnumber, body.series
  ], function(){
    res.redirect("/create");
  });
});

module.exports = router;
