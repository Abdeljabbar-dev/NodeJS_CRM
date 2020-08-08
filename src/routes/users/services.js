const User = require("../../models/User");
module.exports = {
  getAllUsers: async req =>
    User.find(req, {
      firstName: 1,
      lastName: 1,
      email: 1,
      tel: 1,
      gender: 1,
      location: 1
    }).lean(),

  getUserById: async id =>
    User.find(
      { _id: id },
      {
        firstName: 1,
        lastName: 1,
        email: 1,
        tel: 1,
        gender: 1,
        location: 1
      }
    ).lean()
};
