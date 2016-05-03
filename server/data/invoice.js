var Data = require('data-mysql');

var Invoice = new Data('invoice', 'invoice_id');
module.exports = Invoice;

module.exports.ListByBusiness = function (business_id, callback) {
    var query = 'SELECT * FROM ' + this.tableName;
    query += ' WHERE business_id = ?';

    connection.query(query, business_id, function (err, results) {
        if (callback) {
            callback(results);
        }
    });
}
