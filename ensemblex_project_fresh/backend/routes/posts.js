const express = require('express');
const router = express.Router();   // ⭐ MUST come before all routes

const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// ======================================================
//  CREATE POST
// ======================================================
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    console.log('\n🧾 [NEW POST UPLOAD]');
    console.log('User from token:', req.user);
    console.log('File received:', req.file ? req.file.filename : '❌ No file');
    console.log('Body:', req.body);

    if (!req.file)
      return res.status(400).json({ success: false, message: 'Image required' });

    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    const imagePath = `/uploads/${req.file.filename}`;

    const post = new Post({
      author: req.user.id,
      imagePath,
      caption: req.body.caption || '',
      hashtags: req.body.hashtags ? req.body.hashtags.split(',').map(s => s.trim()) : [],
      categories: req.body.categories ? req.body.categories.split(',').map(s => s.trim()) : [],
      brandTags: req.body.brandTags ? req.body.brandTags.split(',').map(s => s.trim()) : [],
      colors: req.body.colors ? req.body.colors.split(',').map(s => s.trim()) : [],
    });

    await post.save();

    console.log('✅ Post saved successfully for:', user.username);
    console.log('🖼️  Image path:', imagePath);
    console.log('💬 Caption:', post.caption);

    res.json({ success: true, post });
  } catch (err) {
    console.error('❌ Error saving post:', err);
    res.status(500).send('Server error');
  }
});


// ======================================================
//  LIST POSTS WITH FILTERS
// ======================================================
router.get('/', async (req, res) => {
  try {
    const { search, category, tag, sort, page = 1, limit = 20 } = req.query;
    const q = {};

    if (category) q.categories = category;
    if (tag) q.$or = [{ hashtags: tag }, { brandTags: tag }];

    if (search) {
      q.$or = q.$or || [];
      const s = new RegExp(search, 'i');
      q.$or.push({ caption: s }, { hashtags: s }, { brandTags: s });
    }

    let cursor = Post.find(q)
      .populate('author', 'username profilePic')
      .sort({ createdAt: -1 });

    if (sort === 'top-rated')
      cursor = Post.find(q)
        .sort({ avgRating: -1, createdAt: -1 })
        .populate('author', 'username profilePic');

    if (sort === 'most-commented')
      cursor = Post.find(q)
        .sort({ 'comments.length': -1, createdAt: -1 })
        .populate('author', 'username profilePic');

    const posts = await cursor.skip((page - 1) * limit).limit(parseInt(limit));

    res.json({ success: true, posts });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// ======================================================
//  GET SINGLE POST
// ======================================================
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username profilePic')
      .populate('comments.author', 'username profilePic');

    if (!post)
      return res.status(404).json({ success: false, message: 'Post not found' });

    res.json({ success: true, post });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// ======================================================
//  ⭐ LIKE / UNLIKE POST
// ======================================================
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!post)
      return res.status(404).json({ success: false });

    const userId = user._id;
    const postId = post._id;

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // UNLIKE
      post.likes.pull(userId);
      user.likedPosts.pull(postId);
    } else {
      // LIKE
      post.likes.push(userId);
      user.likedPosts.addToSet(postId);

      // send like notification
      if (post.author) {
        await User.findByIdAndUpdate(post.author, {
          $push: {
            notifications: {
              type: "like",
              fromUser: userId,
              post: postId
            }
          }
        });
      }
    }

    await post.save();
    await user.save();

    res.json({
      success: true,
      liked: !alreadyLiked,
      likes: post.likes.length
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// ======================================================
//  SAVE / UNSAVE POST
// ======================================================
router.post('/:id/save', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const postId = req.params.id;

    const exists = user.savedPosts.includes(postId);

    if (exists) user.savedPosts.pull(postId);
    else user.savedPosts.push(postId);

    await user.save();

    res.json({
      success: true,
      saved: !exists,
      savedCount: user.savedPosts.length
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// ======================================================
//  COMMENT ON POST
// ======================================================
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!post)
      return res.status(404).json({ success: false });

    const comment = { author: user._id, text: req.body.text };
    post.comments.push(comment);

    if (post.author) {
      await User.findByIdAndUpdate(post.author, {
        $push: {
          notifications: {
            type: 'comment',
            fromUser: user._id,
            post: post._id
          }
        }
      });
    }

    await post.save();

    res.json({ success: true, comments: post.comments });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// ======================================================
//  RATE POST
// ======================================================
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const { score } = req.body;

    if (!score || score < 1 || score > 5)
      return res.status(400).json({ success: false, message: 'Score 1-5' });

    const post = await Post.findById(req.params.id);

    const existing = post.ratings.find(
      (r) => String(r.user) === String(req.user.id)
    );

    if (existing) existing.score = score;
    else post.ratings.push({ user: req.user.id, score });

    post.avgRating =
      post.ratings.reduce((s, r) => s + r.score, 0) /
      (post.ratings.length || 1);

    await post.save();

    res.json({ success: true, avgRating: post.avgRating });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


module.exports = router;
