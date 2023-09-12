import { Schema, model, models } from "mongoose";

export const ReplySchema = new Schema(
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
  },
  {
    autoCreate: false,
    autoIndex: false,
    timestamps: true,
  }
);

export const Reply = models.Reply || model("Reply", ReplySchema);
