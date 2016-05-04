exec = require("child_process").exec;
querystring = require("querystring");
url = require("url");
jwt = require("jsonwebtoken");
bodyparser = require("body-parser").json;
sjcl = require("sjcl");
http = require("http");
url = require("url");
app = undefined;
io = require('socket.io');
fs = require('fs');
mysql = require('mysql');

config = {
    multipleStatements : true,
    // debug: ['ComQueryPacket', 'RowDataPacket'],
    debug: ['ComQueryPacket'],
    host : 'localhost',
    user : 'accounts',
    database : 'accounts',
    password : '332k3nkd8'
}

connection = mysql.createConnection(config);

//Data
PersonData = require('./data/person');
InvoiceData = require('./data/invoice');

//if not exists create and populate database

AUTH_TOKEN_SECRET = 'something unmemorable';

route = function(pathname, handle, req, res) {
  if (typeof handle[pathname] === 'function' ) {
    console.log("Routing to " + pathname);
    handle[pathname](req, res);
  } else {
    console.log("No request handler found for " + pathname);
    res.writeHead(404, {
      "Content-Type": "text/html" });
      res.write("404 Not found");
      res.end();
  }
}

res_header = function(req) {
    return {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": req.headers['access-control-request-headers'] // allow any headers
    }
}

respond_json = function(req, res, json) {
    var headers = res_header(req);
    res.writeHead(200, headers);
    res.write(JSON.stringify(json));
    res.end();
}

respond_unauthorized = function(req, res) {
    respond_json(req, res, {error: "unauthorized"});
    res.end();
}

validate_email = function(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

//queries the database and outputs rows as JSON
execute_json_query = function(query, req, res) {
    connection.query(query, function(err, rows, fields) {
        if (err) {
            throw err;
        }
        respond_json(req, res, rows);
    });
}

get_token_decoded = function(req, res) {
  var bearer_token = '';
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    bearer_token = req.headers.authorization.split(' ')[1];
    try {
      return jwt.verify(bearer_token, AUTH_TOKEN_SECRET);
    } catch(err) {
      respond_unauthorized(req, res);
    }
  }
}

hasPermission = function(user_id, business_id/*, permission*/) {
  var query = 'SELECT count() FROM role WHERE user = ' + mysql.escape(user_id) + ' AND business_id = ' + mysql.escape(customer_id) + ';';

  return connection.query(query, function (err, result) {
        return result[0].count >= 1;
  });
}
