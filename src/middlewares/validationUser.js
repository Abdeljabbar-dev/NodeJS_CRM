var jwt = require("jsonwebtoken");
const nconf = require("nconf");

function validateUser(req, res, next) {
  jwt.verify(req.headers["x-access-token"], nconf.get("jwt:secret"), function(
    err,
    decoded
  ) {
    if (err) {
      res.json({ success: false, message: err.message });
    } else {
      // add user id to request
      req.body.userId = decoded.id;
      next();
    }
  });
}

module.exports = validateUser;
