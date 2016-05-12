module.exports = function (req, res) {
  var params = url.parse(req.url, true).query;
  var token_decoded = get_token_decoded(req, res);
  console.log(token_decoded);
  var user_id = token_decoded['user_id'];
  if (user_id > 0) {
    var action = params.action;
    var query = '';
    switch (action) {
      case 'save':
      var data = req.body;
      var business_id = data.business_id;
      var lines = data.lines.map(function(line){return line});
      (lines === data.lines) ? console.log('(lines === data.lines) true') : console.log('(lines === data.lines) false');
      delete data.lines;
      if (data.entry_id) {
        console.log('data.business_id: ' + data.business_id);
        console.log('data.entry_id: ' + data.entry_id);
        EntryLineData.DeleteByEntry(data.business_id, data.entry_id, function(){
          lines = lines.map(function(line){line.entry_id = data.entry_id; line.business_id = business_id; return line});
          EntryLineData.CreateBulk(lines, function(){
            EntryLineData.ListByBusinessAndEntry(data.business_id, data.entry_id, function(record){
              respond_json(req, res, record);
            });
          });
        });
      }
      return; //shuts down parallel execution path after asynchronous call

      case 'last_entry_id':
      var query = 'SELECT max(ifnull(entry_id, 0)) as last_entry_id FROM entry_line ?';
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
      EntryLineData.ListByBusiness(params.business_id, function(results) { respond_json(req, res, results) });
    }
  }
}
