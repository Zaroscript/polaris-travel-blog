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
  const { search, address, city, country } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (address) {
    query["location.address"] = { $regex: address, $options: "i" };
  }

  if (city) {
    query["location.city"] = { $regex: city, $options: "i" };
  }

  if (country) {
    query["location.country"] = country;
  }

  const destinations = await Destination.find(query)
    .sort({ createdAt: -1 })
    .populate("reviews.author", "name profileImage");

  const total = await Destination.countDocuments(query);

  res.json({
    destinations,
    pagination: {
      total,
    },
  });
});

export const getDestination = catchAsync(async (req, res) => {
  const destination = await Destination.findById(req.params.id).populate(
    "reviews.author",
    "name profileImage"
  );

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
  ).populate("reviews.author", "name profileImage");

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
