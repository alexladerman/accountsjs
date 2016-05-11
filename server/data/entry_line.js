var Data = require('data-mysql');

var EntryLine = new Data('entry_line', 'entry_line_id');
module.exports = EntryLine;

module.exports.CreateBulk = function (arr, callback) {
  var bulk_query = '';
  for (var i in arr) {
    var record = arr[i];
    console.log('line:');
    console.log(record);
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

    query += fields + ') VALUES (' + values + ');';
    bulk_query += query + '\n';
  }

  console.log(bulk_query);
  connection.query(bulk_query, function (err, result) {
      if (err) {
          console.log(JSON.stringify(err));
          return;
      }
      if (callback) {
          callback();
      }
  });


}

module.exports.ListByBusiness = function (business_id, callback) {
    var query = 'SELECT * FROM ' + this.tableName;
    query += ' WHERE business_id = ?';

    connection.query(query, business_id, function (err, results) {
        if (callback) {
            callback(results);
        }
    });
}

module.exports.ListByBusinessAndEntry = function (business_id, entry_id, callback) {
    var query = 'SELECT * FROM ' + this.tableName;
    query += ' WHERE business_id = ?';
    query += ' AND entry_id = ?';

    connection.query(query, [business_id, entry_id], function (err, results) {
        if (callback) {
            callback(results);
        }
    });
}

Data.prototype.DeleteByEntry = function(business_id, entry_id, callback) {
    var query = 'DELETE FROM ' + this.tableName;
    query += ' WHERE business_id = ?';
    query += ' AND entry_id = ?';

    connection.query(query, [business_id, entry_id], function (err, result) {
        if (callback) {
            callback(result.affectedRows);
        }
    });
};

Data.prototype.DeleteByInvoice = function(invoice_id, callback) {
    var query = 'DELETE FROM ' + this.tableName + ' WHERE ' + 'invoice_id' + ' = ' + connection.escape(invoice_id);

    connection.query(query, function (err, result) {
        if (callback) {
            callback(result.affectedRows);
        }
    });
};
