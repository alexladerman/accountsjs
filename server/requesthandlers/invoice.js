module.exports = function (req, res) {
  var params = url.parse(req.url, true).query;
  var token_decoded = get_token_decoded(req, res);
  console.log(token_decoded);
  if (token_decoded) {
    var user_id = token_decoded['user_id'];
    if (user_id > 0) {
      console.log(params);
      var action = params.action;
      var query = '';
      switch (action) {
        case 'new':
          var business_id;
          var person_id;
          query = 'INSERT INTO `invoice` (`buyer_name`) VALUES (';
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
        case 'last_serial_number':
          var query = 'SELECT max(ifnull(serial_number, 0)) as last_serial_number FROM invoice ?';
          var params = url.parse(req.url, true).query;
          var business_id = params.business_id;
          // if hasPermission(user_id, business_id) {}
          //var prefix = params.prefix;
          var whereclause = (business_id > 0) ? 'WHERE business_id = ' + server.mysql.escape(business_id) : '';
          //whereclause += ' AND prefix = ' + server.mysql.escape(prefix);
          query = query.replace('?', whereclause);
          break;
        default:
          var query = 'SELECT customer.id, customer.name, customer.email, FORMAT(customer.hourly_rate, 2) AS hourly_rate, TIME_FORMAT(SEC_TO_TIME(sum_periods), \'%H:%i:%s\') AS billable_time, FORMAT(sum_periods * customer.hourly_rate / 3600, 2) AS billable_amount FROM customer LEFT JOIN (SELECT customer.id AS customer_id, sum(TIMESTAMPDIFF(SECOND, period.start, period.stop)) AS sum_periods FROM customer JOIN project ON customer.id = project.customer_id JOIN period ON period.project_id = project.id WHERE period.billed = 0 ? GROUP BY customer.id) AS total ON customer.id = total.customer_id';
          var customer_id = url.parse(req.url, true).query.customer_id;
          var whereclause = (customer_id > 0) ? 'AND customer_id = ' + server.mysql.escape(customer_id) : '';
          query = query.replace('?', whereclause);

      }
      execute_json_query(query, req, res);
    }
  } else {
    console.log('respond_unauthorized');
    // respond_unauthorized(req, res);
    respond_json(req, res, {error: "respnauthorized"});
  }
}
