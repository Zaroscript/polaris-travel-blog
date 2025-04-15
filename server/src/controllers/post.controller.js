import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { catchAsync } from "../lib/utils.js";
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * @route GET /api/posts
 * @example
 * GET http://localhost:5000/api/posts?page=1&limit=10&search=travel&sort=popular&category=adventure
 */
export const getPosts = catchAsync(async (req, res) => {
  const { 
    search = "", 
    page = 1, 
    limit = 10, 
    sort = "recent", 
    category = "",
    destination = "",
    author = ""
  } = req.query;

  // Base query
  const query = { isDeleted: false, isPublished: true };

  // Search functionality
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } }
    ];
  }

  // Filter by category (tag)
  if (category) {
    query.tags = { $in: [category] };
  }

  // Filter by destination
  if (destination) {
    query.destination = destination;
  }

  // Filter by author
  if (author) {
    query.author = author;
  }

  // Sorting options
  let sortOption = { createdAt: -1 }; // Default: recent first
  
  if (sort === "popular") {
    sortOption = { views: -1 };
  } else if (sort === "trending") {
    // Trending: combination of recent + popular (posts from the last 7 days with most likes)
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    query.createdAt = { $gte: oneWeekAgo };
    sortOption = { "likes.length": -1, createdAt: -1 };
  } else if (sort === "comments") {
    sortOption = { "comments.length": -1 };
  }

  // Add user-specific filters if authenticated
  if (req.user) {
    // Check if posts are liked or saved by the current user
    const currentUser = await User.findById(req.user.id);
    
    if (req.query.saved === "true" && currentUser) {
      const savedPostIds = currentUser.savedPosts.map(post => post.toString());
      query._id = { $in: savedPostIds };
    }
    
    if (req.query.liked === "true" && currentUser) {
      query.likes = { $in: [req.user.id] };
    }
    
    if (req.query.following === "true" && currentUser) {
      query.author = { $in: currentUser.following.map(follow => follow.toString()) };
    }
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const posts = await Post.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(parseInt(limit))
    .populate("author", "fullName profilePic")
    .populate("likes", "fullName profilePic")
    .populate("comments.author", "fullName profilePic")
    .populate("destination", "name image");

  // For each post, check if the current user has liked/saved it
  let enhancedPosts = posts;
  if (req.user) {
    const user = await User.findById(req.user.id);
    enhancedPosts = posts.map(post => {
      const postObj = post.toObject();
      postObj.isLiked = post.likes.some(like => like._id.toString() === req.user.id);
      postObj.isSaved = user.savedPosts.some(savedPost => savedPost.toString() === post._id.toString());
      return postObj;
    });
  }

  const total = await Post.countDocuments(query);

  res.json({
    posts: enhancedPosts,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit),
      hasMore: skip + posts.length < total
    },
  });
});

/**
 * @route GET /api/posts/:id
 * @example
 * GET http://localhost:5000/api/posts/post_id
 */
export const getPost = catchAsync(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "fullName profilePic")
    .populate("likes", "fullName profilePic")
    .populate("comments.author", "fullName profilePic")
    .populate("destination", "name image");

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  res.json(post);
});

/**
 * @route POST /api/posts
 * @example
 * POST http://localhost:5000/api/posts
 * Headers: {
 *   "Authorization": "Bearer <token>",
 *   "Content-Type": "application/json"
 * }
 * Body: {
 *   "content": "My first post!",
 *   "images": ["url1", "url2"],
 *   "destination": "destination_id"
 * }
 */
