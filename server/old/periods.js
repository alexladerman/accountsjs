module.exports = function (req, res) {
    res.writeHead(200, json_res_header(req));
    var project_id = url.parse(req.url, true).query.project_id;
    var customer_id = url.parse(req.url, true).query.customer_id;
    var action = url.parse(req.url, true).query.action;
    switch (action) {
        case 'bill':
            if (customer_id != null) {
                var query = 'UPDATE period SET billed = 1 ?';
                var whereclause = 'WHERE period.project_id IN (SELECT id FROM project WHERE customer_id = ' + server.mysql.escape(customer_id) + ')';
                query = query.replace('?', whereclause);
                console.log(query);
                server.db_connection.query(query, function(err, rows, fields) {
                    if (err) {
                        throw err;
                    }
                    respond_json(req, res, null);
                });
            }
            return;
        case 'start':
            console.log("start case");
            var query = 'INSERT INTO `period` (`project_id`) VALUES(?);';
            query = query.replace('?', server.mysql.escape(project_id));
            console.log(query);
            server.db_connection.query(query, function(err, rows, fields) {
                if (err) {
                    throw err;
                }
                respond_json(req, res, null);
            });
            return;
        case 'stop':
            console.log("stop case");
            if (project_id > 0) {
                var query = 'SELECT period.id AS running_period_id FROM period ?;';
                var whereclause = 'WHERE period.stop IS NULL AND period.project_id = ' + server.mysql.escape(project_id);
                query = query.replace('?', whereclause);
                server.db_connection.query(query, function(err, rows, fields) {
                    if (err) {
                        throw err;
                    }
                    console.log(rows);
                    if (rows.length > 0) {
                        var running_period_id = rows[0]['running_period_id'];
                        if (running_period_id != null) {
                            var query = 'UPDATE period SET stop = CURRENT_TIMESTAMP ?;';
                            var whereclause = 'WHERE id = ' + server.mysql.escape(running_period_id);
                            query = query.replace('?', whereclause);
                            console.log(query);
                            server.db_connection.query(query, function(err, rows, fields) {
                                if (err) {
                                    throw err;
                                }
                                respond_json(req, res, null);
                            });
                        }
                    }
                });
            }
            return;
        default:
            var query = 'SELECT * FROM period ?';
            var whereclause = (project_id > 0) ? 'WHERE project_id = ' + server.mysql.escape(project_id) : '';
            query = query.replace('?', whereclause);
            query += ' ORDER BY start DESC';
    }
    execute_json_query(query, res);
}
