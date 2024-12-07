import mongoose, { Schema, Document } from "mongoose";
//import { unique } from "next/dist/build/utils";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "UserName is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "please use a valid email address"], // the first parameter is for regexr validation goto regexr website under community patterns for more advanced validations
  },
  password: {
    type: String,
    required: [true, "Email is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "VerifyCode is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Email is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
});
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

// this is the exporting techniques for checking the user model existing in the database or not if exist then the first statementg is excecute if not then  the second statement is excecute for example : cont userModel = 1st statament || 2nd statement thenb export the userModel

export default UserModel;
