import { Schema, model, models } from "mongoose";
import { CommentSchema } from "./comment";

export const TodoSchema = new Schema(
  {
    title: {
      type: String,
      unique: false,
      required: [true, "Todos must have a title"],
    },
    content: {
      type: String,
      required: false,
    },
    deadline: {
      type: Date,
      required: false,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    onIt: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: {
      type: [{ type: CommentSchema }],
      required: false,
    },
  },
  {
    autoCreate: false,
    autoIndex: false,
    timestamps: true,
  }
);

export const Todo = models.Todo || model("Todo", TodoSchema);
