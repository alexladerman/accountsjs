'use strict';

var mysqlPromise = require('mysql-promise'),
    db = mysqlPromise(),
    config = require('config');

db.configure(config.get('config.mysql'));

module.exports = {
    query: function (query, parameterValues) {
        return db.query.apply(db, arguments).then(function (rowsAndInfo) {
            return rowsAndInfo[0];
        });
    }
};
