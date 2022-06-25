const dao = require("../db/baseDao");
const collection = "workShifts";

function getAll() {
    return new Promise(async (resolve, reject) => {
        try {
            resolve(await dao.getByQuery(collection, {}, {}));
        }
        catch(err) {
            reject(err);
        }
    });
}

module.exports = {
    getAll: getAll
}