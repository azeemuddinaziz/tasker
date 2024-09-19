import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import TaskModel from "@/model/task";

export async function PUT(request: Request) {
  try {
    const { taskId, newStatus } = await request.json();
    await connectDB();
    await TaskModel.findByIdAndUpdate(taskId, { status: newStatus });
    return NextResponse.json(
      { message: "Task status updated" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating task status" },
      { status: 500 }
    );
  }
}
