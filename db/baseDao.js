const getDB = require("./util").getDB;

function create(collection, doc) {
    return new Promise(async (resolve, reject) => {
        try {
            let db = getDB();
            let result = await db.collection(collection).insertOne(doc);
            resolve(result);
        }
        catch (err) {
            reject(err);
        }
    });
}

function updateOne(collection, filter, detailsToUpdate) {
    return new Promise(async (resolve, reject) => {
        try {
            let db = getDB();
            let result = await db.collection(collection).updateOne(filter, detailsToUpdate);
            resolve(result);
        }
        catch (err) {
            reject(err);
        }
    });
}

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
    create: create,
    getByQuery: getByQuery,
    aggregate: aggregate,
    updateOne: updateOne
}