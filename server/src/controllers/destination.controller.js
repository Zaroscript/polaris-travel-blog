import Destination from "../models/destination.model.js";
import { catchAsync } from "../lib/utils.js";
import { uploadImage, uploadImages } from "../lib/uploadImage.js";

export const createDestination = catchAsync(async (req, res) => {
  // Check if destination with same name and location already exists
  const existingDestination = await Destination.findOne({
    name: req.body.name,
    "location.coordinates": req.body.location.coordinates
  });

  if (existingDestination) {
    return res.status(400).json({ message: "Destination already exists" });
  }

  // Handle image uploads
  const { images, image, ...restBody } = req.body;
  
  // Upload main destination image
  let mainImage = image ? await uploadImage(image, { folder: 'polaris-travel/destinations/main' }) : null;

  // Upload additional destination images
  let uploadedImages = images && images.length > 0 ? await uploadImages(images, { folder: 'polaris-travel/destinations/gallery' }) : [];

  const destination = await Destination.create({
    ...restBody,
    createdBy: req.user.id,
    image: mainImage,
    images: uploadedImages
  });

  await destination.populate("reviews.author", "name profileImage");

  res.status(201).json(destination);
});

export const getDestinations = catchAsync(async (req, res) => {
  const { search, address, city, country, category, region, sort, limit = 10, page = 1 } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { "location.country": { $regex: search, $options: "i" } },
      { "location.city": { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  if (address) {
    query["location.address"] = { $regex: address, $options: "i" };
  }

  if (city) {
    query["location.city"] = { $regex: city, $options: "i" };
  }

  if (country) {
    query["location.country"] = { $regex: country, $options: "i" };
  }

  if (category) {
    query.tags = { $in: [category] };
  }

  if (region) {
    // Map regions to countries or continents
    const regionMapping = {
      'europe': ['France', 'Italy', 'Spain', 'Greece', 'Germany', 'United Kingdom', 'Netherlands', 'Portugal', 'Switzerland'],
      'asia': ['Japan', 'Thailand', 'Vietnam', 'Indonesia', 'India', 'China', 'Singapore', 'Malaysia'],
      'americas': ['USA', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Peru', 'Costa Rica'],
      'africa': ['Morocco', 'Egypt', 'South Africa', 'Kenya', 'Tanzania'],
      'oceania': ['Australia', 'New Zealand', 'Fiji']
    };

    if (regionMapping[region.toLowerCase()]) {
      query["location.country"] = { $in: regionMapping[region.toLowerCase()] };
    }
  }

  // Sorting options
  let sortOption = { createdAt: -1 }; // Default sort
  
  if (sort === 'rating') {
    sortOption = { rating: -1 };
  } else if (sort === 'popularity') {
    sortOption = { views: -1 };
  } else if (sort === 'alphabetical') {
    sortOption = { name: 1 };
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const destinations = await Destination.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(parseInt(limit))
    .populate("reviews.author", "fullName profilePic");

  const total = await Destination.countDocuments(query);

  res.json({
    destinations,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit)
    },
  });
});

export const getDestination = catchAsync(async (req, res) => {
  const destination = await Destination.findById(req.params.id).populate({
    path: 'reviews.author',
    select: 'fullName profilePic'
  });

  if (!destination) {
    return res.status(404).json({ message: "Destination not found" });
  }

  res.json(destination);
});

export const updateDestination = catchAsync(async (req, res) => {
  const { images, image, ...restBody } = req.body;
  const updates = { ...restBody };

  // Handle main image update if provided
  if (image) {
    updates.image = await uploadImage(image, { folder: 'polaris-travel/destinations/main' });
  }

  // Handle additional images update if provided
  if (images) {
    updates.images = await uploadImages(images, { folder: 'polaris-travel/destinations/gallery' });
  }

  const destination = await Destination.findOneAndUpdate(
    { _id: req.params.id },
    { $set: updates },
    { new: true, runValidators: true }
  ).populate("reviews.author", "name profileImage");

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
  });

  if (!destination) {
    return res
      .status(404)
      .json({ message: "Destination not found or unauthorized" });
  }

  res.status(204).json({ message: "Destination deleted successfully" });
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
  ).populate({
    path: 'reviews.author',
    select: 'fullName profilePic'
  });

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

  // Validate required parameters
  if (!longitude || !latitude) {
    return res.status(400).json({
      message: "Both longitude and latitude are required query parameters"
    });
  }

  // Example request:
  // GET /api/destinations/nearby?longitude=-73.935242&latitude=40.730610&maxDistance=5000

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
    .populate("reviews.author", "name profileImage");

  res.json({
    message: "Nearby destinations retrieved successfully",
    count: destinations.length,
    maxDistance: `${maxDistance} meters`,
    origin: {
      longitude: parseFloat(longitude),
      latitude: parseFloat(latitude)
    },
    destinations
  });
});
