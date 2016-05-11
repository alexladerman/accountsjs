var Data = require('data-mysql');

var Account = new Data('account', 'account_id');
module.exports = Account;

module.exports.ListByBusiness = function (business_id, callback) {
    var query = 'SELECT * FROM ' + this.tableName;
    query += ' WHERE business_id = ?';

    connection.query(query, business_id, function (err, results) {
        if (callback) {
            callback(results);
        }
    });
}
