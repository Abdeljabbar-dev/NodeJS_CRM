const express = require("express");
const router = express.Router();
const uuid = require("uuid/v4");

const User = require("../../models/User");
const nconf = require("nconf");
const multer = require("multer");
const teamServices = require("../team/services");
const userServices = require("../users/services");
const fs = require("fs-extra");

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir0 = `../resources/`;
    if (!fs.existsSync(dir0)) fs.mkdir(dir0);

    const dir = `../resources/startups`;
    if (!fs.existsSync(dir)) fs.mkdir(dir);
    const dir1 = `../resources/users`;
    if (!fs.existsSync(dir1)) fs.mkdir(dir1);

    if (file.originalname.includes("member")) cb(null, "../resources/users");
    else cb(null, "../resources/startups");

    //   " file.originalname.includes",
    //   file.originalname.includes("memb")
    // );
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
  //   // fileSize: maxSize
  // },
  fileFilter: fileFilter
});
// done with members
getAllStratups = async (req, res) => {
  let _startups = [];

  const pagination = {
    offset: req.query.offset || 0,
    limit: req.query.limit || 10000 // TODO: fix later
  };
  try {
    const startups = await teamServices.getAllTeamsByType({
      type: "STARTUP",
      pagination
    });
    _startups = await Promise.all(
      startups.map(async startup => {
        // startup.members = await transformMembers(startup.members);

        startup.members = await getMembers(startup.members);
        return startup;
      })
    );

    if (startups)
      res.json({
        success: true,
        data: _startups
      });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

getOneStratups = async (req, res) => {
  if (req && req.params.id) id = req.params.id;
  else throw new Error("ID Param is required");
  try {
    let startup = await teamServices.findOneTeam(id);
    if (startup && startup.members)
      startup.members = await getMembers(startup.members);

    res.json({
      success: true,
      data: startup
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

addStratup = async (req, res) => {
  let { startup } = req.body;
  // delete startup.logo;
  try {
    // if (!startup) throw new Error("Startup is required");
    if (!startup && !req.file) throw new Error("Startup is required");

    let query = { logo: "" };
    if (startup) {
      query = JSON.parse(startup);

      if (query.members) {
        query.members = await transformMembers(query.members, req.files);
      }
    }

    // member_0  logo
    if (req.files) {
      delete query.files;

      const result = req.files.filter(file => {
        try {
          return file.originalname.split(".")[0].localeCompare("logo") == 0;
        } catch (error) {
          return false;
        }
      });
      if (result && result.length) {
        query.logo = `/images/startups/${result[0].filename}`;
      }
    } else delete query.logo;

    let stratups = await teamServices.addTeamByType("STARTUP", query);

    res.json({
      success: true,
      data: { ...query, _id: stratups._id }
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message
    });
  }
};

deleteStartup = async (req, res) => {
  if (req && req.params.id) id = req.params.id;
  else throw new Error("ID Param is required");

  try {
    let startup = await teamServices.findOneTeam(id);
    if (!startup) throw new Error("Startup not exist");
    const { logo } = startup;

    const _startup = await teamServices.deleteTeam(id);
    if (fs.existsSync(`../resources${logo.replace("/images", "")}`)) {
      fs.removeSync(`../resources${logo.replace("/images", "")}`);
    } else {
    }
    res.json({
      success: true,
      message: "Startup  " + startup.name + "sucessfully removed ."
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

updateStartup = async (req, res) => {
  try {
    let data = [];
    // delete startup.logo;
    if (req && req.params.id) id = req.params.id;
    else throw new Error("ID Param is required");
    if (!req.body) throw new Error("body is required");
    let { startup } = req.body;
    if (!startup && !req.files) throw new Error("Startup is required");
    let _startup = await teamServices.findOneTeam(id);
    if (!_startup) throw new Error("Startup not exist");
    let query = { logo: "" };
    if (startup) {
      query = JSON.parse(startup);

      if (query.members) {
        query.members = await transformMembers(query.members, req.files);
      }
    }
    let { logo } = _startup;

    if (req && req.files) {
      delete query.files;
      const result = req.files.filter(file => {
        try {
          return file.originalname.split(".")[0].localeCompare("logo") == 0;
        } catch (error) {
          return false;
        }
      });
      if (result && result.length) {
        query.logo = `/images/startups/${result[0].filename}`;

        if (startup && logo)
          if (fs.existsSync(`../resources${logo.replace("/images", "")}`)) {
            fs.removeSync(`../resources${logo.replace("/images", "")}`);
          } else {
          }
      }
    }

    let stratupedited = await teamServices.updateTeam(id, query);

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
deleteImage = async (req, res) => {
  if (req && req.params.id) id = req.params.id;
  else throw new Error("ID Param is required");

  try {
    let message = "";
    let startup = await teamServices.findOneTeam(id);
    if (!startup) throw new Error("Startup not exist");
    const { logo } = startup;

    if (logo)
      if (fs.existsSync(`../resources${logo.replace("/images", "")}`)) {
        fs.removeSync(`../resources${logo.replace("/images", "")}`);
      } else {
      }

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

uploadLogo = async (req, res) => {
  if (req && req.params.id) id = req.params.id;
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    else {
      return res.status(200).json({ success: true, message: "image uploaded" });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

const getMembers = async users => {
  let _ids = users.map(user => {
    return user._id;
  });
  // { method: "users" }, { users: 1 }
  let _members = await User.find({ _id: { $in: _ids } }, { users: 1 }).lean();

  _members = _members.map(_user => {
    // return users.map(user => {
    //   // let role = users.filter(_user => {
    //   //   return _user._id.localeCompare(user._id) == 0;
    //   // });
    //   return { _id: user._id, ...user.users };
    // });
    return { _id: _user._id, ..._user.users };
  });
  return _members;
};
const transformMembers = async (members, files) => {
  let _members = members;
  if (!files) files = [];
  try {
    if (members)
      _members = await Promise.all(
        members.map(async (user, i) => {
          const result = files.filter(file => {
            let index = -1;
            try {
              if (file.originalname)
                index = parseInt(file.originalname.split(".")[0].split("_")[1]);
            } catch (error) {
              index = -1;
            }

            return index == i;
          });

          let _user = await transformUser(user, result[0]);

          return _user;
        })
      );
  } catch (error) {}
  return _members.filter(user => {
    if (user) return user;
  });
};
const transformUser = async (user, file) => {
  let _user = user;
  console.log("transformUser ### _user ", user);

  try {
    if (file) {
      if (file.filename) {
        _user.image = `/images/users/${file.filename}`;
        user.image = `/images/users/${file.filename}`;
      }
    }
    // else {
    //   delete _user.image;
    //   delete user.image;
    // }
    if (user.email)
      _user = await User.findOne({ "users.email": user.email }).lean();
    else if (user) _user = await User.findById(user._id).lean();
    if (_user) {
      _user = {
        ..._user.users,
        _id: _user._id,
        role: user.role,
        image: user.image
      };

      // todo update in database

      let updateUser = user;
      delete updateUser._id;
      delete updateUser.role;
      // if (!updateUser.image) delete updateUser.image;

      let users = { users: updateUser };

      let __updateUser = await User.findByIdAndUpdate(
        user._id || _user._id,
        users,
        {
          new: false
        }
      ).lean();

      console.log("transformUser ### __updateUser ", {
        _id: __updateUser._id,
        ...__updateUser.users,
        role: _user.role
      });
      return {
        _id: __updateUser._id,
        ...__updateUser.users,
        role: _user.role
      };
    } else {
      return await addNewuser(user);
    }
  } catch (error) {
    return await addNewuser(user);
    // return user;
  }
};

const addNewuser = async user => {
  let _user = null;

  try {
    delete user._id;
    if (user && user.email) {
      const newUser = new User({
        method: "users",
        users: {
          email: user.email,
          lastName: user.lastName || "",
          firstName: user.firstName || "",
          tel: user.tel || "",
          gender: user.gender || "CEO",
          image: user.image || ""
        }
      });
      _user = await newUser.save();

      // await newUser.save();
      _user.role = user.role || "CEO";
      if (_user && _user.users)
        _user = {
          ..._user.users,
          _id: _user._id,
          role: user.role || "CEO"
        };
    }

    return _user;
  } catch (error) {
    _user = user;
  }
};

router.get("", getAllStratups);
router.get("/:id", getOneStratups);
// router.put("/:id", upload.single("logo"), updateStartup);
router.put("/:id", upload.array("files"), updateStartup);
router.post("", upload.array("files"), addStratup);
router.delete("/:id", deleteStartup);
router.post("/upload/:id", upload.single("image"), uploadLogo);
router.post("/deleteImage/:id", deleteImage);

module.exports = router;
