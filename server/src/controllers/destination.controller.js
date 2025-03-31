import Destination from "../models/destination.model.js";
import { catchAsync } from "../lib/utils.js";

export const createDestination = catchAsync(async (req, res) => {
  const destination = await Destination.create({
    ...req.body,
    createdBy: req.user.id,
  });

  await destination.populate("createdBy", "name profileImage");
  await destination.populate("reviews.author", "name profileImage");

  res.status(201).json(destination);
});

export const getDestinations = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { search, category, country, priceRange } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    query.categories = category;
  }

  if (country) {
    query["location.country"] = country;
  }

  if (priceRange) {
    query.priceRange = priceRange;
  }

  const destinations = await Destination.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("createdBy", "name profileImage")
    .populate("reviews.author", "name profileImage");

  const total = await Destination.countDocuments(query);

  res.json({
    destinations,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

export const getDestination = catchAsync(async (req, res) => {
  const destination = await Destination.findById(req.params.id)
    .populate("createdBy", "name profileImage")
    .populate("reviews.author", "name profileImage");

  if (!destination) {
    return res.status(404).json({ message: "Destination not found" });
  }

  res.json(destination);
});

export const updateDestination = catchAsync(async (req, res) => {
  const destination = await Destination.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user.id },
    { $set: req.body },
    { new: true, runValidators: true }
  )
    .populate("createdBy", "name profileImage")
    .populate("reviews.author", "name profileImage");

  if (!destination) {
    return res
      .status(404)
      .json({ message: "Destination not found or unauthorized" });
  }

  res.json(destination);
});

export const deleteDestination = catchAsync(async (req, res) => {
  const destination = await Destination.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user.id,
  });

  if (!destination) {
    return res
      .status(404)
      .json({ message: "Destination not found or unauthorized" });
  }

  res.status(204).end();
});

export const addReview = catchAsync(async (req, res) => {
  const destination = await Destination.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        reviews: {
          ...req.body,
          author: req.user.id,
        },
      },
    },
    { new: true }
  )
    .populate("createdBy", "name profileImage")
    .populate("reviews.author", "name profileImage");

  if (!destination) {
    return res.status(404).json({ message: "Destination not found" });
  }

  // Update average rating
  const totalRating = destination.reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  destination.rating = totalRating / destination.reviews.length;
  await destination.save();

  res.json(destination);
});

export const deleteReview = catchAsync(async (req, res) => {
  const destination = await Destination.findByIdAndUpdate(
    req.params.destinationId,
    {
      $pull: {
        reviews: {
          _id: req.params.reviewId,
          author: req.user.id,
        },
      },
    },
    { new: true }
  )
    .populate("createdBy", "name profileImage")
    .populate("reviews.author", "name profileImage");

  if (!destination) {
    return res.status(404).json({ message: "Destination or review not found" });
  }

  // Update average rating
  const totalRating = destination.reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  destination.rating = destination.reviews.length
    ? totalRating / destination.reviews.length
    : 0;
  await destination.save();

  res.json(destination);
});

export const getNearbyDestinations = catchAsync(async (req, res) => {
  const { longitude, latitude, maxDistance = 10000 } = req.query; // maxDistance in meters

  const destinations = await Destination.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        $maxDistance: parseInt(maxDistance),
      },
    },
  })
    .limit(10)
    .populate("createdBy", "name profileImage")
    .populate("reviews.author", "name profileImage");

  res.json(destinations);
});
