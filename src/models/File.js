const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: String,
  originalName: String,
  size: Number,
  storageKey: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('File', fileSchema);
