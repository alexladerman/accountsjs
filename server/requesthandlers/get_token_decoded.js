module.exports = function (req, res) {
  var bearer_token = '';
  console.log(req.headers);
  console.log(req.headers.authorization);
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    bearer_token = req.headers.authorization.split(' ')[1];
    try {
      return jwt.verify(bearer_token, AUTH_TOKEN_SECRET);
    } catch(err) {
      respond_unauthorized(req, res);
    }
  }
}
