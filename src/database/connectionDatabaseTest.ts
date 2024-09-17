import mongoose from "mongoose";

export default class connection {
    public async execute(): Promise<void> {
        try {
            await mongoose.connect('mongodb://127.0.0.1:27017/QuizTestDatabase')
             
        } catch (error) {
            throw new Error('failed to connect')
        }
    }
    public async close():Promise<void> {
        try {
            await mongoose.connection.close()
        } catch (error) {
            throw error
        }
    }
}