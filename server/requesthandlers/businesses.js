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
        query = 'INSERT INTO `business` (`name`) VALUES (';
        query += server.mysql.escape(params.name) + ')';
        console.log(query);
        server.db_connection.query(query, function(err, rows, fields) {
          if (err) {
            console.log(err);
            throw err;
          }
          business_id = rows.insertId;
          if (business_id) {
            var query = 'INSERT INTO `role` (`business_id`, `user_id`, `role`) VALUES (';
            query += server.mysql.escape(business_id) + ',';
            query += server.mysql.escape(user_id) + ',';
            query += server.mysql.escape('admin') + ')';
            console.log(query);
            server.db_connection.query(query, function(err, rows, fields) {
              if (err) {
                console.log(err);
                throw err;
              }
              var query = 'INSERT INTO `person` (`business_id`, `name`, `tax_id`, `address`, `email`, `telephone`, `tax_country`) VALUES (';
              query += server.mysql.escape(business_id) + ',';
              query += server.mysql.escape(params.name) + ',';
              query += server.mysql.escape(params.tax_id) + ',';
              query += server.mysql.escape(params.address) + ',';
              query += server.mysql.escape(params.email) + ',';
              query += server.mysql.escape(params.telephone) + ',';
              query += server.mysql.escape(params.tax_country) + ')';
              console.log(query);
              server.db_connection.query(query, function(err, rows, fields) {
                if (err) {
                  console.log(err);
                  throw err;
                }
                person_id = rows.insertId;
                if (person_id) {
                  var query = 'UPDATE `person` SET `ref` = ' + server.mysql.escape(person_id);
                  query += ' WHERE business_id = ' + server.mysql.escape(business_id) + ' AND person_id = ' + server.mysql.escape(person_id);
                  console.log(query);
                  server.db_connection.query(query, function(err, rows, fields) {
                    if (err) {
                      console.log(err);
                      throw err;
                    }
                    respond_json(req, res, null);
                  });
                }
              });
            });
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
