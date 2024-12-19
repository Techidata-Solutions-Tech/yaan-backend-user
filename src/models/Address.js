import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    addressLine1: {
      type: String,
      required: [true, "Address Line 1 is required"],
      trim: true,
    },
    addressLine2: {
      type: String,
      trim: true,
    },
    houseNumber: {
      type: String,
      required: [true, "House Number is required"],
      trim: true,
    },
    landmark: {
      type: String,
      trim: true,
    },
    userId: { // Add the user ID field
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: [true, 'User ID is required'],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Use the pattern to prevent redefinition of the model
const Address = mongoose.models.Address || mongoose.model('Address', addressSchema);

export default Address;
