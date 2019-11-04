var db = require("../db/db_conn");

module.exports = function(app)
{
    app.get('/', (req, res) => {
        res.render('index.html')
    });

    app.get('/signUp',(req, res) => {
        res.render('signUp.html');
    });

    app.post('/main/login', (req,res) => {
        let id = req.body.id;
        let password = req.body.password;
        let result;
        let sql = `select id, password from user where id='${id}' and password = '${password}'`;
        // console.log(`param data : ${id} , ${password}`);
        // console.log(sql);
        db.query(sql,function(err, rows, fields) {
            if(err){
                console.log(err);
            }
            else if(rows[0].id == id && rows[0].password == password){
                result = '로그인성공';
                console.log("일치합니다");
                res.send(result);
                console.log('hehe');
            }

        });
        console.log('ㅇㅇ');

    })
}
