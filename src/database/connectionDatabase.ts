import mongoose from "mongoose";

export default async function connectToDatabase (): Promise<void> {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/Quiz')
         
    }

    catch (error) {
        throw error
    }

}