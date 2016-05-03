module.exports = function (req, res) {
    var customer_id = url.parse(req.url, true).query.customer_id;
    var action = url.parse(req.url, true).query.action;
    console.log(req.url);
    switch (action) {
        case 'new':
            var project_name = url.parse(req.url, true).query.project_name;
            var query = 'INSERT INTO `project` (`name`, `customer_id`) VALUES (';
            query += server.mysql.escape(project_name) + ',';
            query += server.mysql.escape(customer_id) + ')'
            console.log(query);
            server.db_connection.query(query, function(err, rows, fields) {
                if (err) {
                    throw err;
                }
                respond_json(req, res, null);
            });
            return;
        default:
            var query = 'SELECT project.id, project.customer_id, project.name, TIME_FORMAT(SEC_TO_TIME(sum_periods), \'%H:%i:%s\') AS billable_time, FORMAT(sum_periods * customer.hourly_rate / 3600, 2) AS billable_amount, (SELECT period.id AS running_period_id FROM period WHERE period.stop IS NULL AND period.project_id = project.id) AS running_period_id FROM project LEFT JOIN (SELECT project.id AS id, SUM(TIMESTAMPDIFF(SECOND, period.start, period.stop)) AS sum_periods FROM project JOIN period ON period.project_id = project.id WHERE period.billed = 0 GROUP BY project.id) AS total ON project.id = total.id JOIN customer ON project.customer_id = customer.id ?';
            var whereclause = (customer_id > 0) ? 'WHERE customer_id = ' + server.mysql.escape(customer_id) : '';
            query = query.replace('?', whereclause);
    }
    execute_json_query(query, res);
}
