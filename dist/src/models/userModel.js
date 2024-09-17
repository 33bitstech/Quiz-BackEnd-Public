"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.Schema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    name: String,
    email: String,
    password: String,
    quizes: Array,
    profileImg: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});
exports.Schema.pre('save', function (next) {
    this.updated_at = new Date;
    next();
});
const userModel = mongoose_1.default.model('quizusers', exports.Schema);
exports.default = userModel;
