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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
function authenticate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authorization = req.headers['authorization'];
            if (!authorization)
                throw { message: 'authorization não fornecido', code: 401 };
            let [, token] = authorization.split(' ');
            if (!token)
                throw { message: 'token não fornecido', code: 401 };
            const tokendecoded = yield (0, jwt_1.decodeToken)(token);
            req.user = tokendecoded;
            next();
        }
        catch (error) {
            let { message, code } = error;
            if (!message && !code) {
                message = 'token inválido';
                code = 403;
            }
            res.status(code).send({ message });
        }
    });
}
exports.authenticate = authenticate;
