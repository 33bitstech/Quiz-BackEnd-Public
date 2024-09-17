import IToken from "../interfaces/IToken";
import mongoose from "mongoose";

export const Schema = new mongoose.Schema<IToken>({
    email: String,
    token: String,
    expired: {type: Boolean, default: false},
    created_at: {
        type: Date,
        default: new Date
    }
})

const tokenModel = mongoose.model<IToken>('quiztokens', Schema)

export default tokenModel