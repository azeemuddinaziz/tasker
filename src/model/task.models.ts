import mongoose, { Schema, Document } from "mongoose";

export interface Task extends Document {
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: Date;
}

export const taskSchema: Schema<Task> = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["To Do", "In progress", "Completed"],
    required: true,
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    required: true,
  },
  dueDate: {
    type: Date,
  },
});

const TaskModel =
  (mongoose.models.Task as mongoose.Model<Task>) ||
  mongoose.model<Task>("Task", taskSchema);

export default TaskModel;
