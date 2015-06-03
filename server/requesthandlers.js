

function recover_password(req, res) {

    var body = '';
    req.on('data', function(chunk) {
      body += chunk.toString();
    });

    req.on('end', function() {

        var email;

        var params = querystring.parse(body);

        if (params['email'] && validate_email(params['email'])) {
            email = params['email'];

            new_password = sjcl.codec.hex.fromBits(sjcl.random.randomWords(1, 6));
            
            var salt = sjcl.random.randomWords(2, 6);
            // salt = sjcl.codec.hex.toBits('9047929a49fb5e59');
            var pwd = sjcl.misc.pbkdf2(new_password, salt, 100, 256);

            var salt_hex = sjcl.codec.hex.fromBits(salt);
            var pwd_hex = sjcl.codec.hex.fromBits(pwd);

            var query = 'UPDATE `user` SET `salt` = ' + server.mysql.escape(salt_hex) + ', `pwd` = ' + server.mysql.escape(pwd_hex);
                query += ' WHERE email = ' + server.mysql.escape(email) + ';';
                console.log(query);
    
            server.db_connection.query(query, function(err, rows, fields) {
                if (err) {
                    console.log(err);
                    respond_json(res, {"error": err});
                } else {
                    var nodemailer = require('nodemailer');
                     
                    var transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: 'atixacreg@gmail.com',
                            pass: 'Schnapps77'
                        }
                    });
                     
                    var mailOptions = {
                        from: 'AccountsJS ✔ <atixacreg@gmail.com>', // sender address 
                        to: email, // list of receivers 
                        subject: 'AccountsJS Password recovery', // Subject line 
                        text: 'Your new temporary password is: ' + new_password, // plaintext body 
                        //html: 'Your new temporary password is: ' + new_password // html body 
                    };
                     
                    transporter.sendMail(mailOptions, function(err, info){
                        if (err) {
                            console.log(err);
                            respond_json(res, {"error": err});
                        } else {
                            console.log('Message sent: ' + info.response);
                            respond_json(res, null);
                        }
                    });
                }
            });
        } else {
            respond_json(res,  {"error": "invalid email"});
        }
    });
}

function signin(req, res) {

    var body = '';
    req.on('data', function(chunk) {
      body += chunk.toString();
    });

    req.on('end', function() {
        var params = querystring.parse(body);

        var email, password;

        if (params['email'] && params['password']) {
            var email = params['email'];
            var password = params['password'];

            var query = 'SELECT user_id, email, salt, pwd FROM user WHERE email = ' + server.mysql.escape(email) + ';';
            console.log(query);
            server.db_connection.query(query, function(err, rows, fields) {

                if (!rows.length) { 
                    respond_json(res, {"error": "Authentication error"});
                } else {
                    var user = rows[0];

                    var salt = sjcl.codec.hex.toBits(user['salt']);

                    var pwd = sjcl.misc.pbkdf2(password, salt, 100, 256);
                    var pwd_hex = sjcl.codec.hex.fromBits(pwd);
                    
                    //password check
                    if (user['pwd'] == pwd_hex) {

                        var token_options = {
                            expiresInSeconds: 86400,
                            subject: "user auth token",
                            issuer: "accountsjs"  
                        }

                        var token = jwt.sign(rows[0], AUTH_TOKEN_SECRET, token_options);
                        respond_json(res,  {"access_token": token});
                    } else {
                        respond_json(res,  {"error": "Authentication error"});
                    }
                }
            });
        }
    });
}

function get_token_decoded(req, res) {
    var bearer_token = '';
    console.log(req.headers);
    console.log(req.headers.authorization);
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        bearer_token = req.headers.authorization.split(' ')[1];
        try {
          return jwt.verify(bearer_token, AUTH_TOKEN_SECRET);
        } catch(err) {
            respond_unauthorized();
        } 
    } 
}

