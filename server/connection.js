var mysql = require('mysql');
var config = require(__dirname + '/../config.js').config;

var connection = mysql.createConnection(config.mysql);


setInterval(keepAlive, 60 * 60 * 1000);

function keepAlive() {
    connection.query('select 1', [], function(err, result) {
        if (err) {
            console.log(err);
            return;
        }

        console.log('Successful keepalive.');
    });
}

module.exports = connection;
