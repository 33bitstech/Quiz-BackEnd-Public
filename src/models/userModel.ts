import IUser from "../interfaces/IUser";
import mongoose from "mongoose";

export const Schema = new mongoose.Schema<IUser>({
    userId: {type: String, required: true},
    name: String,
    email: String,
    password: String,
    savedQuizzes: Array,
    profileImg: {type: String, default: 'default'},
    premium: Boolean,
    specialCount: {type: Number, default: 0},
    created_at: {type: Date, default: new Date},
    updated_at: {type: Date, default: new Date}
    
})
Schema.pre('save', function (next)  {
    this.updated_at = new Date
    next()
})
const userModel = mongoose.model<IUser>('quizusers', Schema)

export default  userModel