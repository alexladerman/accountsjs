module.exports = function (req, res) {
    res.writeHead(200, json_res_header(req));
    var action = url.parse(req.url, true).query.action;
    console.log(req.url);
    switch (action) {
        case 'new':
            var customer_name = url.parse(req.url, true).query.customer_name;
            var customer_email = url.parse(req.url, true).query.customer_email;
            var customer_hourly_rate = url.parse(req.url, true).query.customer_hourly_rate;
            var query = 'INSERT INTO `customer` (`name`, `email`, `hourly_rate`) VALUES (';
            query += mysql.escape(customer_name) + ',';
            query += mysql.escape(customer_email) + ',';
            query += mysql.escape(customer_hourly_rate) + ')'
            console.log(query);
            connection.query(query, function(err, rows, fields) {
                if (err) {
                    throw err;
                }
                res.write('0');
                res.end();
            });
            return;
        default:
            var customer_id = url.parse(req.url, true).query.customer_id;
            var query = 'SELECT customer.id, customer.name, customer.email, FORMAT(customer.hourly_rate, 2) AS hourly_rate, TIME_FORMAT(SEC_TO_TIME(sum_periods), \'%H:%i:%s\') AS billable_time, FORMAT(sum_periods * customer.hourly_rate / 3600, 2) AS billable_amount FROM customer LEFT JOIN (SELECT customer.id AS customer_id, sum(TIMESTAMPDIFF(SECOND, period.start, period.stop)) AS sum_periods FROM customer JOIN project ON customer.id = project.customer_id JOIN period ON period.project_id = project.id WHERE period.billed = 0 ? GROUP BY customer.id) AS total ON customer.id = total.customer_id';
            var customer_id = url.parse(req.url, true).query.customer_id;
            var whereclause = (customer_id > 0) ? 'AND customer_id = ' + mysql.escape(customer_id) : '';
            query = query.replace('?', whereclause);
    }
    execute_json_query(query, res);
}
