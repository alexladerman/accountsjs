'use strict';

var dbConnection = require('./connection.js');

function Data(tableName, tableID) {
    this.tableName = tableName;
    this.tableID = tableID;
}


Data.prototype.Create = function(record) {
    var sql = 'INSERT INTO ' + this.tableName + '(';

    var keys = [];
    var values = [];

    for (var key in record) {
        if (key !== this.tableID) {
            keys.push(key);
            values.push(record[key]);
        }
    }

    sql += keys.map(give('??')).join() + ') VALUES (' + values.map(give('?')).join() + ')';
    return dbConnection.query(sql, keys.concat(values)).then(function (result) {
        return result.insertId;
    });

    function give (value) {
        return function () {
            return value;
        };
    }
};


Data.prototype.Read = function(recordID) {
    var sql = 'SELECT * FROM ' + this.tableName + ' WHERE ' + this.tableID + ' = ?';

    return dbConnection.query(sql, recordID).then(function (results) {
        if (results && results.length === 1) {
            return (results[0]);
        }
        else {
            return null;
        }
    });
};


Data.prototype.Update = function(record) {
    var sql = 'UPDATE ' + this.tableName + ' SET ';

    var parameters = [];
    var queryItems = [];

    for (var key in record) {
        if (key !== this.tableID) {
            queryItems.push('?? = ?');
            parameters.push(key, record[key]);
        }
    }

    sql += queryItems.join() + ' WHERE ' + this.tableID + ' = ' + record[this.tableID];

    return dbConnection.query(sql, parameters);
};


Data.prototype.Delete = function(recordID) {
    var sql = 'DELETE FROM ' + this.tableName + ' WHERE ' + this.tableID + ' = ?';

    return dbConnection.query(sql, recordID).then(function (result) {
        return result.affectedRows;
    });
};


Data.prototype.Exists = function(recordID) {
    var sql = 'SELECT COUNT(*) count FROM ' + this.tableName + ' WHERE ' + this.tableID + ' = ?';

    return dbConnection.query(sql, recordID).then(function (result) {
        return result[0].count >= 1;
    });
};


Data.prototype.ListAll = function() {
    var sql = 'SELECT * FROM ' + this.tableName;

    return dbConnection.query(sql);
};

module.exports = Data;
