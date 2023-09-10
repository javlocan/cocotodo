import { Schema, model, models } from "mongoose";

const GroupSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "Group name is required"],
    },
    description: {
      type: String,
      required: false,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      required: true,
    },
    projects: { type: [{ type: Schema.Types.ObjectId, ref: "Project" }] },
    settings: {
      password: {
        type: String,
        required: false,
        select: false,
      },
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

const Group = models.Group || model("Group", GroupSchema);
export default Group;
