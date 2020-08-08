var express = require("express");
var router = express.Router();

const Process = require("../../models/Process");

//CRUD PROCESS //

// GET All Activity

router.get("", (req, res) => {
  const query = req.query;
  Process.find(query)
    .then(process => {
      res.json({
        success: true,
        data: process
      });
    })

    .catch(err => {
      res.json({
        success: false,
        message: err.message
      });
    });
});

//Add New Activity//
router.post("", (req, res) => {
  if (!req.body.name) {
    res.json({
      success: false,
      message: "insert Data"
    });
  } else {
    Process.findOne({
      name: req.body.name || ""
    })
      .then(process => {
        if (!process) {
          Process.create(req.body)
            .then(process => {
              res.json({
                success: true,
                data: process
              });
            })
            .catch(err => {
              res.json({
                success: false,
                message: err.message
              });
            });
        } else {
          res.json({ success: false, message: "process already exists" });
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

//GET Activity BY ID

router.get("/:id", (req, res) => {
  const id = req.params.id;
  Process.findById(id)
    .then(process => {
      res.json({
        success: true,
        data: process
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: "event " + id + " Not Found !"
      });
    });
});

//delete activity//

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  Process.findByIdAndRemove(id)
    .then(data => {
      res.json({
        success: true,
        message: "Activity " + id + "sucessfully removed ."
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message
      });
    });
});

//delete all activity//

router.delete("", (req, res) => {
  Process.remove()
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

//update activity

router.put("/:id", (req, res) => {
  const id = req.params.id;
  Process.findByIdAndUpdate(id, req.body, { new: true })
    .then(process => {
      res.json({
        success: true,
        data: process
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
