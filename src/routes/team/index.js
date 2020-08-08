var express = require("express");
var router = express.Router();
var multer = require("multer");
const Team = require("../../models/Team");
const User = require("../../models/User");
var services = require("./services");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = `../resources/Team`;
    // if (!fs.existsSync(dir)) fs.mkdir(dir);
    cb(null, "../resources/Team");
    console.log("resources/Team");
  },
  filename: function(req, file, cb) {
    console.log();
    //cb(null, file.originalname);
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
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.post("/upload", upload.single("image"), function(req, res, next) {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });

    return res.status(200).json({ success: true, message: req.file.filename });
    // req.body.name = `/col/${req.file.filename}`;
    // req.body.name = `/col/${req.file.filename}`;
  } catch (error) {
    console.log(error);
  }
});
//get all

getAllEvent = async (req, res) => {
  const query = req.query;
  let members = [];
  let usersDetails = [];
  let teams = await Team.find(query).lean();
  let _teams = await Promise.all(
    teams.map(async team => {
      let _team = Object.assign(team, { usersDetails });
      members = Array.from(team.members);
      if (members.length) {
        let _mbr = members.map(obj => {
          if (obj && obj.userId && obj.userId != "") return obj.userId;
        });
        _mbr = _mbr.filter(obj => {
          return obj != undefined;
        });
        if (_mbr.length > 0)
          usersDetails = await User.find({
            _id: {
              $in: _mbr,
            },
          });

        _team.usersDetails = Array.from(usersDetails);
      }
      delete _team.members;
      return _team;
    })
  );
  res.json({
    success: true,
    data: _teams,
  });
};

router.get("", getAllEvent);

//get by id

router.get("/:id", (req, res) => {
  const id = req.params.id;
  Team.findById(id)
    .then(teams => {
      res.json({
        success: true,
        data: teams,
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: "Team " + id + " Not Found !",
      });
    });
});

// update by Id
router.put("/:id", (req, res) => {
  const id = req.params.id;
  Team.findByIdAndUpdate(id, req.body, { new: true })
    .then(teams => {
      res.json({
        success: true,
        data: teams,
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message,
      });
    });
});
// delete by Id
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  // Team.findByIdAndRemove(id)
  services
    .deleteTeam(id)
    .then(data => {
      res.json({
        success: true,
        message: "Team  " + id + "sucessfully removed .",
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message,
      });
    });
});

//post

