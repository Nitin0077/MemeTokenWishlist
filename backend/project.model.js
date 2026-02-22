const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  id:           { type: String, required: true, unique: true },
  project:      { type: String, default: '' },
  handle:       { type: String, default: '' },
  ca:           { type: String, default: '' },
  chain:        { type: String, default: '' },
  category:     { type: String, default: '' },
  narrativeTag: { type: String, default: '' },
  useCase:      { type: String, default: '' },
  marketCap:    { type: String, default: '' },
  rating:       { type: String, default: '' },
  riskLevel:    { type: String, default: 'Low' },
  returnValue:  { type: Number, default: null },
  createdAt:    { type: String, default: () => new Date().toISOString() }
}, {
  versionKey: false // removes __v field
});

module.exports = mongoose.model('Project', projectSchema);