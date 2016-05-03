module.exports = function (req, res) {

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

      var query = 'UPDATE `user` SET `salt` = ' + mysql.escape(salt_hex) + ', `pwd` = ' + mysql.escape(pwd_hex);
      query += ' WHERE email = ' + mysql.escape(email) + ';';
      console.log(query);

      connection.query(query, function(err, rows, fields) {
        if (err) {
          console.log(err);
          respond_json(req, res, {"error": err});
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
            to: 'alexladerman@gmail.com',//email, // list of receivers
            subject: 'AccountsJS Password recovery', // Subject line
            text: 'Your new temporary password is: ' + new_password, // plaintext body
            //html: 'Your new temporary password is: ' + new_password // html body
          };

          transporter.sendMail(mailOptions, function(err, info){
            if (err) {
              console.log(err);
              respond_json(req, res, {"error": err});
            } else {
              console.log('Message sent: ' + info.response);
              respond_json(req, res, null);
            }
          });
        }
      });
    } else {
      respond_json(req, res,  {"error": "invalid email"});
    }
  });
}
