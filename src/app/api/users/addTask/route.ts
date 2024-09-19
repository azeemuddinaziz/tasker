import connectDB from "@/lib/connectDB";
import TaskModel from "@/model/task.models";
import UserModel from "@/model/user.models";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  await connectDB();
  const user = JSON.parse(req.headers.get("x-user-data")!);

  const { title, description, status, priority, dueDate } = await req.json();

  if (!title || !status || !priority) {
    return NextResponse.json(
      { message: "Title, status, and priority are required" },
      { status: 400 }
    );
  }

  try {
    // Create a new task
    const newTask = await TaskModel.create({
      title,
      description,
      status,
      priority,
    });

    // Add the new task to the user's task list
    const newUser = await UserModel.findByIdAndUpdate(
      user._id,
      { $push: { tasks: newTask._id } },
      { new: true }
    ).select("-refreshToken -password");

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to add task" },
      { status: 500 }
    );
  }
};
