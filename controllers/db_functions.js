const connection = require('../db');

function sql_request(query) {
    return new Promise(function(resolve,reject){
        connection.query(query, function (error, results, fields) {
            if (error) reject(error);
            else resolve(results);
        })
    })
}

function sql_getRow(query) {
    return new Promise(function(resolve,reject){
        connection.query(query, function (error, results, fields) {
            if (error) reject(error);
            else resolve(results[0]);
        })
    })
}

module.exports = {
    request: sql_request,
    getRow: sql_getRow,
};