const express = require("express");
var users = express.Router();
var bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
var services = require("./services");
const cors = require("cors");
users.use(cors());
var User = require("../../models/User");
users.use(bodyParser.urlencoded({ extended: true }));

addUser = async (req, res, next) => {
  const { email, lastName, firstName, tel, gender, location, image } = req.body;
  const foundUser = await User.findOne({ "req.body.email": email });
  if (foundUser) {
    return res.status(403).json({ error: "User already exist" });
  }

  const newUser = new User({
    method: "users",
    users: {
      email: req.body.email,
      lastName: lastName,
      firstName: firstName,
      tel: tel,
      gender: gender,
      location: location,
      image: image
    }
  });
  await newUser.save();
  res.status(200).json({ Data: newUser });
};

users.get("/", (req, res, user) => {
  User.find({ method: "users" }, { users: 1 })
    .then(user => {
      if (user) {
        res.json({
          success: true,
          data: user
        });
      } else {
        res.json({
          success: false,
          message: "User does not exist"
        });
      }
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message
      });
    });
});

// getUsers = async (req, res) => {
//   if (req && req.body) {
//     const query = req.body.users;
//     await services.getAllUsers(query).then(users => {
//       res.json({
//         success: true,
//         data: users,
//       });
//     });
//   }
// };

getUserbyId = async (req, res, next) => {
  const id = req.params.id;
  // const users = req.body.users;
  await services
    .getUserById(id)
    .then(user => {
      res.json({
        success: true,
        data: user
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message
      });
    });
};

// users.get("/:id", function(req, res) {
//   User.findById(req.params.id, function(err, user) {
//     if (err) {
//       return res.status(500).json({
//         success: false,
//         message: err.message,
//       });
//     }
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: err.message,
//       });
//     }
//     res.status(200).json({
//       success: true,
//       data: user,
//     });
//   });
// });

users.delete("/", (req, res) => {
  User.remove()
    .then(data => {
      res.json({
        success: true,
        message: " users sucessfully removed."
      });
    })

    .catch(err => {
      res.json({
        success: false,
        message: err.message
      });
    });
});

users.delete("/:id", function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
    res.status(200).json({
      success: true,
      message: "  user  was deleted."
    });
  });
});

users.put(
  "/:id",
  /* VerifyToken, */ function(req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function(
      err,
      user
    ) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      }
      res.status(200).json({
        success: true,
        data: user
      });
    });
  }
);

// users.get("/", getUsers);
users.post("/", addUser);
users.get("/:id", getUserbyId);

module.exports = users;
