const express = require("express");
const router = express.Router();
const Testimonial = require("../../models/Testimonials");
const Team = require("../../models/Team");
const Activities = require("../../models/Activity");
getwebsiteData = async (req, res) => {
  let data = {
    testimonials: [],
    events: [],
    portfolios: [],
    startups: []
  };

  try {
    data.startups = await Team.find({
      type: "STARTUP",
      published: { $in: ["true", true] }
    });
  } catch (error) {
    data.startups = [];
    // return res.status(200).json({ success: true, data });
  }
  try {
    data.testimonials = await Testimonial.find({
      published: { $in: ["true", true] }
    });
  } catch (error) {
    data.testimonials = [];
    // return res.status(200).json({ success: true, data });
  }
  try {
    data.portfolios = await Activities.find({
      published: { $in: ["true", true] }
    });
  } catch (error) {
    data.portfolios = [];
    // return res.status(200).json({ success: true, data });
  }
  return res.status(200).json({ success: true, data });
};

// Testimonials
getPublishTestimonials = async (req, res) => {
  let testimonials = [];
  try {
    testimonials = await Testimonial.find({
      published: { $in: ["true", true] }
    })
      .sort({ order: 1 })
      .lean();
    return res.status(200).json({ success: true, testimonials });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};
getPublishTestimonialsById = async (req, res) => {
  let id = null;

  if (req && req.params.id) id = req.params.id;
  else throw new Error("ID Param is required");
  let testimonials = null;
  try {
    try {
      testimonials = await Testimonial.find({
        published: {
          $in: ["true", true]
        },
        _id: {
          $eq: id
        }
      }).lean();
    } catch (error) {
      testimonials = [];
    }
    if (testimonials && testimonials.length == 0)
      throw new Error("testimonials not found");
    return res
      .status(200)
      .json({ success: true, testimonials: testimonials[0] });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

// Startups
getPublishStartups = async (req, res) => {
  let startups = [];
  try {
    startups = await Team.find({
      type: "STARTUP",
      published: { $in: ["true", true] }
    }).lean();
    return res.status(200).json({ success: true, startups });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

getPublishStartupsById = async (req, res) => {
  let id = null;

  if (req && req.params.id) id = req.params.id;
  else throw new Error("ID Param is required");
  let startup = null;
  try {
    try {
      startup = await Team.find({
        published: {
          $in: ["true", true]
        },
        _id: {
          $eq: id
        }
      }).lean();
    } catch (error) {
      startup = [];
    }
    if (startup && startup.length == 0) throw new Error("startup not found");
    return res.status(200).json({ success: true, startup: startup[0] });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

// EVENTS
getPublishEvents = async (req, res) => {
  let events = [],
    upcommingEvents = [],
    oldEvents = [];
  let currentDate = null;

  try {
    events = await Activities.find({
      published: {
        $in: ["true", true]
      },
      type: {
        $eq: "Event"
      }
    })
      .sort({ start_date: -1 })
      .lean();

    // current date
    try {
      currentDate = new Date().getTime();
    } catch (error) {
      // currentDate = error.message;
    }
    console.log("currentDate  ### ", currentDate);

    if (events)
      upcommingEvents = events.filter(ev => {
        let start_date = 0;
        try {
          if (ev.start_date && ev.start_date.split("/").length > 0) {
            let arrayDate = ev.start_date.split("-");
            // 06/24/2019
            console.log("arrayDate  ### ", arrayDate);
            start_date = new Date(
              arrayDate[0] || "100",
              arrayDate[2] || "10",
              arrayDate[1] || "29"
            ).getTime();
          }
        } catch (error) {
          start_date = 0;
        }
        console.log("start_date  ### ", start_date);

        return start_date > currentDate;
      });
    if (events)
      oldEvents = events.filter(ev => {
        let start_date = 0;
        try {
          if (ev.start_date && ev.start_date.split("/").length > 0) {
            let arrayDate = ev.start_date.split("-");
            // 06/24/2019
            // [ '2019', '09', '13' ]
            console.log("arrayDate  ### ", arrayDate);
            start_date = new Date(
              arrayDate[0] || "100",
              arrayDate[2] || "10",
              arrayDate[1] || "29"
            ).getTime();
          }
        } catch (error) {
          start_date = 0;
        }
        console.log("start_date  ### ", start_date);

        return start_date < currentDate;
      });

    return res.status(200).json({
      success: true,
      data: { date: currentDate, upcommingEvents, oldEvents }
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};
getPublishEventById = async (req, res) => {
  let id = null;

  if (req && req.params.id) id = req.params.id;
  else throw new Error("ID Param is required");
  let event = null;
  try {
    try {
      event = await Activities.find({
        published: {
          $in: ["true", true]
        },
        _id: {
          $eq: id
        }
      }).lean();
    } catch (error) {
      event = [];
    }
    if (event && event.length == 0) throw new Error("event not found");
    return res.status(200).json({ success: true, event: event[0] });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

// Portfolios
getPublishPortfolios = async (req, res) => {
  let portfolios = [];
  try {
    portfolios = await Activities.find({
      published: {
        $in: ["true", true]
      },
      type: {
        $nin: "Event"
      }
    })
      .sort({ order: -1 })
      .lean();

    if (portfolios) {
      let lenghtPortfolios = portfolios.length;
      console.log("lenghtPortfolios   ", lenghtPortfolios);
      console.log("portfolios.map   ", portfolios);
      portfolios = portfolios.map(portfolio => {
        if (portfolio)
          if (portfolio && portfolio.order && portfolio.order == 0)
            portfolio.order = lenghtPortfolios++;
        if (portfolio && !portfolio.order) portfolio.order = lenghtPortfolios++;

        return portfolio;
      });
    }

    console.log("portfolios.map after   ", portfolios);
    portfolios = portfolios.sort((a, b) => {
      return a.order > b.order;
    });
    console.log(
      "portfolios.sort after   ",
      portfolios.map(p => {
        return p.order;
      })
    );

    return res.status(200).json({ success: true, portfolios });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

getPublishPortfolioById = async (req, res) => {
  let id = null;

  if (req && req.params.id) id = req.params.id;
  else throw new Error("ID Param is required");
  let portfolio = null;
  try {
    try {
      portfolio = await Activities.find({
        published: {
          $in: ["true", true]
        },
        _id: {
          $eq: id
        }
      }).lean();
    } catch (error) {
      portfolio = [];
    }
    if (portfolio && portfolio.length == 0)
      throw new Error("portfolio not found");
    return res.status(200).json({ success: true, portfolio: portfolio[0] });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};
router.get("", getwebsiteData);
router.get("/testimonials", getPublishTestimonials);
router.get("/testimonials/:id", getPublishTestimonialsById);
// Startups
router.get("/startups", getPublishStartups);
router.get("/startups/:id", getPublishStartupsById);
// Portfolio
router.get("/portfolios", getPublishPortfolios);
router.get("/portfolios/:id", getPublishPortfolioById);
// Events
router.get("/events", getPublishEvents);
router.get("/events/:id", getPublishEventById);
module.exports = router;
