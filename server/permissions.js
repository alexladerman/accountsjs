var hasPermission = function(user_id, business_id/*, permission*/) {
  var query = 'SELECT count() FROM role WHERE user = ' + server.mysql.escape(user_id) + ' AND business_id = ' + server.mysql.escape(customer_id) + ';';
  console.log(query);

  return server.db_connection.query(query, function (err, result) {
        return result[0].count >= 1;
  });
}
