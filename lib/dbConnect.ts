import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("already connected to database");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    console.log("DB ", db);
    connection.isConnected = db.connections[0].readyState; // readyState is returning the number of the state of the connection
    console.log("DB connections", db.connections[0]);
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("Database connection failed", error);
    process.exit(1);
  }
}
export default dbConnect;
