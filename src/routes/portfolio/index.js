const express = require("express");
const router = express.Router();
const uuid = require("uuid/v4");
const Activity = require("../../models/Activity");
const Testimonial = require("../../models/Testimonials");
const User = require("../../models/User");
const nconf = require("nconf");
const multer = require("multer");
const activityServices = require("../activity/services");
const userServices = require("../users/services");
const fs = require("fs-extra");

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    try {
      const dir0 = `../resources/`;
      if (!fs.existsSync(dir0)) fs.mkdir(dir0);

      const dir = `../resources/portfolios`;
      if (!fs.existsSync(dir)) fs.mkdir(dir);
    } catch (error) {
      console.log("create folder portfolios", error);
    }
    cb(null, "../resources/portfolios");
  },
  filename: function(req, file, cb) {
    let name = `${uuid()}.png`;

    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  cb(null, true);
};
let maxSize = 32 * 1000 * 1000;

const upload = multer({
  storage: storage,
  // limits: {
  //   // fileSize: 1024 * 1024 * 5
  //   fileSize: maxSize
  // },
  fileFilter: fileFilter
});

findTestimonials = async () => {
  let testimonials = [];
  try {
    testimonials = await Testimonial.find().lean();
  } catch (error) {
    testimonials = [];
  }
  return testimonials;
};

