import mongoose from "mongoose";

const accountSettingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  privacy: {
    isPrivate: {
      type: Boolean,
      default: false,
    },
    showLocation: {
      type: Boolean, 
      default: true,
    },
    showBirthDate: {
      type: Boolean,
      default: true,
    }
  },
  notifications: {
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    pushNotifications: {
      type: Boolean, 
      default: true,
    },
    marketingEmails: {
      type: Boolean,
      default: false,
    }
  },
  theme: {
    type: String,
    enum: ["light", "dark", "system"],
    default: "system"
  },
  language: {
    type: String,
    default: "en"
  },
  deactivated: {
    type: Boolean,
    default: false
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const AccountSettings = mongoose.model("AccountSettings", accountSettingsSchema);

export default AccountSettings;
