// TODO: Later limit origin to ScreeDy domains
module.exports = {
  corsMiddleware: function(req, res, next) {
    res.set({
      "Access-Control-Allow-Origin": req.header("origin") || "*",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,HEAD,DELETE",
      "Access-Control-Allow-Headers":
        "Content-Type,Accept,Content-Encoding,X-Requested-With, Userorization",
    });
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    return next();
  },
};
