var server = require("./server");
var router = require("./router");
var requesthandlers = require("./requesthandlers");

var handle = {};

handle["/"] = requesthandlers.index;
handle["/customers"] = requesthandlers.customers;
handle["/projects"] = requesthandlers.projects;
handle["/periods"] = requesthandlers.periods;

//if not exists create and populate database
server.db_connection = server.mysql.createConnection({
    multipleStatements : true,
    host : 'localhost',
    user : 'accounts',
    password : '332k3nkd8'
});

server.start(router.route, handle, server.io, server.fs);
