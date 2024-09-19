import { NextResponse } from "next/server";
import TaskModel from "@/model/task";
import UserModel from "@/model/user";
import connectDB from "@/lib/connectDB";

export async function DELETE(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("taskId");

  if (!taskId) {
    return NextResponse.json(
      { message: "Task ID is required" },
      { status: 400 }
    );
  }

  try {
    const result = await TaskModel.findByIdAndDelete(taskId);

    if (!result) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    await UserModel.updateMany({ tasks: taskId }, { $pull: { tasks: taskId } });

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { message: "Failed to delete task" },
      { status: 500 }
    );
  }
}
