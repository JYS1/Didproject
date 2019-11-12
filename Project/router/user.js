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
],'0xc098e89814b55336d7a83048f91c779ec0576970',{
    from: "0x3a6adf7aaa27093e89f4f0dc09fe881cea2d3c87",
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
        var current_date = (new Date()).valueOf().toString();   
        var random = Math.random().toString();
        let hash = crypto.createHash('sha256').update(current_date + random).digest('base64');

        console.log(id);
        console.log(password);

        //let sql_meta = `select meta from user;`
        let sql = `insert into user(id, password) values('${id}','${password}');`

        db.query(sql, function(err, rows, fields){
            if(err){
                console.log(err);
                res.end();
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
        let result = cipher.update(hash, 'utf8', 'base64'); 
        result += cipher.final('base64');
        console.log(result);

        myContract.methods.saveHash(id, result).send({from: "0x3a6adf7aaa27093e89f4f0dc09fe881cea2d3c87"});

        res.send("블록체인 등록!");
    })

    app.post('/user/validate', async (req, res)=>{
        
        let id = req.body.id;
        let key = req.body.key;

       
        let hash = await myContract.methods.sendHash(id).call({from: "0x3a6adf7aaa27093e89f4f0dc09fe881cea2d3c87"});
        console.log(hash);
        console.log(id);
        
        const decipher = crypto.createDecipher('aes-256-cbc', key);
        let result = decipher.update(hash, 'base64', 'utf8'); 
        result += decipher.final('utf8'); 
        console.log(result);

        res.send(result);
    })
}
