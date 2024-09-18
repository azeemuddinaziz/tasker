import mongoose, { Schema, Document } from "mongoose";

export interface Task extends Document {
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: Date;
}

const TaskSchema: Schema<Task> = new Schema({
  title: {
    type: String,
    require: true,
  },

  description: {
    type: String,
  },

  status: {
    type: String,
    required: true,
  },

  priority: {
    type: String,
    required: true,
  },

  dueDate: {
    type: Date,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  accessToken: string;
  tasks: Task[];
  createdAt: Date;
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    require: [true, "Username is required."],
    trim: true,
    unique: true,
  },

  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"],
  },

  password: {
    type: String,
    required: [true, "Password is required."],
  },

  accessToken: {
    type: String,
  },

  tasks: [TaskSchema],

  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
