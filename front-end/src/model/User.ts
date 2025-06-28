import mongoose, { Schema } from "mongoose";
const userSchema = new Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: String,
    isVerified: { type: Boolean, default: false },
    gender: String,
    dateOfBirth: Date,
    address: String,
    phone: String,
    doctorId: String,
    bloodGroup: String,
    height: Number,
    weight: Number,
    profilePicture: String,
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
