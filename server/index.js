require("./global");

var handle = {};

// handle["/"] = require('./requesthandlers/index');
handle["/signup"] = require('./requesthandlers/signup');
handle["/signin"] = require('./requesthandlers/signin');
handle["/recover_password"] = require('./requesthandlers/recover_password');
// handle["/customer"] = require('./requesthandlers/customer');
// handle["/projects"] = require('./requesthandlers/projects');
// handle["/periods"] = require('./requesthandlers/periods');
handle["/person"] = require('./requesthandlers/person');
handle["/business"] = require('./requesthandlers/business');
handle["/invoice"] = require('./requesthandlers/invoice');

app = http.createServer(function(request, response) {
      var pathname = url.parse(request.url).pathname;
      console.log("Request for " + pathname);
      route(pathname, handle, request, response);
  }
);

app.listen(1337);
console.log("Server has started.");
