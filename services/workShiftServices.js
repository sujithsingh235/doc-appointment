const collection = "workShifts";
const dao = require("../db/baseDao");

function getAll() {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await dao.getByQuery(collection, {}, {});
            resolve(result);
        }
        catch(err) {
            reject(err);
        }
    });
}

module.exports = {
    getAll: getAll
}