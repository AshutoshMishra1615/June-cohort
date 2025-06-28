import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  type: { type: String, enum: ["Consultation", "Meeting", "Operation"] },
  room: { type: String },
});

export const Schedule =
  mongoose.models.Schedule || mongoose.model("Schedule", ScheduleSchema);
