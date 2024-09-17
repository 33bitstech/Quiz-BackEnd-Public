"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
exports.default = new class userRepositorie {
    save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = new userModel_1.default(user);
                return newUser.save();
            }
            catch (error) {
                throw error;
            }
        });
    }
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield userModel_1.default.findOne({ userId });
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findUserByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield userModel_1.default.findOne({ name });
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield userModel_1.default.findOne({ email });
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateName(userId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield userModel_1.default.findOneAndUpdate({ userId }, { $set: { name } }, { new: true });
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateEmail(userId, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield userModel_1.default.findOneAndUpdate({ userId }, { $set: { email } }, { new: true });
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    updatePassword(userId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield userModel_1.default.findOneAndUpdate({ userId }, { $set: { password } }, { new: true });
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateProfileImg(userId, profileImg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                 
                let user = yield userModel_1.default.findOneAndUpdate({ userId }, { profileImg }, { new: true });
                 
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
};
