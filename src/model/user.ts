import mongoose, { Schema, Document } from "mongoose";
import { Task } from "./task";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  refreshToken: string;
  tasks: Task[];
  createdAt: Date;
  isPasswordCorrect(enteredPassword: string): Promise<boolean>;
  generateRefreshToken(): Promise<string>;
  generateAccessToken(): Promise<string>;
}

const userSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required."],
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
  refreshToken: {
    type: String,
  },
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this.id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this.id,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const UserModel =
  mongoose.models.User || mongoose.model<User>("User", userSchema);

export default UserModel;

console.log("user model");
