server = require("./server");
router = require("./router");
require("./global");
requesthandlers = require("./requesthandlers");

var handle = {};

handle["/"] = requesthandlers.index;
handle["/signup"] = require('./requesthandlers/signup');
handle["/signin"] = requesthandlers.signin;
handle["/recover_password"] = requesthandlers.recover_password;
handle["/customers"] = requesthandlers.customers;
handle["/projects"] = requesthandlers.projects;
handle["/periods"] = requesthandlers.periods;
handle["/persons"] = requesthandlers.persons;
handle["/businesses"] = requesthandlers.businesses;

//if not exists create and populate database
server.db_connection = server.mysql.createConnection({
    multipleStatements : true,
    host : 'localhost',
    user : 'accounts',
    database : 'accounts',
    password : '332k3nkd8'
});

server.start(router.route, handle, server.io, server.fs);
