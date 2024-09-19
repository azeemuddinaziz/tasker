import connectDB from "@/lib/connectDB";
import TaskModel from "@/model/task";
import UserModel from "@/model/user";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();

    const userData = req.headers.get("x-user-data");
    if (!userData) {
      return NextResponse.json(
        { message: "User data is missing" },
        { status: 400 }
      );
    }

    const task = await TaskModel.find({ username: "hello" }); // This is just to make sure that task model is registered - else no use.ň

    const user = JSON.parse(userData);

    const tasks = await UserModel.findById(user._id)
      .select("tasks")
      .populate("tasks");

    if (!tasks) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
};
