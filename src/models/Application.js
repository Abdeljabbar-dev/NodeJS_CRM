const mongoose = require('mongoose')
const Application = new mongoose.Schema(
  {
    User: { type: String, default: '' },
    status: { type: String, default: '' },
    dataa: { type: JSON, trim: true }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

module.exports = mongoose.model('Application', Application)
