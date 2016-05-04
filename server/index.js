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

app = http.createServer(function(req, res) {
  var pathname = url.parse(req.url).pathname;
  console.log(req.method + " " + pathname);

  //deal with preflight. request must respond with headers and nothing else,
  if(req.method == 'OPTIONS') {
    respond_json(req, res, null);
    return;
  }

  var body = "";
  req.on('data', function(data) { console.log('on data...'); body += data; });
  req.on('end', function() {
    console.log('on end.');
    if (req.method == 'POST')
      req.body = JSON.parse(body);   //if POST insert JSON parsed body property
    route(pathname, handle, req, res);
  });
});

app.listen(1337);
console.log("Server has started.");
