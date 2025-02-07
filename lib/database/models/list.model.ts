import mongoose, { Schema, Document, model } from "mongoose";
export interface IList extends Document {
  listName: string;
  userIds: mongoose.Types.ObjectId[];
}

const ListSchema = new Schema<IList>(
  {
    listName: { type: String, required: true, trim: true },
    userIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const List = mongoose.models.List || model<IList>("List", ListSchema);

export default List;
