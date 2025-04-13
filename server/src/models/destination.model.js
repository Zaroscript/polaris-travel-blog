import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: String,
      city: String,
      country: String,
    },
    coverImage: {
      url: String,
      caption: String,
    },
    images: [
      {
        url: String,
        caption: String,
      },
    ],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviews: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 0,
          max: 5,
        },
        content: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tags: [String],
    thingsToDo: [String],
    bestTimeToVisit: {
      from: {
        type: String,
        enum: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
      },
      to: {
        type: String,
        enum: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
destinationSchema.index({ location: "2dsphere" });
destinationSchema.index({ categories: 1 });
destinationSchema.index({ "location.country": 1 });

const Destination = mongoose.model("Destination", destinationSchema);

export default Destination;
