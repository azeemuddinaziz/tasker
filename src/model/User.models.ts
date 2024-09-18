import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface Task extends Document {
  owner: User;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: Date;
}

const taskSchema: Schema<Task> = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },

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

const userSchema: Schema<User> = new Schema({
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

  tasks: [taskSchema],

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
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default UserModel;
