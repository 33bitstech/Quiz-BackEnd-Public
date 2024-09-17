"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const userController_1 = __importDefault(require("../controllers/userController"));
const multer_1 = require("../middlewares/multer");
const routes = express_1.default.Router();
routes.get('/authenticate-user', auth_1.authenticate, userController_1.default.authenticateUser);
routes.post('/user', userController_1.default.create);
routes.post('/login', userController_1.default.login);
routes.put('/img-profile', auth_1.authenticate, multer_1.uploadProfileImg, userController_1.default.updateProfileImg);
/* routes.put('/user-name', authenticate, userController.updateName)
routes.put('/email', authenticate, userController.updateEmail)
routes.put('/password', authenticate, userController.updatePassword)
routes.post('/password-token', tokenController.sendTokenToUser)
routes.put('password-by-token', userController.recoveryPassword) */
exports.default = routes;
