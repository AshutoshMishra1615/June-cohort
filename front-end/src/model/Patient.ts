import mongoose, { Schema } from "mongoose";

const PatientSchema = new Schema({
  name: String,
  age: Number,
  gender: String,
  diagnosis: String,
  history: String,
  allergies: [String],
});

export default mongoose.models.Patient || mongoose.model("Patient", PatientSchema);
