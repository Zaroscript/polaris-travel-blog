import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { catchAsync } from "../lib/utils.js";
import { uploadImages } from "../lib/uploadImage.js";

/**
 * @route GET /api/posts
 * @example
 * GET http://localhost:5000/api/posts?page=1&limit=10
 */
export const getPosts = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const query = search ? { content: { $regex: search, $options: "i" } } : {};

  const skip = (page - 1) * limit;

  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("author", "fullName profilePic")
    .populate("likes", "fullName profilePic")
    .populate("comments.author", "fullName profilePic")
    .populate("destination", "name image");

  const total = await Post.countDocuments(query);

  res.json({
    posts,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit
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

  // Handle image uploads
  let uploadedImages = [];
  if (images && images.length > 0) {
    try {
      uploadedImages = await uploadImages(images, {
        folder: 'polaris-travel/posts'
      });
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
