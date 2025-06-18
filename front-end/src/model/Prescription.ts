import mongoose, { Schema } from "mongoose";

const PrescriptionSchema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
  symptoms: [String],
  diagnosis: String,
  medications: [
    {
      name: String,
      dose: String,
      frequency: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Prescription || mongoose.model("Prescription", PrescriptionSchema);
