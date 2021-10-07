const Web3 = require("web3");
const web3 = new Web3('https://ropsten.infura.io/v3/3e3c4c7cd6b24318b2b25da9e5866632') ;
const Tx = require('ethereumjs-tx').Transaction
const Transaction = require("../models/transaction");

const getBalance = (req,res) =>{
    web3.eth.getBalance(req.body.transaction.Ethaddress,async(err, result)=> {
        if (err) {
          console.log(err)
        } else {
          //console.log(web3.utils.fromWei(result, "ether") + " ETH")
          var bal =await  web3.utils.fromWei(result, "ether") + " ETH";
            }
            //res.send(req.body.transaction.Ethaddress)
            res.send(bal)
      console.log(bal) 
      })
}

const sendTransaction = async (req,res) =>{
    const pkey1=  Buffer.from(req.body.transaction.Pkey,'hex');
  web3.eth.getTransactionCount(req.body.transaction.Saddress,async (err, txCount) => {

    const txObject = {
         nonce: web3.utils.toHex(txCount),
         to: req.body.transaction.Raddress,
         value: web3.utils.toHex(web3.utils.toWei(req.body.transaction.Amount, 'ether')),
         gasLimit: web3.utils.toHex(21000),
         gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
    }
    
    const tx = new Tx(txObject, { chain: 'ropsten' })
tx.sign(pkey1)
const serializedTransaction = tx.serialize()
const raw = '0x' + serializedTransaction.toString('hex')

await web3.eth.sendSignedTransaction(raw, (err, txHash) => {
  if(err){
    console.log(err)
  }else{
    console.log('txHash: ', txHash)
    var hash=  "TxHash"+":"+" "+txHash;
  }
  res.send(hash);
   web3.eth.getTransaction(txHash)
        .then(async transaction => {
            const newTransaction = new Transaction({
                
                Txid : transaction.hash,
                Saddress : transaction.from,
                Raddress : transaction.to,
                Amount :transaction.value
            });
            await newTransaction.save();
        })
        .catch(err => {
            res.json(err);
        });
 })
 
}) 
}

module.exports = {getBalance,sendTransaction};