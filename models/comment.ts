import { Schema, model, models } from "mongoose";
import { ReplySchema } from "./reply";

export const CommentSchema = new Schema(
  {
    content: {
      type: String,
      unique: true,
      required: [true, "Comment is empty"],
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    replies: {
      type: [{ type: ReplySchema }],
      required: false,
    },
  },
  {
    autoCreate: false,
    autoIndex: false,
    timestamps: true,
  }
);

export const Comment = models.Comment || model("Comment", CommentSchema);
