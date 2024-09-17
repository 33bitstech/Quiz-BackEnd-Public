import IComment from "../interfaces/IComment";
import mongoose from "mongoose";

export const Schema = new mongoose.Schema<IComment>({
    commentId: {type: String, required: true},
    userId: {type: String, required: true},
    quizId: {type: String, required: true},
    body: {type: String, required: true},
    userLikes: {type: Array, default: []},
    created_at: {type: Date, default: new Date()},
    updated_at: {type: Date, default: new Date()},
    replies: {type: Array, default: []}

})

const commentsModel = mongoose.model<IComment>('comments', Schema)
export default commentsModel