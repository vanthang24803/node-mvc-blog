import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    email: { type: String, required: true, min: 4, unique: true },
    password: { type: String, required: true },
    firstName: { type: String ,  required: true},
    lastName: { type: String ,  required: true},
    imageUrl: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = model("User", UserSchema);

export default User;
