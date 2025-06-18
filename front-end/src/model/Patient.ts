import mongoose, { Schema } from "mongoose";

const PatientSchema = new Schema({
  name: String,
  age: Number,
  gender: String,
  diagnosis: String,
  history: String,
  allergies: [String],
  doctor : {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
},{timestamps:true});

export default mongoose.models.Patient || mongoose.model("Patient", PatientSchema);
