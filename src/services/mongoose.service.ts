import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    if (process.env.MONGO_URI === undefined) {
      throw new Error("URI is not defined");
    }
    mongoose.set("strictQuery", true);
    // mongoose.set("debug", true);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongodb");
  } catch (error) {
    console.log(error);
  }
};
