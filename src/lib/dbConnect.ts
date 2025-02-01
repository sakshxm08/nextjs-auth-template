type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

const dbConnect = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log("Using existing connection");
    return;
  }
  try {
    console.log("MongoDB connection is not established. Connecting...");
    const mongoose = await import("mongoose");
    const db = await mongoose.connect(process.env.MONGODB_URI || "");

    connection.isConnected = db.connections[0].readyState;

    console.log("DB connected successfully");
  } catch (error) {
    console.log("DB connection failed", error);
  }
};

export default dbConnect;

// import mongoose from "mongoose";

// // Type augmentation for global scope
// type MongooseGlobal = {
//   conn: typeof mongoose | null;
//   promise: Promise<typeof mongoose> | null;
// };

// declare const global: typeof globalThis & {
//   mongo: MongooseGlobal;
// };

// const MONGODB_URI: string = process.env.MONGODB_URI || "";

// if (!MONGODB_URI) {
//   throw new Error(
//     "Please define the MONGODB_URI environment variable inside .env.local"
//   );
// }

// let cached = global.mongo;

// if (!cached) {
//   cached = global.mongo = { conn: null, promise: null };
// }

// async function dbConnect() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//     };
//     cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
//       console.log("Db connected");
//       return mongoose;
//     });
//   }

//   try {
//     cached.conn = await cached.promise;
//   } catch (e) {
//     cached.promise = null;
//     throw e;
//   }

//   return cached.conn;
// }

// export default dbConnect;
