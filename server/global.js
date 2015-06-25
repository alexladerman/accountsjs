exec = require("child_process").exec;
querystring = require("querystring");
url = require("url");
jwt = require("jsonwebtoken");
sjcl = require("sjcl");
data = require('./data');


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
