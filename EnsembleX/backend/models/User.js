const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  type: String, // like/comment/follow
  fromUser: { type: Schema.Types.ObjectId, ref: 'User' },
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  profilePic: { type: String, default: '/uploads/default-avatar.png' },
  bio: { type: String, default: '' },
  interests: [String],
  
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  
  savedPosts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],

  // ⭐ ADDED: liked posts
  likedPosts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],

  notifications: [NotificationSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
