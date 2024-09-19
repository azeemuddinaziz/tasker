import User from "@/model/user.models";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const generateAccessAndRefreshTokens = async (
  userId: any
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const user = await User.findById(userId);
    if (!user) throw "User not found.";

    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw NextResponse.json(
      { message: "Failed to generate tokens", error },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const { username, password } = await req.json();
    if (!username) throw "Username is required.";

    const user = await User.findOne({ username });
    if (!user) throw "User not found.";

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    console.log(isPasswordCorrect);
    if (!isPasswordCorrect) throw "Incorrect password.";

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      hhtpOnly: true,
      secure: true,
      sameSite: "None",
    };

    cookies().set("accessToken", accessToken);
    cookies().set("refreshToke", refreshToken);

    return NextResponse.json({
      message: "User logged in successfully.",
      loggedInUser,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to log in user.", error },
      { status: 500 }
    );
  }
};
