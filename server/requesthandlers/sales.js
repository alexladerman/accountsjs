module.exports = function (req, res) {
  var params = url.parse(req.url, true).query;
  var token_decoded = get_token_decoded(req, res);
  console.log(token_decoded);
  if (token_decoded) {
    var user_id = token_decoded['user_id'];
    if (user_id > 0) {
      var action = params.action;
      var query = '';
      switch (action) {
        case 'new':
          var business_id;
          var person_id;
          query = 'INSERT INTO `sale` (`customer_name`) VALUES (';
          query += server.mysql.escape(params.customer_name) + ')';
          console.log(query);
          server.db_connection.query(query, function(err, rows, fields) {
            if (err) {
              console.log(err);
              throw err;
            }
            business_id = rows.insertId;
            console.log(business_id);
            if (business_id) {
              respond_json(req, res, null);
            }
          });
          return;
        default:
          query = 'SELECT b.business_id id, name, role FROM business b JOIN role r ON b.business_id = r.business_id WHERECLAUSE';
          var whereclause = (user_id > 0) ? ' WHERE r.user_id = ' + server.mysql.escape(user_id) : '';
          query = query.replace('WHERECLAUSE', whereclause);
      }
      execute_json_query(query, req, res);
    }
  } else {
    console.log('respond_unauthorized');
    // respond_unauthorized(req, res);
    respond_json(req, res, {error: "respnauthorized"});
  }
}
