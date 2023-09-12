import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required"],
    },
    displayname: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
    },
    image: {
      type: String,
      required: false,
    },
    projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
  },
  {
    timestamps: true,
  }
);

const User = models.User || model("User", UserSchema);
export default User;
