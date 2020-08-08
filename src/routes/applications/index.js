var express = require("express");
var bodyParser = require("body-parser");
var router = express.Router();
const Application = require("../../models/Application");
// const applicationController = require("../controller/applicationController");
router.use(bodyParser.urlencoded({ extended: true }));
// Get All
const isEmpty = require("../../middlewares/objectValidation");
router.get("", function(req, res) {
  const query = req.query;
  Application.find(query)
    .then(application => {
      res.json({
        success: true,
        data: application
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message
      });
    });
});
// update
router.put("/:id", function(req, res) {
  const id = req.params.id;
  Application.findByIdAndUpdate(id, req.body, { new: true })
    .then(application => {
      res.json({
        success: true,
        data: application
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message
      });
    });
});
// delete
router.delete("/:id", function(req, res) {
  const id = req.params.id;
  Application.findByIdAndRemove(id)
    .then(data => {
      res.json({
        success: true,
        message: "application " + id + " sucessfully removed ."
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message
      });
    });
});
// delete all
router.delete("", function(req, res) {
  Application.remove()
    .then(data => {
      res.json({
        success: true,
        message: "applications sucessfully removed ."
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message
      });
    });
});
// get One
router.get("/:id", function(req, res) {
  const id = req.params.id;
  Application.findById(id)
    .then(application => {
      res.json({
        success: true,
        data: application
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message
      });
    });
});
// Post
// router.post("", function(req, res) {
//   // if (!req.body.userId) {
//   //   res.json({
//   //     success: false,
//   //     message: "insert Data",
//   //   });
//   // } else {
//   Application.create(req.body)
//     .then(application => {
//       res.json({
//         success: true,
//         data: application,
//       });
//     })
//     .catch(err => {
//       res.json({
//         success: false,
//         message: err.message,
//       });
//     });
//   // }
// });

// router.post("/", function(req, res) {
//   // if (!req.body.userId) {
//   //   res.json({
//   //     success: false,
//   //     message: "insert Data",
//   //   });
//   // } else {
//   Application.create(req.body)
//     .then(application => {
//       res.json({
//         success: true,
//         data: application,
//       });
//     })
//     .catch(err => {
//       res.json({
//         success: false,
//         message: err.message,
//       });
//     });
//   // }
// }),
router.post("", (req, res) => {
  if (!req.body.status) {
    res.json({
      success: false,
      message: "insert Data"
    });
  } else {
    Application.create(req.body)
      .then(application => {
        res.json({
          success: true,
          data: application
        });
      })
      .catch(err => {
        res.json({
          success: false,
          message: err.message
        });
      });
  }
});
// router.post("", function(req, res) {
//   console.log(req.body);

//   try {
//     var form_data = queryString.stringify(req.body);
//     // console.log(form_data);

//     axios.post(
//       "https://docs.google.com/forms/d/e/1FAIpQLSdcZw2hY6LZa2VLW8p45fKM3jKKP68tf73Di0HnqfZPAXfDfQ/formResponse",
//       form_data,
//       {
//         headers: { "Content-type": "application/x-www-form-urlencoded" },
//         timeout: 20000
//       }
//     );
//     return res.status(200).send("Inscription recue.");
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("Une erreur est survenue  !");
//   }
// });

module.exports = router;
