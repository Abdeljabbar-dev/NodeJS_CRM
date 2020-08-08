var express = require("express");
var router = express.Router();
const ProcessInstance = require("../../models/ProcessInstance");

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }
  return JSON.stringify(obj) === JSON.stringify({});
}

// const processInstanceController = require("../controller/processInstanceController");
// Get All
router.get("", function(req, res) {
  const query = req.query;
  ProcessInstance.find(query)
    .then(processInstance => {
      res.json({
        success: true,
        data: processInstance
      });
    })
    .catch(err => {
      res.json({
        success: false,
        data: err.message
      });
    });
});
// update
router.put("/:id", function(req, res) {
  const id = req.params.id;
  ProcessInstance.findByIdAndUpdate(id, req.body, { new: true })
    .then(processInstance => {
      res.json({
        success: true,
        data: processInstance
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
  ProcessInstance.findByIdAndRemove(id)
    .then(data => {
      res.json({
        success: true,
        message: "ProcessInstance" + id + "sucessfully removed ."
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
  ProcessInstance.remove()
    .then(data => {
      res.json({
        success: true,
        message: "ProcessInstance sucessfully removed ."
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
  ProcessInstance.findById(id)
    .then(processInstance => {
      res.json({
        success: true,
        data: processInstance
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: "ProcessInstance " + id + " Not Found !"
      });
    });
});
// Post
router.post("", function(req, res) {
  if (isEmpty(req.body)) {
    return res.send("Object missing.");
  } else {
    ProcessInstance.findOne({
      name: req.body.name || ""
    })
      .then(processInstance => {
        if (!processInstance) {
          ProcessInstance.create(req.body)
            .then(processInstance => {
              res.json({
                success: true,
                message: processInstance.name + " registered"
              });
            })
            .catch(err => {
              res.json({
                success: false,
                message: err.message
              });
            });
        } else {
          res.json({
            success: false,
            message: "ProcessInstance already exists"
          });
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
//HELPERS
//CRUD Messages
// show all messages
router.get("/:id/messages", function(req, res) {
  const id = req.params.id;
  ProcessInstance.findById(id)
    .select("messages")
    .then(messages => {
      res.json({
        success: true,
        data: messages
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message
      });
    });
});
// ADD MESSAGE
router.put("/:id/messages/add", function(req, res) {
  const id = req.params.id;
  ProcessInstance.findOneAndUpdate(
    { _id: id },
    { $push: { messages: req.body } }
  )
    .then(message => {
      res.json({
        success: true,
        data: message
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message
      });
    });
});
// UPDATE MESSAGE
router.put("/:id/messages/:idmessage", function(req, res) {
  const id = req.params.id;
  const idmessage = req.params.idmessage;
  ProcessInstance.findOneAndUpdate(
    {
      _id: id,
      messages: {
        $elemMatch: {
          _id: idmessage
        }
      }
    },
    { $set: { "messages.$": req.body } }
  )
    .then(message => {
      res.json({
        success: true,
        data: message
      });
    })

    .catch(err => {
      res.json({
        success: false,
        message: err.message
      });
    });
});
// DELETE MESSAGE
router.put("/:id/messages/:idmessage/delete", function(req, res) {
  const id = req.params.id;
  const idmessage = req.params.idmessage;
  ProcessInstance.findOneAndUpdate(id, {
    $pull: { messages: { _id: idmessage } },
    new: true,
    upsert: true
  })
    .then(data => {
      res.json({
        success: true,
        message: " Message " + id + " sucessfully deleted ."
      });
    })

    .catch(err => {
      res.json({
        success: false,
        message: err.message
      });
    });
});
//CRUD Media
// show all media
router.get("/:id/media", function(req, res) {
  const id = req.params.id;
  ProcessInstance.findById(id)
    .select("media")
    .then(media => {
      res.json({
        success: true,
        data: media
      });
    })
    .catch(err => {
      res.json({
        success: true,
        message: err.message
      });
    });
});
// ADD media
router.put("/:id/media/add", function(req, res) {
  const id = req.params.id;
  ProcessInstance.findOneAndUpdate({ _id: id }, { $push: { media: req.body } })
    .then(media => {
      res.json({
        success: true,
        data: media
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message
      });
    });
});
// UPDATE media
router.put("/:id/media/:idmedia", function(req, res) {
  const id = req.params.id;
  const idmedia = req.params.idmedia;
  ProcessInstance.findOneAndUpdate(
    {
      _id: id,
      media: {
        $elemMatch: {
          _id: idmedia
        }
      }
    },
    { $set: { "media.$": req.body } }
  )
    .then(media => {
      res.json({
        success: true,
        data: media
      });
    })

    .catch(err => {
      res.json({
        success: false,
        message: err.message
      });
    });
});
// DELETE media
router.put("/:id/media/:idmedia/delete", function(req, res) {
  const id = req.params.id;
  const idmedia = req.params.idmedia;
  ProcessInstance.findOneAndUpdate(id, {
    $pull: { media: { _id: idmedia } },
    new: true,
    upsert: true
  })
    .then(media => {
      res.json({
        success: true,
        data: media
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
