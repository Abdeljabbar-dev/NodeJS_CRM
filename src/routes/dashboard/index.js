var express = require("express");
var router = express.Router();

// const Label = require("../../models/Label");

//CRUD Dashbord //

getDashbordPlan = (req, res) => {
  const query = req.query;
  let data = {
    user: {
      uid: "5d14b41f11c0722be8594e56",
      first_name: "Mehdi",
      last_name: "Alaoui Hassani",
      email: "mehdi@screendy.com",
      roleId: "ADMIN"
    },
    overview: [],

    events: [],

    startups: [],

    sectors: [],

    entrepreneurs: []
  };

  res.json({
    success: true,
    data
  });
};

// GET Dashbord Plan
router.get("", getDashbordPlan);

module.exports = router;
