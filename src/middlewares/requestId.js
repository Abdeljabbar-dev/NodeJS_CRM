const uuid = require("uuid/v4");

module.exports = {
  requestId: function(req, res, next) {
    req.id = uuid();
    return next();
  }
};
