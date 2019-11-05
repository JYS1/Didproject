var db = require("../db/db_conn");

module.exports = function(app){
    
    app.post('/user/test', async (req, res) =>{
        
        hash = req.body.hash;

        console.log(hash);

       
    });


    app.post('/user/register', async (req, res) => {
        let id = req.body.id;
        let password = req.body.password;
        let meta = req.body.meta;

        console.log(id);
        console.log(password);
        console.log(meta);

        let sql_meta = `select meta from user;`
        let sql = `insert into user(id, password, meta) values('${id}','${password}','${meta}');`

        db.query(sql, function(err, rows, fields){
            if(err){
                console.log(err);
                res.end();
            }else{
                console.log(rows);
            }
        });

        res.send(`회원가입 완료`);
    })
}
