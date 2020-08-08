const router = require("express-promise-router")();
const JWT = require("jsonwebtoken");
var User = require("../../models/User");
// const User = require("../../models/User");
var _ = require("lodash");
const { jwt } = require("../../../config/dev");
const { validateBody, schemas } = require("../../middlewares/validateBody");
const passport = require("passport");
const passportSignIn = passport.authenticate("local", { session: false });
const passportJwt = passport.authenticate("jwt", { session: false });
const passportGoogle = passport.authenticate("googleToken", { session: false });

// Fonctions

signToken = user => {
  return JWT.sign(
    {
      iss: jwt.issuer,
      sub: user,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 356)
    },
    jwt.secret
  );
};
signUp = async (req, res, next) => {
  const {
    email,
    password,
    lastName,
    firstName,
    tel,
    gender,
    location
  } = req.value.body;
  try {
    const foundUser = await User.findOne({ "local.email": email });
    if (foundUser) {
      return res
        .status(403)
        .json({ success: false, message: "User already exist" });
    }
    const newUser = new User({
      method: "local",
      local: { email: email, password: password },
      users: { email, lastName, firstName, tel, gender, location }
    });
    await newUser.save();
    const token = signToken(newUser);
    res
      .status(200)
      .json({ success: true, data: { user: newUser.users, token } });
  } catch (error) {
    res.json({ success: false, message: error });
  }
};
signIn = async (req, res, next) => {
  try {
    const token = signToken(req.user);

    res.status(200).json({
      success: true,
      data: { user: req.user.users, token }
    });
  } catch (error) {
    res.json({ success: false, message: error });
  }
};

// google athentification

googleAuth = async (req, res, next) => {
  const token = signToken(req.user);
  res.status(200).json({ token: token });
};
secret = async (req, res, next) => {
  res.json({ data: "ok its done ", user: req.user });
};

//  routes

// Sign Up
router.route("/register").post(validateBody(schemas.UserSchema), signUp);
// Sign In
router
  .route("/login")
  .post(validateBody(schemas.UserSchema), passportSignIn, signIn),
  // Google authentification
  router.route("/google").post(passportGoogle, googleAuth);
// secret
router.route("/secret").get(passportJwt, secret);

module.exports = router;

// users.post("/register", (req, res) => {
//   if (!req.body.password) {
//     res.json({
//       success: false,
//       message: "add password",
//     });
//   } else {
//     const today = new Date();

//     const userData = {
//       first_name: req.body.first_name || "",
//       last_name: req.body.last_name || "",
//       email: req.body.email || "",
//       password: req.body.password || "",
//       created: today || "",
//     };
//     User.findOne({
//       email: req.body.email || "",
//     })
//       .then(user => {
//         if (!user) {
//           bcrypt.hash(req.body.password, 10, (err, hash) => {
//             userData.password = hash;
//             User.create(userData)
//               .then(user => {
//                 res.json({
//                   success: true,
//                   message: user.email + " registered",
//                 });
//               })
//               .catch(err => {
//                 res.json({
//                   success: false,
//                   message: err.message,
//                 });
//                 0;
//               });
//           });
//         } else {
//           res.json({ success: false, message: "User already exists" });
//         }
//       })
//       .catch(err => {
//         res.json({
//           success: false,
//           message: err.message,
//         });
//       });
//   }
// });

// users.post("/login", (req, res) => {
//   User.findOne({
//     email: req.body.email,
//   })
//     .then(user => {
//       if (user) {
//         if (bcrypt.compareSync(req.body.password, user.password)) {
//           const payload = {
//             _id: user._id,
//             first_name: user.first_name,
//             last_name: user.last_name,
//             email: user.email,
//           };
//           let token = jwt.sign(payload, nconf.get("jwt:secret"), {
//             expiresIn: "700000h",
//           });

//           res.json({ success: true, data: user, token });
//         } else {
//           res.json({ success: false, message: " User does not exist" });
//         }
//       } else {
//         res.json({ success: false, message: " User does not exist" });
//       }
//     })
//     .catch(err => {
//       res.json({
//         success: false,
//         message: err.message,
//       });
//     });
// });

// users.get("/profile", (req, res) => {
//   var decoded = jwt.verify(
//     req.headers["x-access-token"],
//     nconf.get("jwt:secret")
//   );
//   User.findOne({
//     _id: decoded._id,
//   })
//     .then(profile => {
//       if (profile) {
//         res.json({ success: true, data: profile });
//       } else {
//         res.json({ success: false, message: "user not exist" });
//       }
//     })
//     .catch(err => {
//       res.json({
//         success: false,
//         message: err.message,
//       });
//     });
// });
// users.put("/profile/:id", function(req, res) {
//   User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function(
//     err,
//     profile
//   ) {
//     if (err) {
//       return res.status(500).json({
//         success: false,
//         message: err.message,
//       });
//     }
//     res.status(200).json({
//       success: true,
//       data: profile,
//     });
//   });
// });
