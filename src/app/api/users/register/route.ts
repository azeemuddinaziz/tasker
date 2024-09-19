import connectDB from "@/lib/connectDB";
import User from "@/model/user.models";
import { NextRequest, NextResponse } from "next/server";

type UserData = {
  username: string;
  email: string;
  password: string;
};

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const { username, password, email }: UserData = await req.json();

    if (!username) throw "Username is required.";
    if (!password) throw "Password is required.";
    if (!email) throw "Mail Id is required.";

    const usernameExists = await User.findOne({ username });
    if (usernameExists) throw "Username already in use.";

    const emailExists = await User.findOne({ email });
    if (emailExists) throw "Email already in use.";

    const user = await User.create({
      username,
      email,
      password,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!createdUser) throw 500;

    return NextResponse.json({
      message: "User created successfully.",
      data: createdUser,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create user.", error },
      { status: 500 }
    );
  }
};
