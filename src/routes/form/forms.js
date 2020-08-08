var express = require("express");
var router = express.Router();
const Form = require("../../models/Form");
function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }
  return JSON.stringify(obj) === JSON.stringify({});
}
// const formController  = require('../controller/formController')
// Get All
router.get("", function(req, res) {
  const query = req.query;
  Form.find(query)
    .then(form => {
      res.json({
        success: true,
        data: form,
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
  Form.findByIdAndUpdate(id, req.body, { new: true })
    .then(form => {
      res.json({
        success: true,
        data: form,
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
  Form.findByIdAndRemove(id)
    .then(data => {
      res.json({
        success: true,
        data: "form " + id + "sucessfully removed .",
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
  Form.remove()
    .then(data => {
      res.json({
        success: true,
        data: "form sucessfully removed .",
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
  Form.findById(id)
    .then(form => {
      res.json({
        success: true,
        data: form,
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: "form " + id + " Not Found !",
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
    Form.findOne({
      name: req.body.name || "",
    })
      .then(form => {
        if (!form) {
          Form.create(req.body)
            .then(form => {
              res.json({
                success: true,
                message: form.name + " registered",
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
