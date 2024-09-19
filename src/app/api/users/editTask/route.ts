import { NextResponse } from "next/server";
import TaskModel from "@/model/task.models";
import connectDB from "@/lib/connectDB";

export async function PUT(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("taskId");

  if (!taskId) {
    return NextResponse.json(
      { message: "Task ID is required" },
      { status: 400 }
    );
  }

  const { title, description, status, priority, dueDate } = await req.json();

  // Check if at least one field is provided
  if (!title && !description && !status && !priority && !dueDate) {
    return NextResponse.json(
      { message: "At least one field must be provided to update" },
      { status: 400 }
    );
  }

  try {
    const updatedTask = await TaskModel.findByIdAndUpdate(
      taskId,
      {
        $set: {
          title,
          description,
          status,
          priority,
          dueDate: dueDate ? new Date(dueDate) : undefined,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { message: "Failed to update task" },
      { status: 500 }
    );
  }
}
