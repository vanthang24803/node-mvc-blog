import mongoose from "mongoose";

const { Schema, model } = mongoose;

const PostSchema = Schema(
  {
    title: String,
    description: String,
    content: String,
    image: String,
    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Post = model("blogs", PostSchema);

export default Post;

          
