var db = require("../db/db_conn");
const Web3 = require("web3");
const web3 = new Web3();
const url = 'http://localhost:8545';

web3.setProvider(new Web3.providers.HttpProvider(url));

module.exports = function(app){
    
    app.post('/user/test', async (req, res) =>{
        hash = req.body.hash;
        console.log(hash);
        res.send("test");
    });


    app.post('/user/register', async (req, res) => {
        let id = req.body.id;
        let password = req.body.password;
        let meta = await web3.eth.personal.newAccount(password);

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

        res.send(`개인키: ${meta}`);
    })

    app.post('/user/contract', async (req, res)=>{
        let hash = req.body.hash;
        let key = req.body.private_key;
        let sql = `select meta from user;`
        db.query(sql, function(err, row, fields){
            if(err){
                console.log(err);
                res.send(`에러가 발생`);
            }else{
                if(key=rows[0].meta){
                    break;
                }else{
                    res.send('해당 개인키는 존재하지 않습니다');
                }
            }
        });
        

    })
}
