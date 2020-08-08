module.exports = {
  errorHandler: function(err, req, res, next) {
    // TODO: fill this later
    console.log("############# Error  #################");
    console.log(err);
    console.log("##############################");
    return res.json({ success: false, message: err.message, ...err });
  }
};
