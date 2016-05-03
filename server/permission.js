var hasPermission = function(user_id, business_id/*, permission*/) {
  var query = 'SELECT count() FROM role WHERE user = ' + mysql.escape(user_id) + ' AND business_id = ' + mysql.escape(customer_id) + ';';

  return connection.query(query, function (err, result) {
        return result[0].count >= 1;
  });
}
