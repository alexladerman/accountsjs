module.exports = function (req, res) {

	console.log('signup function');

	var body = '';
	req.on('data', function(chunk) {
		body += chunk.toString();
	});

	req.on('end', function() {
		var params = querystring.parse(body);

		var email, password;

		if (params['email'] && params['password']) {
			email = params['email'];
			password = params['password'];

			var salt = sjcl.random.randomWords(2, 6);
			var pwd = sjcl.misc.pbkdf2(password, salt, 100, 256);

			var salt_hex = sjcl.codec.hex.fromBits(salt);
			var pwd_hex = sjcl.codec.hex.fromBits(pwd);

			var query = 'INSERT INTO `user` (`email`, `salt`, `pwd`, `language`) VALUES (';
				query += server.mysql.escape(email) + ',';
				query += server.mysql.escape(salt_hex) + ',';
				query += server.mysql.escape(pwd_hex) + ',';
				query += server.mysql.escape('en') + ')';

			console.log(query);
			server.db_connection.query(query, function(err, rows, fields) {
				if (err) { 
					respond_json(res, {"error": err});
				} else {
					respond_json(res, {"account created": "yes"});
				}
			});
		}
	});
}