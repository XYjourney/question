var mongoose = require('./mongodb');
var schema = mongoose.Schema;

var recordSchema = new schema({
  ip: String,
  name: String,
  interests: [String],
  comments: String,
  other: String,
  name: String,
  createTime: {
    type: Date,
    default: Date.now
  },
  updateTime: {
      type: Date,
      default: Date.now
  }
}, {
  timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
});
module.exports = mongoose.model('records', recordSchema);