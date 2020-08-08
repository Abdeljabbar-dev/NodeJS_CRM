const Activity = require("../../models/Activity");
const User = require("../../models/User");
module.exports = {
  getAllActivities: async objet =>
    Activity.find(objet.req)
      .skip(objet.pagination.offset)
      .limit(objet.pagination.limit)
      .sort({ order: 1 })
      .lean(),
  getAllActivitiesByType: async objet =>
    Activity.find({ type: objet.type })
      .skip(objet.pagination.offset)
      .limit(objet.pagination.limit)
      .sort({ order: 1 })
      .lean(),
  getAvtivityDetails: async id => {
    let _activities = null;
    try {
      let participants = [];
      let usersDetails = [];
      let activities = await Activity.find({ _id: id })
        .select("+salt")
        .lean();
      _activities = await Promise.all(
        activities.map(async activity => {
          // let _activity = Object.assign(activity, { usersDetails });
          let _activity = activity;
          participants = Array.from(activity.participants);
          if (participants.length) {
            let _mbr = participants.map(obj => {
              if (obj && obj.userIdP && obj.userIdP != "") return obj.userIdP;
            });
            _mbr = _mbr.filter(obj => {
              return obj != undefined;
            });
            if (_mbr.length > 0)
              usersDetails = await User.find(
                {
                  _id: {
                    $in: _mbr
                  }
                },
                { first_name: 1, last_name: 1, email: 1 }
              );

            _activity.participants = Array.from(usersDetails);
          }
          delete _activity.usersDetails;
          return _activity;
        })
      );
    } catch (error) {
      _activities = null;
    }

    return _activities;
  },
  addActivityByType: async req => {
    // let query = await Object.assign(req, { type: type });
    if (req && req.name) {
      let activity = await Activity.find({ name: req.name }).count();

      if (activity) {
        console.log("Activity #####  ", activity);
        throw new Error("Activity alerady exist");
      }
    }
    console.log("req ######", req);
    return Activity.create(req);
  },
  updateActivity: async (id, req) => {
    let query = req;
    const portfolio = await Activity.findByIdAndUpdate(id, query, {
      new: true
    }).lean();

    // console.log("After await ", portfolio);
    return portfolio;
  },
  deleteActivity: async id => {
    if (id) return Activity.findByIdAndRemove(id);
  }
};
