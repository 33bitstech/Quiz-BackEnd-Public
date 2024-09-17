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
const user_1 = __importDefault(require("../../src/services/user"));
const connectionDatabaseTest_1 = __importDefault(require("../../src/database/connectionDatabaseTest"));
const app_1 = __importDefault(require("../../src/app"));
const supertest_1 = __importDefault(require("supertest"));
const path_1 = __importDefault(require("path"));
let server = app_1.default.listen(4887);
let token;
const image = path_1.default.resolve(__dirname, 'temp', 'teste.jpg');
 
(0, vitest_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
    new connectionDatabaseTest_1.default().execute();
}));
const userNotAcceptable = {
    name: '',
    email: '@@',
    password: 'senha de teste',
    quizes: [],
};
const userAcceptable = {
    name: `Paulo Ribas${Date.now()}`,
    email: `paulo13paulo423${Date.now()}@gmail.com`,
    password: 'sdsadsadsa',
    quizes: []
};
(0, vitest_1.describe)('user service tests', () => {
    (0, vitest_1.it)('should not create user with empty name', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, vitest_1.expect)(user_1.default.createUserInstance(userNotAcceptable)).rejects.toThrow();
    }));
    (0, vitest_1.it)('should crate user instance', () => __awaiter(void 0, void 0, void 0, function* () {
        let user = yield user_1.default.createUserInstance(userAcceptable);
        (0, vitest_1.expect)(user).toBeInstanceOf(user_1.default);
    }));
});
(0, vitest_1.describe)('deve cadastrar um usuario', () => {
    (0, vitest_1.it)('deve cadastrar um usuario', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server).post('/user').send({ user: userAcceptable });
        (0, vitest_1.expect)(response.body).ownProperty('token');
        const responseToken = response.body.token;
        if (responseToken)
            token = responseToken;
    }));
    (0, vitest_1.it)('deve fazer upload de uma imagem', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server).put('/img-profile').set('authorization', token).attach('profileImg', image);
         
        (0, vitest_1.expect)(response.body).ownProperty('token');
        (0, vitest_1.expect)(response.body).ownProperty('imgSrc');
    }));
});
(0, vitest_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
     
    new connectionDatabaseTest_1.default().close();
    //server.close()
}));
