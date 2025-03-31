import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import { catchAsync } from "../lib/utils.js";

// get all users
export const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find().select("-password -role");
  res.json(users);
});

export const getUserById = catchAsync(async (req, res) => {
  const userId = req.params.id || req.user.id;
  const user = await User.findById(userId)
    .select("-password -role")
    .populate("connections", "name profileImage")
    .populate("following", "name profileImage")
    .populate("followers", "name profileImage");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

export const updateProfile = catchAsync(async (req, res) => {
  // Validate user exists
  const existingUser = await User.findById(req.user.id);
  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const updates = {
    fullName: req.body.fullName,
    email: req.body.email,
    location: req.body.location,
    about: req.body.about, 
    status: req.body.status,
    birthDate: req.body.birthDate,
    profilePic: req.body.profilePic,
    coverImage: req.body.coverImage,
  };

  // Validate email if being updated
  if (updates.email && updates.email !== existingUser.email) {
    const emailExists = await User.findOne({ email: updates.email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already in use" });
    }
  }

  // Only update fields that are provided and not empty
  Object.keys(updates).forEach(key => {
    if (updates[key] === undefined || updates[key] === '') {
      delete updates[key];
    }
  });

  // Validate there are actual updates
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No valid updates provided" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    ).select("-password -role");

    res.json({
      message: "Profile updated successfully",
      user
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Invalid input data",
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    throw error;
  }
});


export const toggleFollow = catchAsync(async (req, res) => {
  // Prevent following yourself
  if (req.params.id === req.user.id) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  // Find user to follow and validate they exist
  const userToFollow = await User.findById(req.params.id);
  if (!userToFollow) {
    return res.status(404).json({ message: "User not found" });
  }

  const isFollowing = userToFollow.followers.includes(req.user.id);
  const operation = isFollowing ? "$pull" : "$addToSet";

  try {
    // Update both users atomically
    const [currentUser, followedUser] = await Promise.all([
      User.findByIdAndUpdate(
        req.user.id,
        { [operation]: { following: userToFollow._id } },
        { new: true }
      ).select("following"),
      User.findByIdAndUpdate(
        userToFollow._id,
        { [operation]: { followers: req.user.id } },
        { new: true }
      ).select("followers")
    ]);

    // Return updated follow counts and status
    res.json({
      following: !isFollowing,
      followingCount: currentUser.following.length,
      followerCount: followedUser.followers.length,
      message: isFollowing ? "Unfollowed successfully" : "Followed successfully"
    });

  } catch (error) {
    return res.status(500).json({ 
      message: "Error updating follow status",
      error: error.message
    });
  }
});

export const getUserPosts = catchAsync(async (req, res) => {
  const userId = req.params.id || req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";

  // Validate user exists
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Build query
  const query = {
    author: userId,
    ...(search && { 
      $or: [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ]
    })
  };

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
    user: {
      fullName: user.fullName,
      profilePic: user.profilePic,
      postsCount: total
    },
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasMore: page < Math.ceil(total / limit)
    }
  });
});

export const getSavedPosts = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: "savedPosts",
    populate: [
      { path: "author", select: "name profileImage" },
      { path: "likes", select: "name profileImage" },
      { path: "comments.author", select: "name profileImage" },
    ],
  });

  res.json(user.savedPosts);
});
