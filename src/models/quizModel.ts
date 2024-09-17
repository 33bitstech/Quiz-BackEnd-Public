import IQuizes from "../interfaces/IQuizes";
import mongoose from "mongoose";

export const Schema = new mongoose.Schema<IQuizes>({
    quizId: {type: String, required: true},
    title: String,
    description: String,
    quizThumbnail: {type: String, default: 'default'},
    userCreatorId: String,
    userCreatorName: String,
    category: String,
    questions: {type: Array, default: []},
    tags: {type: Array, default: []},
    resultMessages: Object,
    qtdQuestions: {type: Number, default: 0},
    usersCount: {type: Number, default: 0},
    draft: Boolean,
    isPrivate: Boolean,
    idiom: {type: String, default: 'en'},
    type: {type: String, default: 'default/RW'},
    created_at: {type: Date, default: new Date},
    updated_at: {type: Date, default: new Date},
})

Schema.pre('save', function(next){
    this.updated_at = new Date
    next()
})

const quizModel = mongoose.model<IQuizes>('quizzes', Schema)

export default quizModel