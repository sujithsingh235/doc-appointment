const MongoClient = require("mongodb").MongoClient;
const config = require("../config/config.json");

let client = null;
let db = null;

function connect() {
    return new Promise(async (resolve, reject) => {
        try {
            client = new MongoClient(config.dbUri);
            await client.connect();
            db = client.db(config.dbName);
            console.log("Database connected successfully.");
            resolve();
        }
        catch (err) {
            console.error("Error while connecting Database.");
            reject(err);
        }
    });
}

function getDB() {
    return db;
}

module.exports = {
    getDB: getDB,
    connect: connect
}