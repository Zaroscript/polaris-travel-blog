import bcrypt from "bcryptjs";
import Account from "../models/account.model.js";

// Update profile information
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, bio, location, website } = req.body;

    // Validate inputs
    if (name && (name.length < 2 || name.length > 50)) {
      return res.status(400).json({ error: "Name must be between 2 and 50 characters" });
    }
    if (bio && bio.length > 500) {
      return res.status(400).json({ error: "Bio cannot exceed 500 characters" });
    }
    if (location && location.length > 100) {
      return res.status(400).json({ error: "Location cannot exceed 100 characters" });
    }
    if (website) {
      try {
        new URL(website);
      } catch (err) {
        return res.status(400).json({ error: "Invalid website URL" });
      }
    }

    const updatedAccount = await Account.findByIdAndUpdate(
      userId,
      { name, bio, location, website },
      { new: true }
    ).select("id name email bio location website profileImage");

    res.json(updatedAccount);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// Update password
const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Validate inputs
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Both current and new password are required" });
    }
    if (currentPassword.length < 6 || newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const account = await Account.findById(userId).select("+password");

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      account.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    account.password = hashedPassword;
    await account.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update password" });
  }
};

// Update email
const updateEmail = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const account = await Account.findById(userId).select("+password");

    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Password is incorrect" });
    }

    account.email = email;
    await account.save();

    res.json({
      id: account.id,
      email: account.email,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update email" });
  }
};

// Update privacy settings
const updatePrivacy = async (req, res) => {
  try {
    const userId = req.user.id;
    const { isPrivate } = req.body;

    // Validate input
    if (typeof isPrivate !== 'boolean') {
      return res.status(400).json({ error: "isPrivate must be a boolean" });
    }

    const updatedAccount = await Account.findByIdAndUpdate(
      userId,
      { isPrivate },
      { new: true }
    ).select("id isPrivate");

    res.json(updatedAccount);
  } catch (error) {
    res.status(500).json({ error: "Failed to update privacy settings" });
  }
};

// Update notification preferences
const updateNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { emailNotifications, pushNotifications, marketingEmails } = req.body;

    // Validate inputs
    if (typeof emailNotifications !== 'boolean' || 
        typeof pushNotifications !== 'boolean' || 
        typeof marketingEmails !== 'boolean') {
      return res.status(400).json({ error: "All notification settings must be boolean values" });
    }

    const updatedAccount = await Account.findByIdAndUpdate(
      userId,
      { emailNotifications, pushNotifications, marketingEmails },
      { new: true }
    ).select("id emailNotifications pushNotifications marketingEmails");

    res.json(updatedAccount);
  } catch (error) {
    res.status(500).json({ error: "Failed to update notification settings" });
  }
};

// Delete account
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const account = await Account.findById(userId).select("+password");

    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Password is incorrect" });
    }

    await Account.findByIdAndDelete(userId);

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete account" });
  }
};

export {
  updateProfile,
  updatePassword,
  updateEmail,
  updatePrivacy,
  updateNotifications,
  deleteAccount,
};