export const createPost = catchAsync(async (req, res) => {
  const { content, images } = req.body;
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: "Post content is required" });
  }

  if (content.length > 1000) {
    return res.status(400).json({ message: "Post content cannot exceed 1000 characters" });
  }

  // Handle image uploads with Cloudinary
  let uploadedImages = [];
  if (images && images.length > 0) {
    try {
      const uploadPromises = images.map(image => 
        cloudinary.v2.uploader.upload(image, { folder: 'polaris-travel/posts' })
      );
      uploadedImages = await Promise.all(uploadPromises);
      uploadedImages = uploadedImages.map(file => file.secure_url);
    } catch (error) {
      return res.status(400).json({ message: "Error uploading images" });
    }
  }

  const post = new Post({
    ...req.body,
    author: req.user.id,
    images: uploadedImages
  });

  await post.save();

  await post.populate([
    { path: "author", select: "fullName profilePic" },
    { path: "destination", select: "name image" },
    { path: "likes", select: "fullName profilePic" },
    { path: "comments.author", select: "fullName profilePic" }
  ]);

  await User.findByIdAndUpdate(req.user.id, { $inc: { postsCount: 1 } });

  res.status(201).json({
    message: "Post created successfully",
    post,
  });
});

/**
 * @route PUT /api/posts/:id
 * @example
 * PUT http://localhost:5000/api/posts/post_id
 * Headers: {
 *   "Authorization": "Bearer <token>",
 *   "Content-Type": "application/json"
 * }
 * Body: {
 *   "content": "Updated content",
 *   "images": ["new_url1", "new_url2"]
 * }
 */
export const updatePost = catchAsync(async (req, res) => {
  const existingPost = await Post.findOne({
    _id: req.params.id,
    author: req.user.id
  });

  if (!existingPost) {
    return res.status(404).json({ message: "Post not found or unauthorized" });
  }

  const updates = {
    title: req.body.title,
    content: req.body.content,
    image: req.body.image,
    destination: req.body.destination
  };

  Object.keys(updates).forEach((key) => {
    if (updates[key] === undefined || updates[key] === "") {
      delete updates[key];
    }
  });

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No valid updates provided" });
  }

  const post = await Post.findOneAndUpdate(
    { _id: req.params.id, author: req.user.id },
    { $set: updates },
    {
      new: true,
      runValidators: true
    }
  )
    .populate("author", "fullName profilePic")
    .populate("likes", "fullName profilePic")
    .populate("comments.author", "fullName profilePic")
    .populate("destination", "name image");

  res.json({
    message: "Post updated successfully",
    post,
  });
});

/**
 * @route DELETE /api/posts/:id
 * @example
 * DELETE http://localhost:5000/api/posts/post_id
 * Headers: {
 *   "Authorization": "Bearer <token>"
 * }
 */
export const deletePost = catchAsync(async (req, res) => {
  const post = await Post.findOneAndDelete({
    _id: req.params.id,
    author: req.user.id,
  });

  if (!post) {
    return res.status(404).json({ message: "Post not found or unauthorized" });
  }

  await User.updateMany(
    { savedPosts: req.params.id },
    { $pull: { savedPosts: req.params.id } }
  );

  res.status(204).end();
});

/**
 * @route POST /api/posts/:id/like
 * @example
 * POST http://localhost:5000/api/posts/post_id/like
 * Headers: {
 *   "Authorization": "Bearer <token>"
 * }
 */
export const likePost = catchAsync(async (req, res) => {
  // First check if post exists
  const existingPost = await Post.findById(req.params.id);
  if (!existingPost) {
    return res.status(404).json({ message: "Post not found" });
  }

  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user.id } },
    { new: true }
  )
    .populate("author", "fullName profilePic")
    .populate("likes", "fullName profilePic")
    .populate("comments.author", "fullName profilePic")
    .populate("destination", "name image");

  res.json(post);
});

/**
 * @route DELETE /api/posts/:id/like
 * @example
 * DELETE http://localhost:5000/api/posts/post_id/like
 * Headers: {
 *   "Authorization": "Bearer <token>"
 * }
 */
export const unlikePost = catchAsync(async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user.id } },
    { new: true }
  )
    .populate("author", "fullName profilePic")
    .populate("likes", "fullName profilePic")
    .populate("comments.author", "fullName profilePic")
    .populate("destination", "name image");

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  res.json(post);
});

/**
 * @route POST /api/posts/:id/toggle-save
 * @example
 * POST http://localhost:5000/api/posts/post_id/toggle-save
 * Headers: {
 *   "Authorization": "Bearer <token>"
 * }
 */
