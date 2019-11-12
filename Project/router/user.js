var db = require("../db/db_conn");
const Web3 = require("web3");
const web3 = new Web3();
const url = 'http://localhost:8545';
const crypto = require('crypto');

web3.setProvider(new Web3.providers.HttpProvider(url));

web3.eth.defaultAccount = web3.eth.accounts[0];

var myContract = new web3.eth.Contract([
	{
		"constant": false,
		"inputs": [
			{
				"name": "hash",
				"type": "string"
			},
			{
				"name": "ipfs_hash",
				"type": "string"
			}
		],
		"name": "saveHash",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_hash",
				"type": "string"
			}
		],
		"name": "sendHash",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
],'0x98e607c868847ac3f739492a31154d12508245d6',{
    from: "0xc35fbed59c35ebdbaad7a6198096e98919ae7c98",
    getPrice: '20000000'
});



module.exports = function(app){

    app.post('/user/test', async (req, res) =>{
        hash = req.body.hash;
        console.log(hash);
        res.send("test");
    });


    app.post('/user/register', async (req, res) => {
        let id = req.body.id;
        let password = req.body.password;
        let email = req.body.email;
        var current_date = (new Date()).valueOf().toString();   
        var random = Math.random().toString();
        let hash = crypto.createHash('sha256').update(current_date + random).digest('base64');

        console.log(id);
        console.log(password);

        //let sql_meta = `select meta from user;`
        //let sql = `insert into user(id, password) values('${id}','${password}');` 
        let sql = `insert into user(id, password, email) values('${id}', '${password}', '${email}');`;

        db.query(sql, function(err, rows, fields){
            if(err){
                console.log(err);
                res.send(err);
            }else{
                console.log(rows);
            }
        });

        res.send(`개인키: ${hash}`);
    })

    app.post('/user/contract', async (req, res)=>{
        let hash = req.body.hash;
        let key = req.body.private_key;
        let id = req.body.id;
        
        // console.log(id);
        // console.log(key);
        console.log("hash" + hash);
        const cipher = crypto.createCipher('aes-256-cbc', key);
        let result = cipher.update(hash, 'utf8', 'base64'); // 'HbMtmFdroLU0arLpMflQ'
        result += cipher.final('base64');
        console.log(result);

        myContract.methods.saveHash(id, result).send({from: "0xa8ae46b5afc9ca2de76ed24676e0083f0837b579"});

        res.send("블록체인 등록!");
    })

    app.post('/user/validate', async (req, res)=>{
        
        let id = req.body.id;
        let key = req.body.key;

       
        let hash = await myContract.methods.sendHash(id).call({from: "0xa8ae46b5afc9ca2de76ed24676e0083f0837b579"});
        console.log(hash);
        console.log(id);
        
        const decipher = crypto.createDecipher('aes-256-cbc', key);
        let result = decipher.update(hash, 'base64', 'utf8'); 
        result += decipher.final('utf8'); 
        console.log(result);

        res.send(result);
    })


    //2019-11-08 00:14 - 호식 
    app.get('/user/idCheck', (req, res) => {
        let id = req.query.id;
        let sql = `select count(*) as cnt from user where id = '${id}';`;

        db.query(sql, function(err, rows, fields){
            if(err){
                console.log("err >>>>" + err);
                res.send(err);
            }else{
                console.log("cnt >>>> " + rows[0].cnt);
                let result = rows[0].cnt;
                res.send(`${result}`);
            }
        })
    })

    app.get('/user/emailCheck', (req, res) => {
        let email = req.query.email;
        let sql = `select count(*) as cnt from user where email = '${email}';`;

        console.log("email >>>>> " + email);

        db.query(sql, function(err, rows, fields){
            if(err){
                console.log(err);
                res.send(err);
            }else{
                console.log("email.cnt >>>>>> " + rows[0].cnt);
                let result = rows[0].cnt;
                res.send(`${result}`);
            }
        })
    })

    app.get('/user/findIdPw', (req, res) => {
        let email = req.query.email;
        let sql = `select id , password from user where email = '${email}';`;

        console.log("email >>>>>>" + email);

        db.query(sql, function (err, rows, fields) {
            console.log(rows);
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                let result;
                if (rows.length > 0) {
                    result = rows[0].id + "/" + rows[0].password;
                } else {
                    result = -1;
                }
                res.send(`${result}`);
            }
        })
    })
}
