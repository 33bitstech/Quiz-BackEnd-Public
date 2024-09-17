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
const vitest_1 = require("vitest");
const user_1 = __importDefault(require("../src/services/user"));
const userNotAcceptable = {
    name: '',
    email: '@@',
    password: 'senha de teste',
    quizes: [],
};
const userAcceptable = {
    name: 'Paulo Ribas',
    email: 'paulo13paulo423@gmail.co,',
    password: 'sdsadsadsa',
    quizes: []
};
(0, vitest_1.describe)('user service tests', () => {
    (0, vitest_1.it)('should not crate user with empty name', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, vitest_1.expect)(yield user_1.default.create(userNotAcceptable)).rejects.toThrow();
    }));
    (0, vitest_1.it)('should crate user ', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_1.default.create(userAcceptable);
        (0, vitest_1.expect)(user).toHaveProperty('id');
        (0, vitest_1.expect)(user.name).toBe(userAcceptable.name);
        (0, vitest_1.expect)(user.email).toBe(userAcceptable.email);
    }));
});
