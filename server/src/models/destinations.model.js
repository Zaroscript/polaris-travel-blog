import mongoose from "mongoose";

// Define the schema for the destination model
const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Added to remove whitespace
    },
    description: {
      type: String,
      required: true,
      trim: true, // Added to remove whitespace
    },
    coverImage: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^(http|https):\/\/[^ "]+$/.test(v); // Validate URL format
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    location: {
      type: {
        type: String,
        enum: ["Point"], // 'location.type' must be 'Point' for geospatial queries
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true, // Coordinates are required for the location
        validate: {
          validator: function (v) {
            return v.length === 2; // Ensure coordinates are in [longitude, latitude] format
          },
          message: (props) => `Coordinates must be an array of two numbers!`,
        },
      },
    },
    tags: {
      type: [String],
      default: [], // Default to an empty array if no tags are provided
      validate: {
        validator: function (v) {
          return v.length <= 10; // Limit the number of tags to 10
        },
        message: (props) => `You can only provide up to 10 tags!`,
      },
    },
    rate: {
      type: Number,
      min: 0, // Minimum rating is 0
      max: 5, // Maximum rating is 5
      default: 0, // Default rating is 0
    },
    thingsToDo: {
      type: [String],
      default: [], // Default to an empty array if no things to do are provided
    },
    info: {
      title: {
        type: String,
        required: true, // Title in the info object is required
        trim: true, // Added to remove whitespace
      },
      description: {
        type: String,
        required: true, // Description in the info object is required
        trim: true, // Added to remove whitespace
      },
    },
  },
  { timestamps: true }
);

// Create a geospatial index for the location field to enable efficient queries
destinationSchema.index({ location: "2dsphere" });
// Create the Destination model using the defined schema
const Destination = mongoose.model("Destination", destinationSchema);

// Export the Destination model for use in other parts of the application
export default Destination;
