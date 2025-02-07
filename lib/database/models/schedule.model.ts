import mongoose, { Schema, Document, model } from "mongoose";

export interface ISchedule extends Document {
  emailId: string;
  subject: string;
  message: string;
  sendDate: Date;
  selectedLists: mongoose.Types.ObjectId[]; // Array of list IDs
  createdAt: Date;
  updatedAt: Date;
}

const ScheduleSchema: Schema = new Schema(
  {
    emailId: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    sendDate: { type: Date, required: true },
    selectedLists: [{ type: mongoose.Schema.Types.ObjectId, ref: "List" }],
  },
  { timestamps: true }
);
const Schedule = mongoose.models.Schedule || model<ISchedule>("Schedule", ScheduleSchema); 
export default Schedule;
