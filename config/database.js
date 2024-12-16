import mongoose from "mongoose";

// function for connect mongodb using Mongoose
export const connectDb = () => {
    mongoose
        .connect(process.env.MONGODB_URL)
        .then(() => console.log("database connected"))
        .catch((err) => console.log("database error", err));
};
