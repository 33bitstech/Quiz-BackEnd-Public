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
exports.decodeToken = exports.signToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
const signToken = function (data, expiresIn) {
    return __awaiter(this, void 0, void 0, function* () {
         
        return new Promise((resolve, reject) => {
            (0, jsonwebtoken_1.sign)(data, process.env.JWTSECRET, { expiresIn }, (err, token) => {
                if (err)
                    return reject(err);
                return resolve(token);
            });
        });
    });
};
exports.signToken = signToken;
const decodeToken = function (token) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            (0, jsonwebtoken_1.verify)(token, process.env.JWTSECRET, (err, decoded) => {
                if (err)
                    return reject(err);
                return resolve(decoded);
            });
        });
    });
};
exports.decodeToken = decodeToken;
