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
const user_1 = __importDefault(require("../services/user"));
const autenthicate_1 = require("../services/autenthicate");
const jwt_1 = require("../utils/jwt");
const images_1 = require("../utils/images");
let expiresIn = '7d';
exports.default = new class {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req.body;
                let { name, email, password } = user;
                if (!name || !email || !password)
                    throw { error: 'preencha todos os campos' };
                let newUser = yield user_1.default.createUserInstance(user);
                const isEmailAlreadyRegistered = yield user_1.default.getUserByEmail(email);
                if (isEmailAlreadyRegistered)
                    throw { message: 'um usuario já foi cadastrado com esse email', code: 409 };
                yield user_1.default.save(newUser);
                const signUser = {
                    userId: newUser.userId,
                    name: newUser.name,
                    email: newUser.email,
                    profileImg: newUser.profileImg
                };
                const token = yield (0, jwt_1.signToken)(signUser, expiresIn);
                res.status(201).send({ token: token });
            }
            catch (error) {
                 
                let { code, message } = error;
                if (!code || !message) {
                    code = 500;
                    message = 'ocorreu um erro com essa requisição';
                }
                res.status(code).send({ message });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req.body;
                let userInput = yield user_1.default.createUserInstance(user);
                const userFromDB = yield user_1.default.getUserByEmail(userInput.email), userToAuthenticate = new autenthicate_1.authenticateUser(userFromDB.userId, userFromDB.name, userFromDB.email, userFromDB.password);
                yield userToAuthenticate.compareName(user.name);
                let hash = yield user_1.default.createHashPassword(user.password);
                const isPasswordEqual = yield userToAuthenticate.comparePassword(user.password, hash);
                if (!isPasswordEqual)
                    throw { message: 'senha incorreta', code: 401 };
                const token = yield userToAuthenticate.createAndGetToken('7d');
                res.status(200).send({ token });
            }
            catch (error) {
                res.status(error.code).send({ message: error.message });
            }
        });
    }
    authenticateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req;
                if (!user)
                    throw { code: 406, message: 'usuario não informado' };
            }
            catch (error) {
                const { code, message } = error;
                res.status(code).send(message);
            }
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let decodedUser = req.user, { userName, userEmail, password } = req.body;
                if (!password)
                    password = 'password do not update';
                const userInstance = yield user_1.default.createUserInstance({
                    userId: decodedUser.userId,
                    name: userName,
                    email: userEmail,
                    password,
                });
                const { userId, name, email, profileImg } = yield user_1.default.updateUser(userInstance.userId, userInstance.name, userInstance.email, userInstance.password);
                const token = yield (0, jwt_1.signToken)({ userId, name, email, profileImg }, '7d');
                res.status(200).send({ token, user: {
                        userId,
                        name,
                        email
                    } });
            }
            catch (error) {
                res.status(error.code).send({ message: error.message });
            }
        });
    }
    updateProfileImg(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { user } = req;
                if (!user)
                    throw { code: 406, message: 'usuario não informado' };
                const key = (_a = req.file) === null || _a === void 0 ? void 0 : _a.key;
                if (!key)
                    throw { code: 500, message: 'não foi encontrado origem da imagem' };
                const imgSrc = (0, images_1.makeImgSrc)(key, 'dofnykgfdiu64.net');
                 
                const { userId, name, email, profileImg } = yield user_1.default.updateUserProfileImg(user.userId, imgSrc);
                const token = yield (0, jwt_1.signToken)({ userId, name, email, profileImg }, '7d');
                res.status(200).send({ token, imgSrc });
                res.status(200).send('enviado');
            }
            catch (error) {
                 
                res.status(500).send('erro');
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
};