router.post("", (req, res) => {
  if (!req.body.name) {
    res.json({
      success: false,
      message: "insert Data",
    });
  } else {
    Team.findOne({
      name: req.body.name || "",
    })
      .then(teams => {
        if (!teams) {
          Team.create(req.body)
            .then(teams => {
              res.json({
                success: true,
                data: teams,
              });
            })
            .catch(err => {
              res.json({
                success: false,
                message: err.message,
              });
            });
        } else {
          res.json({ success: false, message: "Team already exists" });
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

//Delete all
router.delete("", (req, res) => {
  Team.remove()
    .then(teams => {
      res.json({
        success: true,
        message: "sucessfully removed .",
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message,
      });
    });
});
////////////////////////////////////////////////////
/////////----------Members from team--------///////
//get members by id

router.get("/:id/members", (req, res) => {
  const id = req.params.id;
  Team.findById(id)
    .select("members")
    .then(teams => {
      res.json({
        success: true,
        data: teams,
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: "Team member" + id + " Not Found !",
      });
    });
});
//delete member in team

router.put("/:id/members/:idmember/delete", (req, res) => {
  const id = req.params.id;
  const idmember = req.params.idmember;
  Team.findOneAndUpdate(id, {
    $pull: { members: { _id: idmember } },
    new: true,
    upsert: true,
  })
    .then(data => {
      res.json({
        success: true,
        message: "team member " + id + " sucessfully deleted .",
      });
    })

    .catch(err => {
      res.json({
        success: false,
        message: err.message,
      });
    });
});
//Add new member in team

router.put("/:id/members/add", (req, res) => {
  const id = req.params.id;
  Team.findOneAndUpdate({ _id: id }, { $push: { members: req.body } })
    .then(data => {
      res.json({
        success: true,
        data: "Team member " + id + " sucessfully pushed .",
      });
    })

    .catch(err => {
      res.json({
        success: false,
        message: err.message,
      });
    });
});
//update member in team

router.put("/:id/members/:userId/update", (req, res) => {
  const id = req.params.id;
  const userId = req.params.userId;
  Team.findOneAndUpdate(
    {
      _id: id,
      members: {
        $elemMatch: {
          _id: userId,
        },
      },
    },
    { $set: { "members.$": req.body } }
  )
    .then(data => {
      res.json({
        success: true,
        data: "Team member  " + id + " sucessfully updated .",
      });
    })

    .catch(err => {
      res.json({
        success: false,
        message: err.message,
      });
    });
});
////////////////////////////////////////////////////
/////////----------collaborators from team--------///////
//get collaborators by id

router.get("/:id/collaborators", (req, res) => {
  const id = req.params.id;
  Team.findById(id)
    .select("collaborators")
    .then(teams => {
      res.json({
        success: true,
        data: teams,
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: "collaborators Team " + id + " Not Found !",
      });
    });
});
//delete collaborators in team

router.put("/:id/collaborators/:idcollaborator/delete", (req, res) => {
  const id = req.params.id;
  const idcollaborator = req.params.idcollaborator;
  Team.findOneAndUpdate(id, {
    $pull: { collaborators: { _id: idcollaborator } },
    new: true,
    upsert: true,
  })
    .then(data => {
      res.json({
        success: true,
        message: "team collaborator " + id + " sucessfully deleted .",
      });
    })

    .catch(err => {
      res.json({
        success: false,
        message: err.message,
      });
    });
});
//Add new collaborators in team

router.put("/:id/collaborators/add", (req, res) => {
  const id = req.params.id;
  Team.findOneAndUpdate({ _id: id }, { $push: { collaborators: req.body } })
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
//update collaborators in team

router.put("/:id/collaborators/:collaboratorId/update", (req, res) => {
  const id = req.params.id;
  const collaboratorId = req.params.collaboratorId;
  Team.findOneAndUpdate(
    {
      _id: id,
      collaborators: {
        $elemMatch: {
          _id: collaboratorId,
        },
      },
    },
    { $set: { "collaborators.$": req.body } }
  )
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
//CRUD MEDIA//
//add new media
router.put("/:id/media/add", (req, res) => {
  const id = req.params.id;
  Team.findOneAndUpdate({ _id: id }, { $push: { media: req.body } })
    .then(media => {
      res.json({
        success: true,
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
//delete MEDIA in Team
router.put("/:id/media/:idmedia/delete", (req, res) => {
  const id = req.params.id;
  const idmedia = req.params.idmedia;
  Team.findOneAndUpdate(id, {
    $pull: { media: { _id: idmedia } },
    new: true,
    upsert: true,
  })
    .then(data => {
      res.json({
        success: true,
        message: "Team media " + id + " sucessfully deleted .",
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message,
      });
    });
});

//update media in Team
router.put("/:id/media/:idmedia/update", (req, res) => {
  const id = req.params.id;
  const idmedia = req.params.idmedia;
  Team.findOneAndUpdate(
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
    .then(Team => {
      res.json({
        success: true,
        data: Team,
      });
    })

    .catch(err => {
      res.json({
        success: false,
        message: err.message,
      });
    });
});
//GET ALL MEDIA
router.get("/:id/media", (req, res) => {
  const id = req.params.id;
  Team.findById(id)
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
        message: "teams Not Found !",
      });
    });
});
//CRUD TAG //
//get TAG
router.get("/:id/tag", (req, res) => {
  const id = req.params.id;
  Team.findById(id)
    .select("tags")
    .then(tag => {
      res.json({
        success: true,
        data: tag,
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: "teams tag Not Found !",
      });
    });
});
//add TAG in Team
router.put("/:id/tag/add/:value", (req, res) => {
  const id = req.params.id;
  const value = req.params.value;
  Team.findOneAndUpdate({ _id: id }, { $push: { tags: value } })
    .then(tag => {
      res.json({
        success: true,
        data: tag,
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message,
      });
    });
});
//delete tag in Team

router.put("/:id/tag/delete/:valueTag", (req, res) => {
  const id = req.params.id;
  const valueTag = "" + req.params.valueTag.toString();
  Team.findOneAndUpdate(id, { $pull: { tags: valueTag } })
    .then(data => {
      res.json({
        success: true,
        message: "Team tag " + id + " sucessfully deleted . " + valueTag,
      });
    })

    .catch(err => {
      res.json({
        success: false,
        message: err.message,
      });
    });
});

//UPDATE TAGS

router.put("/:id/tag/update/:valueTag/:newValue", (req, res) => {
  const id = req.params.id;
  const valueTag = "" + req.params.valueTag.toString();
  const newValue = "" + req.params.newValue.toString();
  Team.findOneAndUpdate(
    {
      _id: id,
      tags: {
        $elemMatch: {
          tags: valueTag,
        },
      },
    },
    { $set: { "tags.$.0": newValue } }
  )
    .then(tag => {
      res.json({
        success: true,
        data: tag,
      });
    })

    .catch(err => {
      res.json({
        success: false,
        message: err.message,
      });
    });
});

module.exports = router;
