const mongoose = require("mongoose");

//const typeActivity =['session', 'program', 'event']
//SCHEMA Activity//
const ActivitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
      required: true,
      // unique: true
      uppercase: true
    },
    title: String,
    summary: String,
    short_desc: String,
    slogon: String,
    cover: { trim: true, type: String, defaultValue: "" },
    cover2: { trim: true, type: String, defaultValue: "" },
    numbers: {
      type: [],
      defaultValue: [
        {
          _id: "g3nioxb",
          title: "APPLICATIONS",
          number: "",
          icon: "icon-et-documents"
        },
        {
          _id: "y9sk3ce",
          number: "",
          title: "PARTICIPANTS",
          icon: "icon-ion-ios-contact"
        },
        {
          _id: "988pywb",
          number: "",
          title: "NATIONALITIES",
          icon: "icon-et-flag"
        },
        {
          _id: "ogsberi",
          number: "",
          title: "PITCHED IDEAS",
          icon: "icon-basic_lightbulb"
        },
        {
          _id: "v4n0ph2",
          number: "",
          title: "SELECTED TEAMS",
          icon: "icon-ion-ios-people"
        },
        {
          _id: "xmw4ff7",
          number: "",
          title: "WINNING PROJECTS",
          icon: "icon-ion-ios-rocket"
        }
      ]
    },
    type: String,
    client: String,
    tags: [],
    order: Number,
    location: String,
    date: String,
    bestOf: String,
    start_date: String,
    end_date: String,
    media: [],
    guests: [
      {
        userIdG: String,
        roleIdG: String
      }
    ],
    parentActivityId: { trim: true, type: String, defaultValue: "" },
    sponsors: [
      {
        collaboratorId: String,
        infos: { required: true, trim: true, type: String }
      }
    ],

    participants: [
      {
        userIdP: String,
        roleIdP: String
      }
    ],

    testimonials: [],
    childActivities: [
      {
        activityId: String
      }
    ],

    processes: [
      {
        processId: String
      }
    ],
    published: { type: Boolean, default: false },
    lang: { type: String, default: "EN" }
  },

  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

//EXPORT MODEL
module.exports = mongoose.model("Activity", ActivitySchema);
