const express = require("express");
const router = express.Router();
const uuid = require("uuid/v4");

const passport = require("passport");
const passportJwt = passport.authenticate("jwt", { session: false });
const nconf = require("nconf");
const multer = require("multer");
const Testimonial = require("../../models/Testimonials");
const fs = require("fs-extra");
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir00 = `../resources`;

    try {
      if (!fs.existsSync(dir00)) fs.mkdir(dir00);
      const dir = `../resources/testimonials`;
      if (!fs.existsSync(dir)) fs.mkdir(dir);
    } catch (error) {}

    cb(null, "../resources/testimonials");
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
  //   fileSize: 1024 * 1024 * 5
  // },
  fileFilter: fileFilter
});

getAllTestimonials = async (req, res) => {
  const pagination = {
    offset: parseInt(req.query.offset) || 0,
    limit: parseInt(req.query.limit) || 10000 // TODO: fix later
  };
  console.log(pagination.offset);
  console.log(pagination.limit);
  const sortOptions = { order: -1 };
  try {
    const testimonials = await Testimonial.find()
      .skip(pagination.offset)
      .limit(pagination.limit)
      .sort({ order: 1 })
      .lean();

    if (testimonials)
      res.json({
        success: true,
        data: testimonials
      });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

addAllTestimonial = async (req, res) => {
  let query = req.body;
  try {
    let testimonials = Testimonial.create(query, {
      name: 1,
      image: 1,
      video: 1,
      quotes: 1,
      profile: 1,
      order: 1,
      tags: 1,
      created_at: 1,
      updated_at: 1
    });

    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

addTestimonial = async (req, res) => {
  let { testimonial } = req.body;

  try {
    if (!testimonial) throw new Error("Testimonial is required");
    // console.log("query  ###", testimonial);

    const query = JSON.parse(testimonial);

    if (req.file) {
      // delete query.file;
      if (req.file.filename)
        query.image = `/images/testimonials/${req.file.filename}`;
    } else delete query.image;
    let testimonials = await Testimonial.create(query);

    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};
updateTestimonial = async (req, res) => {
  let { testimonial } = req.body;
  if (!testimonial) throw new Error("Testimonial is required");

  if (req && req.params.id) id = req.params.id;
  else throw new Error("ID Param is required");
  const query = JSON.parse(testimonial);

  try {
    let oldTestimonial = await Testimonial.findById(id);
    if (!oldTestimonial) throw new Error("testimonial not exist");
    const { image } = oldTestimonial;

    if (req && req.file) {
      // delete query.file;

      if (req.file.filename) {
        query.image = `/images/testimonials/${req.file.filename}`;

        try {
          if (fs.existsSync(`../resources${image.replace("/images", "")}`)) {
            console.log(
              "existsSync  deleteStartup #### YES",
              `../resources${image.replace("/images", "")}`
            );
            fs.removeSync(`../resources${image.replace("/images", "")}`);
          } else {
          }
        } catch (error) {}
      }
    } else delete query.image;

    let testimonials = await Testimonial.findByIdAndUpdate(id, query);

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

deleteTestimonial = async (req, res) => {
  if (req && req.params.id) id = req.params.id;
  else throw new Error("ID Param is required");

  try {
    let testimonial = await Testimonial.findById(id);
    if (!testimonial) throw new Error("testimonial not exist");
    const { image } = testimonial;

    const _testimonial = await Testimonial.findByIdAndRemove(id);
    if (fs.existsSync(`../resources${image.replace("/images", "")}`)) {
      fs.removeSync(`../resources${image.replace("/images", "")}`);
    } else {
    }
    // fs.removeSync(`../resources${image}`);

    res.json({
      success: true,
      message: "Testimonial  " + Testimonial.name + "sucessfully removed ."
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

router.get("", getAllTestimonials);
router.post("", upload.single("image"), passportJwt, addTestimonial);
// router.put("/:id", upload.single("image"), updateTestimonial);
router.put("/:id", upload.single("image"), passportJwt, updateTestimonial);
// router.delete("/deleteall", passportJwt, deleteAllTestimonial);
router.delete("/:id", passportJwt, deleteTestimonial);
// router.post("/all", addAllTestimonial);
// router.get("/:id", getOnetestimonials);
// router.post("", upload.single("image"), addtestimonial);
// router.post("/upload/:id", upload.single("image"), uploadLogo);

// router.use("/images", express.static("../resources/testimonials/"));
module.exports = router;
