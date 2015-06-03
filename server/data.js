var connection = require(__dirname + '/connection.js');

var tableName;
var tableID;

function Data(tableName, tableID) {
    this.tableName = tableName;
    this.tableID = tableID;
}


Data.prototype.Create = function(record, callback) {
    var query = 'INSERT INTO ' + this.tableName + '(';

    var isFirst = true;
    var fields = '';
    var values = '';

    for (var key in record) {
        if (key != this.tableID) {
            if (!isFirst) {
                fields += ',';
                values += ',';
            }
            else {
                isFirst = false;
            }

            fields += key;
            values += connection.escape(record[key]);
        }
    }

    query += fields + ') VALUES (' + values + ')';

    console.log(query);

    connection.query(query, function (err, result) {
        if (callback) {
            callback(result.insertId);
        }
    });
};


Data.prototype.Read = function(recordID, callback) {
    var query = 'SELECT * FROM ' + this.tableName + ' WHERE ' + this.tableID + ' = ' +
        connection.escape(recordID);

    connection.query(query, function (err, results) {
        if (results && results.length == 1) {
            callback(results[0]);
        }
        else {
            callback(null);
        }
    });
};


Data.prototype.Update = function(record, callback) {
    var query = 'UPDATE ' + this.tableName + ' SET ';

    var isFirst = true;

    for (var key in record) {
        if (key != this.tableID) {
            if (!isFirst) {
                query += ',';
            }
            else {
                isFirst = false;
            }

            query += key + ' = ' + connection.escape(record[key]);
        }
    }

    query = query + ' WHERE ' + this.tableID + ' = ' + record[this.tableID];

    connection.query(query, function (err, result) {
        if (callback) {
            callback(result);
        }
    });
};


Data.prototype.Delete = function(recordID, callback) {
    var query = 'DELETE FROM ' + this.tableName + ' WHERE ' + this.tableID + ' = ' + connection.escape(recordID);

    connection.query(query, function (err, result) {
        if (callback) {
            callback(result.affectedRows);
        }
    });
};


Data.prototype.Exists = function(recordID, callback) {
    var query = 'SELECT COUNT(*) count FROM ' + this.tableName + ' WHERE ' + this.tableID + ' = ' + recordID;

    connection.query(query, function (err, result) {
        if (callback) {
            callback(result[0].count >= 1);
        }
    });
};


Data.prototype.ListAll = function(callback) {
    var query = 'SELECT * FROM ' + this.tableName;

    connection.query(query, function (err, results) {
        if (callback) {
            callback(results);
        }
    });
};


Data.prototype.GetSQL = function(query, callback) {
    connection.query(query, function (err, result) {
        if (callback) {
            callback(result);
        }
    });
};


module.exports = Data;
