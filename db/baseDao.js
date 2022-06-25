const getDB = require("./util").getDB;

function getByQuery(collection, query, projection) {
    return new Promise(async (resolve, reject) => {
        try {
            let db = getDB();
            let cursor = await db.collection(collection).find(query, projection);
            resolve(cursor.toArray());
        }
        catch (err) {
            reject(err);
        }
    });
}

function aggregate(collection, pipeline) {
    return new Promise(async (resolve, reject) => {
        try {
            let db = getDB();
            let cursor = await db.collection(collection).aggregate(pipeline);
            resolve(cursor.toArray());
        }
        catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    getByQuery: getByQuery,
    aggregate: aggregate
}