export const toggleSavePost = catchAsync(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const user = await User.findById(req.user.id);
  const isSaved = user.savedPosts.includes(req.params.id);

  if (isSaved) {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { savedPosts: req.params.id }
    });
  } else {
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { savedPosts: req.params.id }
    });
  }

  res.json({
    message: isSaved ? "Post unsaved" : "Post saved",
    isSaved: !isSaved
  });
});

/**
 * @route POST /api/posts/:id/comments
 * @example
 * POST http://localhost:5000/api/posts/post_id/comments
 * Headers: {
 *   "Authorization": "Bearer <token>",
 *   "Content-Type": "application/json"
 * }
 * Body: {
 *   "content": "Great post!"
 * }
 */
export const addComment = catchAsync(async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        comments: {
          content: req.body.content,
          author: req.user.id,
        },
      },
    },
    { new: true }
  )
    .populate("author", "fullName profilePic")
    .populate("likes", "fullName profilePic")
    .populate("comments.author", "fullName profilePic")
    .populate("destination", "name image");

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  res.json(post);
});

/**
 * @route POST /api/posts/:id/comments/:commentId/like
 * @example
 * POST http://localhost:5000/api/posts/post_id/comments/comment_id/like
 * Headers: {
 *   "Authorization": "Bearer <token>"
 * }
 */
export const likeComment = catchAsync(async (req, res) => {
  const post = await Post.findOneAndUpdate(
    { 
      _id: req.params.id,
      "comments._id": req.params.commentId
    },
    { 
      $addToSet: { "comments.$.likes": req.user.id }
    },
    { new: true }
  )
    .populate("author", "fullName profilePic")
    .populate("likes", "fullName profilePic")
    .populate("comments.author", "fullName profilePic")
    .populate("destination", "name image");

  if (!post) {
    return res.status(404).json({ message: "Post or comment not found" });
  }

  res.json(post);
});

/**
 * @route DELETE /api/posts/:id/comments/:commentId/like
 * @example
 * DELETE http://localhost:5000/api/posts/post_id/comments/comment_id/like
 * Headers: {
 *   "Authorization": "Bearer <token>"
 * }
 */
export const unlikeComment = catchAsync(async (req, res) => {
  const post = await Post.findOneAndUpdate(
    {
      _id: req.params.id,
      "comments._id": req.params.commentId
    },
    {
      $pull: { "comments.$.likes": req.user.id }
    },
    { new: true }
  )
    .populate("author", "fullName profilePic")
    .populate("likes", "fullName profilePic")
    .populate("comments.author", "fullName profilePic")
    .populate("destination", "name image");

  if (!post) {
    return res.status(404).json({ message: "Post or comment not found" });
  }

  res.json(post);
});

/**
 * @route DELETE /api/posts/:id/comments/:commentId
 * @example
 * DELETE http://localhost:5000/api/posts/post_id/comments/comment_id
 * Headers: {
 *   "Authorization": "Bearer <token>"
 * }
 */
export const deleteComment = catchAsync(async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $pull: {
        comments: {
          _id: req.params.commentId,
          author: req.user.id,
        },
      },
    },
    { new: true }
  )
    .populate("author", "fullName profilePic")
    .populate("likes", "fullName profilePic")
    .populate("comments.author", "fullName profilePic")
    .populate("destination", "name image");

  if (!post) {
    return res.status(404).json({ message: "Post or comment not found" });
  }

  res.json(post);
});

/**
 * @route POST /api/posts/:id/comments/:commentId/replies
 * @example
 * POST http://localhost:5000/api/posts/post_id/comments/comment_id/replies
 * Headers: {
 *   "Authorization": "Bearer <token>",
 *   "Content-Type": "application/json"
 * }
 * Body: {
 *   "content": "Great comment!"
 * }
 */
export const addReply = catchAsync(async (req, res) => {
  const post = await Post.findOneAndUpdate(
    {
      _id: req.params.id,
      "comments._id": req.params.commentId
    },
    {
      $push: {
        "comments.$.replies": {
          content: req.body.content,
          author: req.user.id
        }
      }
    },
    { new: true }
  )
    .populate("author", "fullName profilePic")
    .populate("likes", "fullName profilePic")
    .populate("comments.author", "fullName profilePic")
    .populate("comments.replies.author", "fullName profilePic")
    .populate("destination", "name image");

  if (!post) {
    return res.status(404).json({ message: "Post or comment not found" });
  }

  res.json(post);
});

