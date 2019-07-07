import mongoose from "mongoose";

import Chat from "./chatModel";

const connectDb = () => {
  return mongoose.connect("mongodb://localhost:27017/sea-fight");
};

export { Chat };

export default connectDb;
