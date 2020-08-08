var express = require("express");

var router = express.Router();
const FormGenerique = require("../../models/FormGenerique");

// const formGeneriqueController = require("../controller/formGeneriqueController");
// Get All
router.get("", function(req, res) {
  const query = req.query;
  FormGenerique.find(query)
    .then(formGenerique => {
      res.json({
        success: true,
        data: formGenerique,
      });
    })
    .catch(err => {
      res.json({
        success: false,
        data: err.message,
      });
    });
});
// update
router.put("/:id", function(req, res) {
  const id = req.params.id;
  FormGenerique.findByIdAndUpdate(id, req.body, { new: true })
    .then(formGenerique => {
      res.json({
        success: true,
        data: formGenerique,
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message,
      });
    });
});
// delete
router.delete("/:id", function(req, res) {
  const id = req.params.id;
  FormGenerique.findByIdAndRemove(id)
    .then(data => {
      res.json({
        success: true,
        data: "FormGenerique" + id + "sucessfully removed .",
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message,
      });
    });
});
// delete all
router.delete("", function(req, res) {
  FormGenerique.remove()
    .then(data => {
      res.json({
        success: true,
        data: "FormGeneriques sucessfully removed .",
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message,
      });
    });
});
// get One
router.get("/:id", function(req, res) {
  const id = req.params.id;
  FormGenerique.findById(id)
    .then(formGenerique => {
      res.json({
        success: true,
        data: formGenerique,
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: "FormGenerique " + id + " Not Found !",
      });
    });
});
// Post
router.post("", function(req, res) {
  if (!req.body.name) {
    res.json({
      success: false,
      message: "insert Data",
    });
  } else {
    FormGenerique.findOne({
      name: req.body.name || "",
    })
      .then(formGenerique => {
        if (!formGenerique) {
          FormGenerique.create(req.body)
            .then(formGenerique => {
              res.json({
                success: true,
                message: formGenerique.name + " registered",
              });
            })
            .catch(err => {
              res.json({
                success: false,
                message: err.message,
              });
            });
        } else {
          res.json({ success: false, message: "form already exists" });
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
module.exports = router;
