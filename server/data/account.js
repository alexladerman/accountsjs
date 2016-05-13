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

module.exports.ListByBusinessAndAccountWithBalance = function (business_id, callback) {
    var query = 'SELECT account.business_id, account.account_id, account.account, account.name, type, sum(amount) as balance  FROM account';
    query += ' LEFT JOIN entry_line on account.account_id = entry_line.account_id';
    query += ' WHERE account.business_id = ?';
    query += ' GROUP BY account.account_id';

    connection.query(query, business_id, function (err, results) {
        if (callback) {
            callback(results);
        }
    });
}
