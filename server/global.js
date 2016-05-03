exec = require("child_process").exec;
querystring = require("querystring");
url = require("url");
jwt = require("jsonwebtoken");
sjcl = require("sjcl");
data = require('./data');
permissions = require('./permissions');

AUTH_TOKEN_SECRET = 'something unmemorable';

res_header = function (req) {
    return {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": req.headers['access-control-request-headers'] // allow any headers
    }
}

// json_res_header = function (req) {
//     var headers = res_header(req);
//     headers['Content-Type'] = "application/json";
//     return headers;
// }

respond_json = function (req, res, json) {
    var headers = res_header(req);
    res.writeHead(200, headers);
    res.write(JSON.stringify(json));
    res.end();
}

respond_unauthorized = function (req, res) {
    respond_json(req, res, {error: "unauthorized"});
    res.end();
}

validate_email = function (email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

//queries the database and outputs rows as JSON
execute_json_query = function (query, req, res) {
    console.log(query);
    server.db_connection.query(query, function(err, rows, fields) {
        if (err) {
            throw err;
        }
        respond_json(req, res, rows);
    });
}

get_token_decoded = function (req, res) {
  var bearer_token = '';
  console.log(req.headers);
  console.log(req.headers.authorization);
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    bearer_token = req.headers.authorization.split(' ')[1];
    try {
      return jwt.verify(bearer_token, AUTH_TOKEN_SECRET);
    } catch(err) {
      respond_unauthorized(req, res);
    }
  }
}
