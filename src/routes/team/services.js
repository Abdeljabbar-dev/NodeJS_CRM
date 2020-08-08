const Team = require("../../models/Team");
// const User = require("../../models/User");

module.exports = {
  getAllTeamsByType: async objet => {
    return Team.find(
      { type: objet.type },
      {
        name: 1,
        logo: 1,
        problem: 1,
        solution: 1,
        website: 1,
        slogan: 1,
        problem: 1,
        industryId: 1,
        valueProp: 1,
        solution: 1,
        address: 1,
        country: 1,
        city: 1,
        published: 1,
        members: 1,
        stage: 1,
        tag: 1,
        order: 1,
        video: 1,
        created_at: 1,
        updated_at: 1
      }
    )
      .skip(objet.pagination.offset)
      .limit(objet.pagination.limit)
      .sort({ order: 1 })
      .lean();
  },

  findOneTeam: async id => {
    return await Team.findById(id).lean();
  },
  addTeamByType: async (type, req) => {
    let query = await Object.assign(req, { type: type });
    if (query && query.name) {
      let team = await Team.find({ name: query.name }).count();

      if (team) {
        throw new Error("Team alerady exist");
      }
    }

    return Team.create(query);
  },
  updateTeam: async (id, req, type) => {
    // query = await Object.assign(req, { type: type });
    let query = req;

    const startup = await Team.findByIdAndUpdate(id, query, {
      new: true
    }).lean();

    return startup;
  },
  deleteTeam: async id => {
    if (id) return Team.findByIdAndRemove(id);
  }
};
