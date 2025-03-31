import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { catchAsync } from "../lib/utils.js";

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
  // Validate required fields
  const { content } = req.body;
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: "Post content is required" });
  }

  // Create post with validated data
  const post = new Post({
    ...req.body,
    author: req.user.id,
  });

  // Save post to database
  await post.save();

  // Populate post with related data
  await post.populate([
    { path: "author", select: "fullName profilePic" },
    { path: "destination", select: "name image" },
    { path: "likes", select: "fullName profilePic" },
    { path: "comments.author", select: "fullName profilePic" }
  ]);

  // Update user's post count
  await User.findByIdAndUpdate(
    req.user.id,
    { $inc: { postsCount: 1 } }
  );

  res.status(201).json({
    message: "Post created successfully", 
    post,
  });
});

/**
 * @route GET /api/posts
 * @example
 * GET http://localhost:5000/api/posts?page=1&limit=10
 * Headers: {
 *   "Authorization": "Bearer <token>"
 * }
 */
export const getPosts = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";

  const query = search ? { content: { $regex: search, $options: "i" } } : {};

  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("author", "fullName profilePic")
    .populate("likes", "fullName profilePic")
    .populate("comments.author", "fullName profilePic")
    .populate("destination", "name image");

  const total = await Post.countDocuments(query);

  res.json({
    posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * @route GET /api/posts/:id
 * @example
 * GET http://localhost:5000/api/posts/post_id
 * Headers: {
 *   "Authorization": "Bearer <token>"
 * }
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
 * @route PATCH /api/posts/:id
 * @example
 * PATCH http://localhost:5000/api/posts/post_id
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
  // First check if post exists and user is authorized
  const existingPost = await Post.findOne({
    _id: req.params.id,
  });

  if (!existingPost) {
    return res.status(404).json({ message: "Post not found or unauthorized" });
  }

  // Validate update data
  const updates = {
    title: req.body.title,
    content: req.body.content,
    image: req.body.image,
    destination: req.body.destination,
    likes: req.body.likes,
    comments: req.body.comments,
  };

  // Remove undefined/empty fields
  Object.keys(updates).forEach((key) => {
    if (updates[key] === undefined || updates[key] === "") {
      delete updates[key];
    }
  });

  // Check if there are any valid updates
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No valid updates provided" });
  }

  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updates },
      {
        new: true,
        runValidators: true,
        context: "query",
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
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid input data",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }
    throw error;
  }
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

  // Remove post from all users' savedPosts
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
export const toggleLike = catchAsync(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const isLiked = post.likes.includes(req.user.id);
  const operation = isLiked ? "$pull" : "$addToSet";

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    { [operation]: { likes: req.user.id } },
    { new: true }
  )
    .populate("author", "fullName profilePic")
    .populate("likes", "fullName profilePic")
    .populate("comments.author", "fullName profilePic")
    .populate("destination", "name image");

  res.json({
    post: updatedPost,
    liked: !isLiked,
    likesCount: updatedPost.likes.length,
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
 * @route DELETE /api/posts/:postId/comments/:commentId
 * @example
 * DELETE http://localhost:5000/api/posts/post_id/comments/comment_id
 * Headers: {
 *   "Authorization": "Bearer <token>"
 * }
 */
export const deleteComment = catchAsync(async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.postId,
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
 * @route POST /api/posts/:id/save
 * @example
 * POST http://localhost:5000/api/posts/post_id/save
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
  const operation = isSaved ? "$pull" : "$addToSet";

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { [operation]: { savedPosts: req.params.id } },
    { new: true }
  );

  res.json({
    saved: !isSaved,
    savedPostsCount: updatedUser.savedPosts.length,
  });
});