/**
 * @route POST /api/posts/:id/comments/:commentId/replies/:replyId/like
 * @example
 * POST http://localhost:5000/api/posts/post_id/comments/comment_id/replies/reply_id/like
 * Headers: {
 *   "Authorization": "Bearer <token>"
 * }
 */
export const likeReply = catchAsync(async (req, res) => {
  const post = await Post.findOneAndUpdate(
    {
      _id: req.params.id,
      "comments._id": req.params.commentId,
      "comments.replies._id": req.params.replyId
    },
    {
      $addToSet: { "comments.$[comment].replies.$[reply].likes": req.user.id }
    },
    {
      arrayFilters: [
        { "comment._id": req.params.commentId },
        { "reply._id": req.params.replyId }
      ],
      new: true
    }
  )
    .populate("author", "fullName profilePic")
    .populate("likes", "fullName profilePic")
    .populate("comments.author", "fullName profilePic")
    .populate("comments.replies.author", "fullName profilePic")
    .populate("destination", "name image");

  if (!post) {
    return res.status(404).json({ message: "Post, comment or reply not found" });
  }

  res.json(post);
});

/**
 * @route DELETE /api/posts/:id/comments/:commentId/replies/:replyId/like
 * @example
 * DELETE http://localhost:5000/api/posts/post_id/comments/comment_id/replies/reply_id/like
 * Headers: {
 *   "Authorization": "Bearer <token>"
 * }
 */
export const unlikeReply = catchAsync(async (req, res) => {
  const post = await Post.findOneAndUpdate(
    {
      _id: req.params.id,
      "comments._id": req.params.commentId,
      "comments.replies._id": req.params.replyId
    },
    {
      $pull: { "comments.$[comment].replies.$[reply].likes": req.user.id }
    },
    {
      arrayFilters: [
        { "comment._id": req.params.commentId },
        { "reply._id": req.params.replyId }
      ],
      new: true
    }
  )
    .populate("author", "fullName profilePic")
    .populate("likes", "fullName profilePic")
    .populate("comments.author", "fullName profilePic")
    .populate("comments.replies.author", "fullName profilePic")
    .populate("destination", "name image");

  if (!post) {
    return res.status(404).json({ message: "Post, comment or reply not found" });
  }

  res.json(post);
});

/**
 * @route DELETE /api/posts/:id/comments/:commentId/replies/:replyId
 * @example
 * DELETE http://localhost:5000/api/posts/post_id/comments/comment_id/replies/reply_id
 * Headers: {
 *   "Authorization": "Bearer <token>"
 * }
 */
export const deleteReply = catchAsync(async (req, res) => {
  const post = await Post.findOneAndUpdate(
    {
      _id: req.params.id,
      "comments._id": req.params.commentId
    },
    {
      $pull: {
        "comments.$.replies": {
          _id: req.params.replyId,
          author: req.user.id
        }
      }
    },
    { new: true }
  )
    .populate("author", "fullName profilePic")
    .populate("likes", "fullName profilePic")
    .populate("comments.author", "fullName profilePic")
    .populate("comments.replies.author", "fullName profilePic")
    .populate("destination", "name image");

  if (!post) {
    return res.status(404).json({ message: "Post, comment or reply not found" });
  }

  res.json(post);
});

/**
 * @route GET /api/posts/user/:userId
 * @description Get all posts by a specific user
 * @example
 * GET http://localhost:5000/api/posts/user/user_id
 */
export const getUserPosts = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  
  const posts = await Post.find({ author: userId })
    .sort({ createdAt: -1 })
    .populate("author", "fullName profilePic")
    .populate("likes", "fullName profilePic")
    .populate("comments.author", "fullName profilePic")
    .populate("destination", "name image");

  res.json({
    posts,
    message: "Posts retrieved successfully"
  });
});

