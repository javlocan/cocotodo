import { Schema, model, models } from "mongoose";
import { TodoSchema } from "./todo";

const ProjectSchema = new Schema(
  {
    name: {
      type: String,
      unique: false,
      required: [true, "Project name is required"],
    },
    description: {
      type: String,
      required: false,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User" || "Group",
      required: true,
    },
    todos: {
      type: [
        {
          type: TodoSchema,
        },
      ],
      required: true,
    },
    participants: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      required: true,
    },
    settings: {
      image: {
        type: String,
        required: false,
      },
      color: {
        type: String,
        required: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Project = models.Project || model("Project", ProjectSchema);
export default Project;
