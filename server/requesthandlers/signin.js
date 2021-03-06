module.exports = function (req, res) {

  console.log(req.body);
  var params = req.body;

  var email, password;

  if (params['email'] && params['password']) {
    var email = params['email'];
    var password = params['password'];

    var query = 'SELECT user_id, email, salt, pwd FROM user WHERE email = ' + mysql.escape(email) + ';';
    console.log(query);
    connection.query(query, function(err, rows, fields) {

      if (!rows.length) {
        console.log('no results');
        // respond_unauthorized(req, res);
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
          respond_json(req, res, {access_token: token});
        } else {
          respond_unauthorized(req, res);
        }
      }
    });
  }
}