// done with members
getAllPortfolio = async (req, res) => {
  let _portfolios = [];
  let testimonials = [];

  const pagination = {
    offset: req.query.offset || 0,
    limit: req.query.limit || 10000 // TODO: fix later
  };
  try {
    let portfolios = await activityServices.getAllActivities({
      pagination
    });

    if (portfolios)
      portfolios = portfolios.map(portfolio => {
        delete portfolio.guests;
        delete portfolio.sponsors;
        delete portfolio.participants;
        delete portfolio.childActivities;
        delete portfolio.processes;
        return portfolio;
      });

    try {
      testimonials = await findTestimonials();
    } catch (error) {
      testimonials = [];
    }
    res.json({
      success: true,
      data: { portfolios, testimonials }
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};
// done with members
getPublishPortfolio = async (req, res) => {
  let _portfolios = [];

  const pagination = {
    offset: req.query.offset || 0,
    limit: req.query.limit || 10000 // TODO: fix later
  };
  try {
    let portfolios = await activityServices.getAllActivities({
      req: { published: { $in: ["true", true] } },
      pagination
    });

    if (portfolios)
      portfolios = portfolios.map(portfolio => {
        delete portfolio.guests;
        delete portfolio.sponsors;
        delete portfolio.participants;
        delete portfolio.childActivities;
        delete portfolio.processes;
        return portfolio;
      });
    res.json({
      success: true,
      data: portfolios || []
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

getOnePortfolio = async (req, res) => {
  if (req && req.params.id) id = req.params.id;
  else throw new Error("ID Param is required");
  try {
    let portfolio = await activityServices.getAvtivityDetails(id);

    res.json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

addPortfolio = async (req, res) => {
  let { portfolio } = req.body;
  // delete portfolio.logo;
  try {
    // if (!portfolio) throw new Error("portfolio is required");
    if (!portfolio && !req.file) throw new Error("portfolio is required");

    let query = { cover: "", media: [] };
    if (portfolio) {
      query = JSON.parse(portfolio);
    }

    if (req.file) {
      delete query.file;
      if (req.file.filename) {
        query.cover = `/images/portfolios/${req.file.filename}`;
        // if (query && query.media)
        //   query.media.push({
        //     type: "cover",
        //     url: `/images/portfolios/${req.file.filename}`
        //   });
        // query.cover = `/images/portfolio/${req.file.filename}`;
      }
    } else delete query.cover;

    let _portfolio = await activityServices.addActivityByType(query);
    if (_portfolio) {
      delete _portfolio.guests;
      delete _portfolio.sponsors;
      delete _portfolio.participants;
      delete _portfolio.childActivities;
      delete _portfolio.processes;
    }
    res.json({
      success: true,
      data: _portfolio
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message
    });
  }
};

deletePortfolio = async (req, res) => {
  if (req && req.params.id) id = req.params.id;
  else throw new Error("ID Param is required");

  try {
    let portfolio = await Activity.findById(id, { media: 1 }).lean();
    if (!portfolio) throw new Error("portfolio not exist");
    const { cover } = portfolio;
    const _portfolio = await activityServices.deleteActivity(id);

    if (
      cover &&
      cover != "" &&
      fs.existsSync(`../resources${cover.replace("/images", "")}`)
    ) {
      fs.removeSync(`../resources${cover.replace("/images", "")}`);
    } else {
    }

    res.json({
      success: true,
      message: "portfolio  " + portfolio.name + "   sucessfully removed ."
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};
deleteMedia = async (req, res) => {
  if (req && req.params.id) id = req.params.id;
  else throw new Error("ID Param is required");
  if (req && req.query.link) link = req.query.link;
  else throw new Error("link Image is required");

  try {
    let portfolio = await Activity.findById(id, { media: 1 }).lean();
    if (!portfolio) throw new Error("portfolio not exist");
    const { media } = portfolio;
    let _media = media.filter(m => {
      return m != link;
    });
    console.log(" link   media ", _media);
    // const _portfolio = await activityServices.deleteActivity(id);

    if (
      link &&
      link != "" &&
      fs.existsSync(`../resources${link.replace("/images", "")}`)
    ) {
      fs.removeSync(`../resources${link.replace("/images", "")}`);
    } else {
    }

    let portfolioUpedited = await activityServices.updateActivity(id, {
      media: _media
    });

    res.json({
      success: true,
      data: portfolioUpedited,
      message: "Image sucessfully removed ."
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

updatePortfolio = async (req, res) => {
  try {
    let data = [];
    // delete startup.logo;

    if (req && req.params.id) id = req.params.id;
    else throw new Error("ID Param is required");
    if (!req.body) throw new Error("body is required");
    let { portfolio } = req.body;
    if (!portfolio && !req.file) throw new Error("portfolio is required");
    let _portfolio = await activityServices.getAvtivityDetails(id);
    if (!_portfolio) throw new Error("Portfolio not exist");
    let query = { cover: "" };
    if (portfolio) {
      try {
        query = JSON.parse(portfolio);
      } catch (error) {}
    }

    let { cover } = query;

    if (req.file) {
      delete query.file;
      if (req.file.filename) {
        console.log(` ######  ../resources${cover.replace("/images", "")}`);
        if (
          cover &&
          (cover != "") &
            fs.existsSync(`../resources${cover.replace("/images", "")}`)
        ) {
          fs.removeSync(`../resources${cover.replace("/images", "")}`);
        } else {
        }
        query.cover = `/images/portfolios/${req.file.filename}`;
        console.log(
          `cover ######  ../resources${cover.replace("/images", "")}`
        );
      } else delete query.cover;
    } else {
      delete query.cover;
      query.cover = cover;
    }

    let portfolioUpedited = await activityServices.updateActivity(id, query);

    res.json({
      success: true,
      data: query
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

uploadGalery = async (req, res) => {
  if (req && req.params.id) id = req.params.id;
  else throw new Error("ID Param is required");
  if (!req.body) throw new Error("body is required");
  try {
    let galeries = [];
    let _portfolio = await Activity.findById(id, { media: 1 }).lean();
    if (!_portfolio) throw new Error("Portfolio not exist");
    console.log(" _portfolio.media  ##", _portfolio.media);
    if (_portfolio && _portfolio.media) {
      galeries = _portfolio.media;
      // console.log("galeries  ##", galeries);
    }
    // console.log("galeries  ##", galeries);
    // let query = { media };

    if (galeries) galeries = galeries.filter(m => typeof m === "string");
    if (!req.files)
      return res
        .status(400)
        .json({ success: false, message: "No images to upload" });
    else {
      //
      req.files.map(file => {
        galeries.push(`/images/portfolios/${file.filename}`);
      });
      // console.log("galeries 222  ##", galeries);
      // Array.prototype.push.apply(query.media, media);
      let portfolioUpedited = await activityServices.updateActivity(id, {
        media: galeries
      });
      // console.log("portfolioUpedited 222  ##", portfolioUpedited);
      return res.status(200).json({ success: true, data: portfolioUpedited });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

// CRUD COVER2

uploadCover2Portfolio = async (req, res) => {
  try {
    let portfolioUpedited = null;
    if (req && req.params.id) id = req.params.id;
    else throw new Error("ID Param is required");
    if (!req.file) throw new Error("Cover2 is required");

    let _portfolio = await Activity.findById(id).lean();
    if (!_portfolio) throw new Error("Portfolio not exist");
    let { cover2 } = _portfolio;

    if (req.file) {
      if (req.file.filename) {
        console.log(" req.file.filename ", req.file.filename);
        // if (
        //   cover2 &&
        //   cover2 != "" &&
        //   fs.existsSync(`../resources${cover2.replace("/images", "")}`)
        // ) {
        //   fs.removeSync(`../resources${cover2.replace("/images", "")}`);
        // } else {
        // }
        if (cover2 && cover2 != "") {
          try {
            fs.removeSync(`../resources${cover2.replace("/images", "")}`);
          } catch (error) {}
        } else {
        }

        let _cover2 = `/images/portfolios/${req.file.filename}`;

        if (_cover2)
          portfolioUpedited = await activityServices.updateActivity(id, {
            cover2: _cover2
          });
        // query.cover = `/images/portfolios/${req.file.filename}`;
      }
      return res.status(200).json({ success: true, data: portfolioUpedited });
    } else {
      res.json({
        success: false,
        message: error.message
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: `filename is not defined ${req.file.filename} `
    });
  }
};

deleteCover2Portfolio = async (req, res) => {
  try {
    if (req && req.params.id) id = req.params.id;
    else throw new Error("ID Param is required");
    if (req && req.query.link) link = req.query.link;
    else throw new Error("link Image is required");
    let portfolio = await Activity.findById(id, { cover2: 1 }).lean();
    if (!portfolio) throw new Error("portfolio not exist");
    const { cover2 } = portfolio;

    if (
      link &&
      link != "" &&
      fs.existsSync(`../resources${link.replace("/images", "")}`)
    ) {
      fs.removeSync(`../resources${link.replace("/images", "")}`);
    } else {
    }

    let portfolioUpedited = await activityServices.updateActivity(id, {
      cover2: ""
    });

    res.json({
      success: true,
      data: portfolioUpedited,
      message: "Cover2 sucessfully removed ."
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

router.get("", getAllPortfolio);
router.get("/published", getPublishPortfolio);
router.get("/:id", getOnePortfolio);
router.put("/:id", upload.single("cover"), updatePortfolio);
router.post(
  "/uploadCover2Portfolio/:id",
  upload.single("cover2"),
  uploadCover2Portfolio
);
router.delete("/deleteCover2Portfolio/:id", deleteCover2Portfolio);
router.post("", upload.single("cover"), addPortfolio);
router.delete("/:id", deletePortfolio);
router.post("/uploadgalerie/:id", upload.array("files"), uploadGalery);
router.delete("/deletemedia/:id", deleteMedia);

module.exports = router;
