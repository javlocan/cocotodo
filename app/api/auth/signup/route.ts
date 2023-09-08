import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    await connectDB();
    const res = await req.json();
    const { username, email, password, passwordrepeat } = res;
    //const { username, email, password } = await request.json();
    console.log("Signup route: ", username);

    if (password.length < 6)
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    if (password !== passwordrepeat)
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 }
      );

    const emailFound = await User.findOne({ email });
    const userFound = await User.findOne({ username });

    if (userFound)
      return NextResponse.json(
        {
          message: "Username already exists",
        },
        {
          status: 409,
        }
      );
    if (emailFound)
      return NextResponse.json(
        {
          message: "Email already exists",
        },
        {
          status: 409,
        }
      );

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    console.log(savedUser);

    return NextResponse.json(
      {
        username,
        email,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }
    return NextResponse.error();
  }
}
