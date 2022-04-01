require('dotenv').config();
const jwt = require('jsonwebtoken');
const Blowfish = require("blowfish");
const Database = require('../database/instance');
const transactionsController = require('./transactions');

const refreshTokens = [];

async function signUp(username, password, email, ){
    const db = await Database.Get();
    const collection = db.collection('users');
    let cursor = await collection.find({'username':username});
    if (await cursor.hasNext()){
        throw { status: 400, msg: 'username already registered'};
    }
    var bf = new Blowfish(username+process.env.SALT1);
    let hash = bf.encrypt(password);
    return collection.insertOne({
        username: username,
        password: hash,
        email: email
    })
    .then((result)=>{
        transactionsController.createTransaction(username, result.insertedId, 'registration'); //not using await in order to avoid delays on the actual response
        return jwt.sign( { username: username, userId: result.insertedId}, process.env.JWT_SECRET, { expiresIn: '24h' } );
    })
    .catch((e)=>{
        throw { status: 500, msg: `could not create user ${e}`};
    });
    
}

async function login(username, password){
    //encrypt the password in order to compare it to the stored password
    var bf = new Blowfish(username+process.env.SALT1);
    let hash = bf.encrypt(password);
    const db = await Database.Get();
    const collection = db.collection('users');
    let cursor = await collection.find({'username':username});
    if(await cursor.hasNext()){
        return cursor.next()
            .then((item)=>{
                if(item.password === hash){
                    transactionsController.createTransaction(username, item._id, 'successful login'); //not using await in order to avoid delays on the actual response
                    return jwt.sign( { username: username, userId: item._id},
                        process.env.JWT_SECRET, { expiresIn: '24h' } );
                    }   
                    else{
                    transactionsController.createTransaction(username, item._id, 'unsuccessful login attempt'); //not using await in order to avoid delays on the actual response
                    throw {status: 400, msg: 'incorrect user information'};
                }
            })
            .catch((e)=>{
                console.log(e);
                throw {status:500, msg: e};
            });
    }
    else throw {status: 404, msg: 'user not registered'};
}

module.exports = {
    signUp: signUp,
    login: login
};