const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Post = require('../models/Post');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


// ======================================================
//  ⭐ GET LOGGED-IN USER'S SAVED POSTS  (/me/saved)
// ======================================================
router.get('/me/saved', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'savedPosts',
      populate: { path: 'author', select: 'username profilePic' }
    });

    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, saved: user.savedPosts });
  } catch (err) {
    console.error('Error loading saved posts:', err);
    res.status(500).send('Server error');
  }
});


// ======================================================
//  ⭐ GET LOGGED-IN USER'S LIKED POSTS  (/me/liked)
// ======================================================
router.get('/me/liked', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'likedPosts',
        populate: { path: 'author', select: 'username profilePic' }
      });

    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, liked: user.likedPosts });
  } catch (err) {
    console.error('Error loading liked posts:', err);
    res.status(500).send('Server error');
  }
});


// ======================================================
//  ⭐ FOLLOW / UNFOLLOW A USER
// ======================================================
router.post('/:id/follow', auth, async (req, res) => {
  try {
    if (req.user.id === req.params.id)
      return res.status(400).json({ success: false, message: "Can't follow yourself" });

    const me = await User.findById(req.user.id);
    const other = await User.findById(req.params.id);

    if (!other)
      return res.status(404).json({ success: false, message: 'User not found' });

    const already = me.following.includes(other._id);

    if (already) {
      me.following.pull(other._id);
      other.followers.pull(me._id);
    } else {
      me.following.push(other._id);
      other.followers.push(me._id);
      other.notifications.push({ type: 'follow', fromUser: me._id });
    }

    await me.save();
    await other.save();

    res.json({
      success: true,
      following: !already,
      followersCount: other.followers.length
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// ======================================================
//  ⭐ GET USER NOTIFICATIONS
// ======================================================
router.get('/:id/notifications', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id)
      return res.status(403).json({ success: false });

    const user = await User.findById(req.params.id)
      .populate('notifications.fromUser', 'username profilePic')
      .lean();

    res.json({ success: true, notifications: user.notifications });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// ======================================================
//  ⭐ GET LIKED POSTS OF ANY USER  (/users/:id/liked)
// ======================================================
router.get('/:id/liked', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate({
        path: 'likedPosts',
        populate: { path: 'author', select: 'username profilePic' }
      });

    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, liked: user.likedPosts });
  } catch (err) {
    console.error('Error loading user liked posts:', err);
    res.status(500).send('Server error');
  }
});


// ======================================================
//  ⭐ GET USER PROFILE (WITH POSTS + FOLLOW DATA)
// ======================================================
router.get('/:id', async (req, res) => {
  try {
    let user = await User.findById(req.params.id)
      .select('-passwordHash')
      .lean();

    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 });

    // Attach posts into user object (needed for frontend)
    user.posts = posts;

    res.json({ success: true, user });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// ======================================================
//  ⭐ UPDATE USER PROFILE
// ======================================================
router.put('/:id', auth, upload.single('profilePic'), async (req, res) => {
  try {
    if (req.user.id !== req.params.id)
      return res.status(403).json({ success: false, message: 'Forbidden' });

    const update = {};
    const allowed = ['username', 'bio', 'interests'];

    allowed.forEach((f) => {
      if (req.body[f]) update[f] = req.body[f];
    });

    if (req.file)
      update.profilePic = '/' + req.file.path.replace('\\', '/');

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true
    }).select('-passwordHash');

    res.json({ success: true, user });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


module.exports = router;
