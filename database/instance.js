const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const fs = require('fs');

var DbConnection = function () {

    var db = null;

    async function DbConnect() {
        try {
            const credentials = process.env.DB_CERT_PATH;
            const client = new MongoClient(process.env.DB_CONNECTION_STR, {
                sslKey: credentials,
                sslCert: credentials,
                serverApi: ServerApiVersion.v1
            });
            await client.connect();
            const _db = client.db(process.env.DB_NAME);
            return _db;
        } catch (e) {
            return e;
        }
    }

   async function Get() {
        try {
            if (db != null) {
                console.log(`db connection is already alive`);
                return db;
            } else {
                console.log(`getting new db connection`);
                db = await DbConnect();
                return db; 
            }
        } catch (e) {
            return e;
        }
    }

    return {
        Get: Get
    }
}


module.exports = DbConnection();

