var express = require("express");
var router = express.Router();

const Label = require("../../models/Label");

//CRUD Label //

// GET All Label

router.get("", (req, res) => {
  const query = req.query;
  Label.find(query)
    .then(labels => {
      res.json({
        success: true,
        data: labels
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message
      });
    });
});

//Add New Label//
router.post("", (req, res) => {
  if (!req.body.name) {
    res.json({
      success: false,
      message: "insert Data"
    });
  } else {
    Label.findOne({
      name: req.body.name || ""
    })
      .then(labels => {
        if (!labels) {
          Label.create(req.body)
            .then(labels => {
              res.json({
                success: true,
                data: labels
              });
            })
            .catch(err => {
              res.json({
                success: false,
                message: err.message
              });
            });
        } else {
          res.json({ success: false, message: "Label already exists" });
        }
      })
      .catch(err => {
        res.json({
          success: false,
          message: err.message
        });
      });
  }
});

//GET Label BY ID

router.get("/:id", (req, res) => {
  const id = req.params.id;
  Label.findById(id)
    .then(label => {
      res.json({
        success: true,
        data: label
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message
      });
    });
});

//delete label//

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  Label.findByIdAndRemove(id)
    .then(data => {
      res.json({
        success: true,
        message: "label " + id + "sucessfully removed ."
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message
      });
    });
});

//delete all label//

router.delete("", (req, res) => {
  Label.remove()
    .then(data => {
      res.json({
        success: true,
        message: "sucessfully removed ."
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message
      });
    });
});

//update label

router.put("/:id", (req, res) => {
  const id = req.params.id;
  Label.findByIdAndUpdate(id, req.body, { new: true })
    .then(label => {
      res.json({
        success: true,
        data: label
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message
      });
    });
});
module.exports = router;
