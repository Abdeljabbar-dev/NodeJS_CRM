var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var multer = require("multer");
// var fs = require("fs");
// router.use(bodyParser.urlencoded({ extended: true }));
var Collaborator = require("../../models/Collaborator");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = `../resources/col`;
    // if (!fs.existsSync(dir)) fs.mkdir(dir);
    cb(null, "../resources/col");
    console.log("resources/col");
  },
  filename: function(req, file, cb) {
    console.log();
    // cb(null, file.originalname);
    cb(
      null,
      new Date().getMinutes() +
        "" +
        new Date().getMinutes() +
        "_" +
        file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  cb(null, true);
};

const upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 1024 * 1024 * 5
  // },
  fileFilter: fileFilter,
});

router.post("/col", upload.single("image"), function(req, res, next) {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    }

    return res.status(200).json({ success: true, message: req.file.filename });
    // req.body.name = `/col/${req.file.filename}`;
    // req.body.name = `/col/${req.file.filename}`;
  } catch (error) {
    console.log(error);
  }
});

router.post("/", function(req, res) {
  if (!req.body.nameC) {
    res.json({
      success: false,
      message: "insert Data",
    });
  } else {
    Collaborator.findOne({
      nameC: req.body.nameC || "",
    })
      .then(collaborator => {
        if (!collaborator) {
          Collaborator.create(req.body)
            .then(collaborator => {
              res.json({
                success: true,
                message: collaborator.nameC + " registered",
              });
            })
            .catch(err => {
              res.json({
                success: false,
                message: err.message,
              });
            });
        } else {
          res.json({ success: false, message: "Collaborator already exists" });
        }
      })
      .catch(err => {
        res.json({
          success: false,
          message: err.message,
        });
      });
  }
});
// RETURNS ALL THE Collaborators IN THE DATABASE
router.get("/", function(req, res) {
  Collaborator.find({})
    .then(collaborator => {
      if (collaborator) {
        res.json({
          success: true,
          data: collaborator,
        });
      } else {
        res.json({
          success: false,
        });
      }
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message,
      });
    });
});

// GET A SINGLE Collaborator FROM THE DATABASE
router.get("/:id", function(req, res) {
  const id = req.params.id;
  Collaborator.findById(id)
    .then(collaborator => {
      res.json({
        success: true,
        data: collaborator,
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message,
      });
    });
});
// DELETES A Collaborator FROM THE DATABASE
router.delete("/:id", function(req, res) {
  const id = req.params.id;
  Collaborator.findByIdAndRemove(id)
    .then(data => {
      res.json({
        success: true,
        message: "Collaborator " + id + " sucessfully removed .",
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message,
      });
    });
});

// deleted

router.delete("/", (req, res) => {
  Collaborator.remove()
    .then(data => {
      res.json({
        success: true,
        message: " Collaborators sucessfully removed  .",
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message,
      });
    });
});

// UPDATES A SINGLE Collaborator IN THE DATABASE
router.put(
  "/:id",
  /* VerifyToken, */ function(req, res) {
    Collaborator.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      function(err, collaborator) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }
        res.status(200).json({
          success: true,
          data: collaborator,
        });
      }
    );
  }
);

// CRUD MEDIA//
// add new media
router.put("/:id/media/add", (req, res) => {
  const id = req.params.id;
  Collaborator.findOneAndUpdate({ _id: id }, { $push: { media: req.body } })
    .then(media => {
      res.json({
        success: true,
        message: "Collaborator media " + id + " sucessfully pushed .",
        data: media,
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message,
      });
    });
});

// GET ALL MEDIA
router.get("/media/:id", (req, res) => {
  const id = req.params.id;
  Collaborator.findById(id)
    .select("media")
    .then(media => {
      res.json({
        success: true,
        data: media,
      });
    })
    .catch(err => {
      res.json({
        message: "collaborators Not Found !",
      });
    });
});

// update media in Collaborators

router.put("/:id/media/:idmedia/update", (req, res) => {
  const id = req.params.id;
  const idmedia = req.params.idmedia;
  Collaborator.findOneAndUpdate(
    {
      _id: id,
      media: {
        $elemMatch: {
          _id: idmedia,
        },
      },
    },
    { $set: { "media.$": req.body } }
  )
    .then(Collaborator => {
      res.json({
        success: true,
        data: Collaborator,
      });
    })

    .catch(err => {
      res.json({
        success: false,
        message: err.message,
      });
    });
});

// delete MEDIA in Collaborators
router.put("/:id/media/:idmedia/delete", (req, res) => {
  const id = req.params.id;
  const idmedia = req.params.idmedia;
  Collaborator.findOneAndUpdate(id, {
    $pull: { media: { _id: idmedia } },
    new: true,
    upsert: true,
  })
    .then(data => {
      res.json({
        success: true,
        message: "Collaborator media " + id + " sucessfully deleted .",
      });
    })

    .catch(err => {
      res.json({
        success: false,
        message: err.message,
      });
    });
});

//

// GET ALL MEDIA

router.get("/:id/media", (req, res) => {
  const id = req.params.id;
  Collaborator.findById(id)
    .select("media")
    .then(media => {
      res.json({
        success: true,
        data: media,
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: "collaborators Not Found !",
      });
    });
});

module.exports = router;
