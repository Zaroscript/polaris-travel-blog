import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",
      fullName: {
        type: String,
      },
      profilePic: {
        type: String,
      },
      required: true,
    },
    gallery: [
      {
        type: String,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        content: {
          type: String,
          required: true,
        },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          fullName: {
            type: String,
          },
          profilePic: {
            type: String,
          },
          required: true,
        },
        likes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },

        replies: [
          {
            content: {
              type: String,
            },
            author: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              required: true,
              fullName: {
                type: String,
              },
              profilePic: {
                type: String,
              },
            },
            createdAt: {
              type: Date,
              default: Date.now,
            },
            likes: [
              {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
              },
            ],
          },
        ],
      },
    ],
    tags: [String],
    isPublished: {
      type: Boolean,
      default: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
    },
    shares: {
      type: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            fullName: {
              type: String,
            },
            profilePic: {
              type: String,
            },
          },
        },
      ],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    isSaved: {
      type: Boolean,
      default: false,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isShared: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ tags: 1 });

const Post = mongoose.model("Post", postSchema);

export default Post;
