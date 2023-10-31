import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Database Connected !");
  } catch (error) {
    console.log(error);
  }
};

export default connect;
