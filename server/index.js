server = require("./server");
router = require("./router");
require("./global");
requesthandlers = require("./requesthandlers");

var handle = {};

handle["/"] = require('./requesthandlers/index');
handle["/signup"] = require('./requesthandlers/signup');
handle["/signin"] = require('./requesthandlers/signin');
handle["/recover_password"] = require('./requesthandler/srecover_password');
handle["/customers"] = require('./requesthandler/scustomers');
handle["/projects"] = require('./requesthandlers/projects');
handle["/periods"] = require('./requesthandlers/periods');
handle["/persons"] = require('./requesthandlers/persons');
handle["/businesses"] = require('./requesthandlers/businesses');

//if not exists create and populate database
server.db_connection = server.mysql.createConnection({
    multipleStatements : true,
    host : 'localhost',
    user : 'accounts',
    database : 'accounts',
    password : '332k3nkd8'
});

server.start(router.route, handle, server.io, server.fs);
