var db = require("../db/db_conn");

module.exports = function(app)
{
    app.get('/', (req, res) => {
        res.render('index.html')
    });

    app.get('/signUp',(req, res) => {
        res.render('signUp.html');
    });

    app.get('/IPFS',(req, res) => {
        res.render('IPFS.html');
    });

    app.get('/login', (req,res) => {
        res.render('login.html');
    });

    // app.get('/validation', (req,res) => {
    //     res.render('validation.html');
    // })

    app.post('/login', (req,res) => {
        let id = req.body.id;
        let password = req.body.password;
        let result;
        let sql = `select id, password from user where id='${id}' and password = '${password}'`;
        console.log(`${id} , ${password}`);
        console.log(sql);
        db.query(sql,function(err, rows, fields) {
            if(err){
                console.log(err);
            }
            else if(rows[0].id == id && rows[0].password == password){
                url = '/sss';
                console.log("일치합니다");
                res.send(url);
            }else {
                result = '실패'
            }

        });
    })
}
