module.exports = function (req, res) {
  var params = url.parse(req.url, true).query;
  var action = params.action;
  var query;
  switch (action) {
    default:
      var person_id = url.parse(req.url, true).query.person_id;
      query = 'SELECT FLOOR(RAND() * 4010) + 1000 AS `Account`, `name`, `tax_id`, `address`, FLOOR(RAND() * 401000) + 100000 AS `Balance`, FLOOR(RAND() * 401000) + 100000 AS `TurnoverYTD` FROM person UNION SELECT FLOOR(RAND() * 4010) + 1000 AS `Account`, `name`, `tax_id`, `address`, FLOOR(RAND() * 401000) + 100000 AS `Balance`, FLOOR(RAND() * 401000) + 100000 AS `TurnoverYTD` FROM person UNION SELECT FLOOR(RAND() * 4010) + 1000 AS `Account`, `name`, `tax_id`, `address`, FLOOR(RAND() * 401000) + 100000 AS `Balance`, FLOOR(RAND() * 401000) + 100000 AS `TurnoverYTD` FROM person UNION SELECT FLOOR(RAND() * 4010) + 1000 AS `Account`, `name`, `tax_id`, `address`, FLOOR(RAND() * 401000) + 100000 AS `Balance`, FLOOR(RAND() * 401000) + 100000 AS `TurnoverYTD` FROM person WHERECLAUSE';
      // query = 'SELECT * FROM person WHERECLAUSE';
      var whereclause = (person_id > 0) ? 'WHERE person_id = ' + mysql.escape(person_id) : '';
      query = query.replace('WHERECLAUSE', whereclause);

      console.log('business_id: ' + params.business_id);
      InvoiceData.ListByBusiness(params.business_id, function(r) {console.log(r)});
  }
  execute_json_query(query, req, res);
}
