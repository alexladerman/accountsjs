module.exports = function (req, res) {
  var action = url.parse(req.url, true).query.action;
  console.log(req.url);
  var query;
  switch (action) {
    default:
    var person_id = url.parse(req.url, true).query.person_id;
    query = 'SELECT FLOOR(RAND() * 4010) + 1000 AS `Account`, `name`, `tax_id`, `address`, FLOOR(RAND() * 401000) + 100000 AS `Balance`, FLOOR(RAND() * 401000) + 100000 AS `TurnoverYTD` FROM person UNION SELECT FLOOR(RAND() * 4010) + 1000 AS `Account`, `name`, `tax_id`, `address`, FLOOR(RAND() * 401000) + 100000 AS `Balance`, FLOOR(RAND() * 401000) + 100000 AS `TurnoverYTD` FROM person UNION SELECT FLOOR(RAND() * 4010) + 1000 AS `Account`, `name`, `tax_id`, `address`, FLOOR(RAND() * 401000) + 100000 AS `Balance`, FLOOR(RAND() * 401000) + 100000 AS `TurnoverYTD` FROM person UNION SELECT FLOOR(RAND() * 4010) + 1000 AS `Account`, `name`, `tax_id`, `address`, FLOOR(RAND() * 401000) + 100000 AS `Balance`, FLOOR(RAND() * 401000) + 100000 AS `TurnoverYTD` FROM person WHERECLAUSE';
    // query = 'SELECT * FROM person WHERECLAUSE';
    var whereclause = (person_id > 0) ? 'WHERE person_id = ' + server.mysql.escape(person_id) : '';
    query = query.replace('WHERECLAUSE', whereclause);
  }
  execute_json_query(query, req, res);
}
