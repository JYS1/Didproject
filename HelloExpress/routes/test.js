var express =require('express');
var router = express.Router();

router.get("/hahaha", function(req, res, next){
    res.send("라우터 생성");
})

module.exports = router;