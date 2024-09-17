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
exports.authenticateUser = void 0;
const user_1 = __importDefault(require("../repositories/user"));
const bcrypt_1 = require("../utils/bcrypt");
const jwt_1 = require("../utils/jwt");
class MethodsAuthenticate {
}
class authenticateUser extends MethodsAuthenticate {
    constructor(userId, name, email, password) {
        super();
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.password = password;
    }
    compareName(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userDB = yield user_1.default.findUserByName(userName);
                if (!userDB)
                    throw { message: 'usuario não encontrado', code: 404 };
                return userName === this.name;
            }
            catch (error) {
                throw error;
            }
        });
    }
    compareEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (error) {
            }
        });
    }
    comparePassword(password, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, bcrypt_1.compareStringToHash)(password, hash);
            }
            catch (error) {
                throw { message: 'ocorreu um erro no servidor', code: 500 };
            }
        });
    }
    getUserFromDB(userId) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    createAndGetToken(expiresIn) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, jwt_1.signToken)(this, expiresIn);
            }
            catch (error) {
                throw error;
            }
        });
    }
    static decodeToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.authenticateUser = authenticateUser;
