import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import { catchAsync } from "../lib/utils.js";
import { uploadImage } from "../lib/uploadImage.js"; // Importing the uploadImage function

// get all users
export const getAllUsers = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const skip = (page - 1) * limit;

  const query = search
    ? {
        $or: [
          { fullName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(query)
    .select("-password -role")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(query);

  res.json({
    users,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  });
});

export const getUserById = catchAsync(async (req, res) => {
  const userId = req.params.id || req.user.id;
  const user = await User.findById(userId)
    .select("-password -role")
    .populate("following", "fullName profilePic")
    .populate("followers", "fullName profilePic")
    .populate("savedPosts", "title coverImage");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ user });
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

  // Handle image uploads
  if (req.body.profilePic) {
    updates.profilePic = await uploadImage(req.body.profilePic, { folder: 'polaris-travel/users/profile' });
  }
  if (req.body.coverImage) {
    updates.coverImage = await uploadImage(req.body.coverImage, { folder: 'polaris-travel/users/cover' });
  }

  // Validate email if being updated
  if (updates.email && updates.email !== existingUser.email) {
    const emailExists = await User.findOne({ email: updates.email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already in use" });
    }
  }

  // Only update fields that are provided and not empty
  Object.keys(updates).forEach((key) => {
    if (updates[key] === undefined || updates[key] === "") {
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
        context: "query",
      }
    ).select("-password -role");

    res.json({
      message: "Profile updated successfully",
      user,
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

export const followUser = catchAsync(async (req, res) => {
  // Prevent following yourself
  if (req.params.id === req.user.id) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  // Find user to follow and validate they exist
  const userToFollow = await User.findById(req.params.id);
  if (!userToFollow) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if already following
  const isFollowing = userToFollow.followers.includes(req.user.id);
  if (isFollowing) {
    return res
      .status(400)
      .json({ message: "You are already following this user" });
  }

  try {
    // Update both users atomically
    const [currentUser, followedUser] = await Promise.all([
      User.findByIdAndUpdate(
        req.user.id,
        { $addToSet: { following: userToFollow._id } },
        { new: true }
      ).select("following"),
      User.findByIdAndUpdate(
        userToFollow._id,
        { $addToSet: { followers: req.user.id } },
        { new: true }
      ).select("followers"),
    ]);

    // Return updated follow counts and status
    res.json({
      following: true,
      followingCount: currentUser.following.length,
      followerCount: followedUser.followers.length,
      message: "Followed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error following user",
      error: error.message,
    });
  }
});

export const unfollowUser = catchAsync(async (req, res) => {
  // Prevent unfollowing yourself
  if (req.params.id === req.user.id) {
    return res.status(400).json({ message: "You cannot unfollow yourself" });
  }

  // Find user to unfollow and validate they exist
  const userToUnfollow = await User.findById(req.params.id);
  if (!userToUnfollow) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if not following
  const isFollowing = userToUnfollow.followers.includes(req.user.id);
  if (!isFollowing) {
    return res.status(400).json({ message: "You are not following this user" });
  }

  try {
    // Update both users atomically
    const [currentUser, unfollowedUser] = await Promise.all([
      User.findByIdAndUpdate(
        req.user.id,
        { $pull: { following: userToUnfollow._id } },
        { new: true }
      ).select("following"),
      User.findByIdAndUpdate(
        userToUnfollow._id,
        { $pull: { followers: req.user.id } },
        { new: true }
      ).select("followers"),
    ]);

    // Return updated follow counts and status
    res.json({
      following: false,
      followingCount: currentUser.following.length,
      followerCount: unfollowedUser.followers.length,
      message: "Unfollowed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error unfollowing user",
      error: error.message,
    });
  }
});

export const getUserPosts = catchAsync(async (req, res) => {
  const userId = req.params.id || req.user.id;

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
        { content: { $regex: search, $options: "i" } },
      ],
    }),
  };

  const skip = (page - 1) * limit;

  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
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
      postsCount: total,
    },
    pagination: {
      total,
    },
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
