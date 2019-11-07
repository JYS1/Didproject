var db = require("../db/db_conn");
const Web3 = require("web3");
const web3 = new Web3();
const url = 'http://localhost:8545';

web3.setProvider(new Web3.providers.HttpProvider(url));

web3.eth.defaultAccount = web3.eth.accounts[0];

var myContract = new web3.eth.Contract([
	{
		"constant": false,
		"inputs": [
			{
				"name": "_hash",
				"type": "address"
			},
			{
				"name": "_ipfs",
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
				"type": "address"
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
],'0xe1a9850c8181a963e3124a45db45ce05f4256b06',{		//스마트 컨트렉트
    from: '0x8de10d828c913c528ee3cf81ce8dd23a3cb26fa1',	//eth.coinbase
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
        let meta = await web3.eth.personal.newAccount(password);

        console.log(id);
        console.log(password);
        console.log(meta);

        //let sql_meta = `select meta from user;`
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
        //let sql = `select meta from user;`

        console.log(hash);
        console.log(key);




        myContract.methods.saveHash(key, hash).send({from: '0x3a6adf7aaa27093e89f4f0dc09fe881cea2d3c87'});

        res.send("블록체인 등록!");
    })

    app.post('/user/validate', async (req, res)=>{
        let key = req.body.key;
        console.log(key);

        let hash = await myContract.methods.sendHash(key).call();
        console.log(hash);
        res.send(hash);
    })
}
