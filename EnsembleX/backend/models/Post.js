const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const RatingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  score: Number
});

const PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  imagePath: { type: String, required: true },
  caption: { type: String },
  hashtags: [String],
  categories: [String],
  brandTags: [String],
  colors: [String],
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  ratings: [RatingSchema],
  avgRating: { type: Number, default: 0 },
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

module.exports = mongoose.model('Post', PostSchema);
