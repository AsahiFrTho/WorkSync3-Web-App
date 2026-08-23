
import mongoose, { type Mongoose } from "mongoose";


const MONGODB_URI = process.env.MONGODB_URI;

function getMongoUri(): string {
    if (!MONGODB_URI) {
        throw new Error("Please define MONGODB_URI in .env.local");
    }

    return MONGODB_URI;
}

const globalWithMongoose = global as typeof globalThis & {
    mongoose?: {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
    };
};

const cached = globalWithMongoose.mongoose ?? {
    conn: null,
    promise: null,
};

globalWithMongoose.mongoose = cached;

export async function connectToDatabase(): Promise<Mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(getMongoUri());
    }

    cached.conn = await cached.promise;
    return cached.conn;
}