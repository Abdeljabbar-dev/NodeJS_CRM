var express = require("express");
var router = express.Router();
var multer = require("multer");
var services = require("../activity/services");
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));
getAllEvents = async (req, res) => {
  await services
    .getAllActivitiesByType("EVENT")

    .then(events => {
      res.json({
        success: true,
        data: events
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message
      });
    });
};
router.get("", getAllEvents);
module.exports = router;
