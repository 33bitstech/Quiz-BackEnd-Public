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
const user_1 = __importDefault(require("../repositories/user"));
const inputs_1 = require("../utils/inputs");
const ids_1 = require("../utils/ids");
const bcrypt_1 = require("../utils/bcrypt");
class User {
    constructor(userId, name, email, password, created_at, updated_at) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.password = password;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
    static createUserInstance(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { name, email, password, userId } = userData;
                yield this.verifyName(name);
                yield this.verifyEmail(email);
                yield this.verifyPassword(password);
                const id = userId ? userId : this.createUserId();
                const date = new Date;
                const factory = new User(id, name, email, password, date, date);
                return factory;
            }
            catch (error) {
                 
                throw error;
            }
        });
    }
    static verifyName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let isEmpty = (0, inputs_1.isTextEmpty)(name), isThereUserWithSameName = yield user_1.default.findUserByName(name);
                if (isThereUserWithSameName)
                    throw { message: 'usuario com esse nome já existente', code: 409 };
                if (isEmpty)
                    throw { message: 'preencha o campo de nome', code: 400 };
                return true;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static verifyEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, inputs_1.checkEmailValidate)(email);
                return true;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static verifyPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isPasswordEmpty = (0, inputs_1.isTextEmpty)(password);
                if (isPasswordEmpty || password.length < 7)
                    throw { message: 'a senha precisa ser mais longa', code: 400 };
                return true;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static createHashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashPassword = (0, bcrypt_1.createHash)(13, password);
                return hashPassword;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    static createUserId() {
        return (0, ids_1.createUUID)();
    }
    static getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findUserById(userId);
                if (!user)
                    throw { message: 'esse usuario não foi cadastrado', code: 404 };
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getUserByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findUserByName(name);
                if (!user)
                    throw { message: 'não foram encontrados usuarios com esse nome cadastrado', code: 404 };
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findUserByEmail(email);
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield user_1.default.save(user);
            }
            catch (error) {
                throw error;
            }
        });
    }
    static updateUser(userId, name, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userUpdated;
                userUpdated = null;
                const userFromDB = yield user_1.default.findUserById(userId);
                if (!userFromDB)
                    throw { message: 'usuario não cadastrado', code: 403 };
                if (name !== userFromDB.name)
                    userUpdated = yield user_1.default.updateName(userId, name);
                if (email !== userFromDB.email)
                    userUpdated = yield user_1.default.updateEmail(userId, email);
                if (password !== 'password do not update') {
                    const hash = yield this.createHashPassword(password);
                    userUpdated = yield user_1.default.updatePassword(userId, hash);
                }
                if (userUpdated)
                    return userUpdated;
                throw { message: 'nenhum campo foi alterado', code: 500 };
            }
            catch (error) {
                throw {
                    message: error.message || 'não foi possivel fazer nenhuma alteração',
                    code: error.code || 500
                };
            }
        });
    }
    static updateUserProfileImg(userId, imgSrc) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                 
                const user = yield user_1.default.updateProfileImg(userId, imgSrc);
                if (!user)
                    throw { message: 'não foi possivel concluir a ação', code: 400 };
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = User;
