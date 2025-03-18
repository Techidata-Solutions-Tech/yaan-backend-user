import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null,
    },
    dob: {
      type: Date,
      default: null,
    },
    isDeleted:{
      type: Boolean,
      default: false,
    },
    isBlocked:{
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      default: null,
    },

    temp_email: {
      type: String,
      default: null,
    },
    temp_phone: {
      type: String,
      default: null,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      default: null,
    },
    phone_verified: {
      type: Boolean,
      default: false,
    },
    emergency_phone: {
      type: String,
      default: null,
    },
    otp_email: {
      type: String,
      default: null,
    },
    otp_email_expiry: {
      type: Date,
      default: null,
    },
    otp_phone: {
      type: String,
      default: null,
    },
    otp_phone_expiry: {
      type: Date,
      default: null,
    },
    otp_login: {
      type: String,
      default: null,
    },
    otp_login_expiry: {
      type: Date,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    notification: {
      message: [
        {
          isRead: { type: Boolean, default: false }, // Tracks if the message is read
          message: { type: String, required: true }, // The message content
          created_at: {
            type: Date,
           default: Date.now()
          },
        },
      ],
      wallet: [
        {
          isRead: { type: Boolean, default: false }, // Tracks if the wallet notification is read
          wallet: { type: String, required: true }, // The wallet notification content
          created_at: {
            type: Date,
           default: Date.now()
          },
        },
       
      ],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, { expiresIn: '24h' });
  return token;
}
// Export the User model
export default mongoose.models.User || mongoose.model('User', userSchema);