/**
 * @route GET /api/posts/photos/:userId
 * @description Get all photo posts by a specific user
 * @example
 * GET http://localhost:5000/api/posts/photos/user_id
 */
export const getUserPhotos = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  
  const posts = await Post.find({ 
    author: userId,
    images: { $exists: true, $ne: [] } // Only posts with images
  })
    .sort({ createdAt: -1 })
    .populate("author", "fullName profilePic")
    .populate("likes", "fullName profilePic")
    .populate("destination", "name image");

  // Extract just the images from the posts
  const photos = posts.flatMap(post => 
    post.images.map(image => ({
      _id: post._id,
      image,
      createdAt: post.createdAt
    }))
  );

  res.json({
    photos,
    message: "Photos retrieved successfully"
  });
});

/**
 * @route GET /api/posts/liked/:userId
 * @description Get all posts liked by a specific user
 * @example
 * GET http://localhost:5000/api/posts/liked/user_id
 */
export const getLikedPosts = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  
  const posts = await Post.find({ 
    likes: userId 
  })
    .sort({ createdAt: -1 })
    .populate("author", "fullName profilePic")
    .populate("likes", "fullName profilePic")
    .populate("comments.author", "fullName profilePic")
    .populate("destination", "name image");

  res.json({
    posts,
    message: "Liked posts retrieved successfully"
  });
});

/**
 * @route GET /api/posts/saved/:userId
 * @description Get all posts saved by a specific user
 * @example
 * GET http://localhost:5000/api/posts/saved/user_id
 */
export const getSavedPosts = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  
  // Find the user and get the saved posts from the user's savedPosts array
  const user = await User.findById(userId).populate({
    path: "savedPosts",
    populate: [
      { path: "author", select: "fullName profilePic" },
      { path: "likes", select: "fullName profilePic" },
      { path: "comments.author", select: "fullName profilePic" },
      { path: "destination", select: "name image" }
    ]
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    posts: user.savedPosts || [],
    message: "Saved posts retrieved successfully"
  });
});

/**
 * @route GET /api/posts/popular
 * @example
 * GET http://localhost:5000/api/posts/popular?limit=5
 */
export const getPopularPosts = catchAsync(async (req, res) => {
  const { limit = 5 } = req.query;
  
  const posts = await Post.find({ isDeleted: false, isPublished: true })
    .sort({ views: -1 })
    .limit(parseInt(limit))
    .populate("author", "fullName profilePic")
    .populate("likes", "fullName profilePic")
    .populate("comments.author", "fullName profilePic")
    .populate("destination", "name image");

  // For each post, check if the current user has liked/saved it
  let enhancedPosts = posts;
  if (req.user) {
    const user = await User.findById(req.user.id);
    enhancedPosts = posts.map(post => {
      const postObj = post.toObject();
      postObj.isLiked = post.likes.some(like => like._id.toString() === req.user.id);
      postObj.isSaved = user.savedPosts.some(savedPost => savedPost.toString() === post._id.toString());
      return postObj;
    });
  }

  res.json({
    posts: enhancedPosts
  });
});

/**
 * @route GET /api/posts/following
 * @example
 * GET http://localhost:5000/api/posts/following?page=1&limit=10
 */
export const getFollowingPosts = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  
  const followingIds = user.following.map(follow => follow.toString());
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const posts = await Post.find({ 
    author: { $in: followingIds },
    isDeleted: false, 
    isPublished: true 
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate("author", "fullName profilePic")
    .populate("likes", "fullName profilePic")
    .populate("comments.author", "fullName profilePic")
    .populate("destination", "name image");

  // Enhance posts with user-specific data
  const enhancedPosts = posts.map(post => {
    const postObj = post.toObject();
    postObj.isLiked = post.likes.some(like => like._id.toString() === req.user.id);
    postObj.isSaved = user.savedPosts.some(savedPost => savedPost.toString() === post._id.toString());
    return postObj;
  });

  const total = await Post.countDocuments({ 
    author: { $in: followingIds },
    isDeleted: false, 
    isPublished: true 
  });

  res.json({
    posts: enhancedPosts,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit),
      hasMore: skip + posts.length < total
    },
  });
});
