var express = require("express");  //express framework 가져온다
var app = express();    // app에 express()
const bodyParser = require('body-parser');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use('/public',express.static(__dirname+ '/public'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

var router = require("./router/main")(app); //순서 위치 중요
var api = require("./router/user")(app);

var server = app.listen(80, function(){
    console.log("Express server started PORT:80");
})
