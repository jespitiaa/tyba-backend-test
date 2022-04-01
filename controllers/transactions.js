require('dotenv').config();
const Database = require('../database/instance');

async function createTransaction (username, userId, transactionType, {additionalInfo}){
    const db = await Database.Get();
    const collection = db.collection('userTransactions');
    return collection.insertOne({
        username: username,
        userId: userId,
        type: transactionType,
        timestamp: Date.now(),
        additionalInfo: additionalInfo ?? 'none'
    })
    .catch((e)=>{
        //in this case, throwing the exception would interrupt the execution of the processes that call this method
        //since it is not vitally crucial, an exception could be handled by locally storing the intended transaction and eventually batching them to the DB
        //just print it for now
        console.log(e);
    });
}

async function readTransactions (username){
    try{
        const db = await Database.Get();
        const collection = db.collection('userTransactions');
        console.log('reading transactions')
        let cursor = collection.find({'username':username});
        let transactions = [];
        await cursor.forEach((transaction)=>{
            console.log(transaction)
            transactions.push(transaction)});
        return transactions;
    }
    catch(e){
        console.log(e)
        throw {status: 500, msg: `failed reading transactions ${e}`}
    }
}

module.exports = {
    createTransaction,
    readTransactions
};