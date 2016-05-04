module.exports = function (req, res) {
  var params = url.parse(req.url, true).query;
  var token_decoded = get_token_decoded(req, res);
  console.log(token_decoded);
    var user_id = token_decoded['user_id'];
    if (user_id > 0) {
      var action = params.action;
      var query = '';
      switch (action) {
        case 'new':
        var data = req.body;
        delete data.lines;
        console.log(JSON.stringify(data, null, 2));
        InvoiceData.Create(data, function(r){
          InvoiceData.ListByBusiness(data.business_id, function(results){
            console.log(results);
            respond_json(req, res, results);
          });
        });
        return; //shuts down parallel execution path after asynchronous call

        case 'last_serial_number':
        var query = 'SELECT max(ifnull(serial_number, 0)) as last_serial_number FROM invoice ?';
        var params = url.parse(req.url, true).query;
        var business_id = params.business_id;
        // if hasPermission(user_id, business_id) {}
        //var prefix = params.prefix;
        var whereclause = (business_id > 0) ? 'WHERE business_id = ' + mysql.escape(business_id) : '';
        //whereclause += ' AND prefix = ' + mysql.escape(prefix);
        query = query.replace('?', whereclause);
        execute_json_query(query, req, res);
        break;

        default:
        respond_json(req, res, {error: "default"});
      }
    }
}
