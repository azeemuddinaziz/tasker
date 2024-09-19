import connectDB from "@/lib/connectDB";
import UserModel from "@/model/user.models";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  await connectDB();
  const user = JSON.parse(req.headers.get("x-user-data")!);

  const tasks = await UserModel.findById(user._id)
    .select("tasks")
    .populate("tasks");

  return NextResponse.json({
    messaeg: "Tasks fetched successfully",
    data: tasks,
  });
};