function businesses(req, res) {
    var params = url.parse(req.url, true).query;
    var token_decoded = get_token_decoded(req, res);
    console.log(token_decoded);
    if (token_decoded) {
        var user_id = token_decoded['user_id'];
        if (user_id > 0) {
            var action = params.action;
            switch (action) {
                case 'new':
                    var business_id;
                    var person_id;
                    var query = 'INSERT INTO `business` (`name`) VALUES (';
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
                                            respond_json(res, null);
                                        });
                                    }
                                });
                            });
                        }
                    });
                    return;
                default:
                    var query = 'SELECT b.business_id id, name, role FROM business b JOIN role r ON b.business_id = r.business_id WHERECLAUSE';
                    var whereclause = (user_id > 0) ? ' WHERE r.user_id = ' + server.mysql.escape(user_id) : '';
                    query = query.replace('WHERECLAUSE', whereclause);
            }
            execute_json_query(query, res);
        }
    } else {
        respond_unauthorized();
    }
}

function persons(req, res) {
    res.writeHead(200, json_res_header(req));
    var action = url.parse(req.url, true).query.action;
    console.log(req.url);
    switch (action) {
        default:
            var person_id = url.parse(req.url, true).query.person_id;
            var query = 'SELECT * FROM person WHERECLAUSE';
            var whereclause = (person_id > 0) ? 'WHERE person_id = ' + server.mysql.escape(person_id) : '';
            query = query.replace('WHERECLAUSE', whereclause);
    }
    execute_json_query(query, res);
}

//handles queries for the customer table
function customers(req, res) {
    res.writeHead(200, json_res_header(req));
    var action = url.parse(req.url, true).query.action;
    console.log(req.url);
    switch (action) {
        case 'new':
            var customer_name = url.parse(req.url, true).query.customer_name;
            var customer_email = url.parse(req.url, true).query.customer_email;
            var customer_hourly_rate = url.parse(req.url, true).query.customer_hourly_rate;
            var query = 'INSERT INTO `customer` (`name`, `email`, `hourly_rate`) VALUES (';
            query += server.mysql.escape(customer_name) + ',';
            query += server.mysql.escape(customer_email) + ',';
            query += server.mysql.escape(customer_hourly_rate) + ')'
            console.log(query);
            server.db_connection.query(query, function(err, rows, fields) {
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
            var whereclause = (customer_id > 0) ? 'AND customer_id = ' + server.mysql.escape(customer_id) : '';
            query = query.replace('?', whereclause);
    }
    execute_json_query(query, res);
}

//handles queries for the project table
function projects(req, res) {
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
                respond_json(res, null);
            });
            return;
        default:
            var query = 'SELECT project.id, project.customer_id, project.name, TIME_FORMAT(SEC_TO_TIME(sum_periods), \'%H:%i:%s\') AS billable_time, FORMAT(sum_periods * customer.hourly_rate / 3600, 2) AS billable_amount, (SELECT period.id AS running_period_id FROM period WHERE period.stop IS NULL AND period.project_id = project.id) AS running_period_id FROM project LEFT JOIN (SELECT project.id AS id, SUM(TIMESTAMPDIFF(SECOND, period.start, period.stop)) AS sum_periods FROM project JOIN period ON period.project_id = project.id WHERE period.billed = 0 GROUP BY project.id) AS total ON project.id = total.id JOIN customer ON project.customer_id = customer.id ?';
            var whereclause = (customer_id > 0) ? 'WHERE customer_id = ' + server.mysql.escape(customer_id) : '';
            query = query.replace('?', whereclause);
    }
    execute_json_query(query, res);
}

//handles queries for the period table
function periods(req, res) {
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
                    respond_json(res, null); 
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
                respond_json(res, null); 
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
                                respond_json(res, null); 
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

exports.signin = signin;
exports.recover_password = recover_password;
exports.customers = customers;
exports.projects = projects;
exports.periods = periods;
exports.persons = persons;
exports.businesses = businesses;
