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
exports.storageProfile = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = require("dotenv");
const multer_s3_1 = __importDefault(require("multer-s3"));
const bcrypt_1 = require("../utils/bcrypt");
(0, dotenv_1.configDotenv)();
const s3Config = {
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_Region,
};
exports.storageProfile = (0, multer_s3_1.default)({
    s3: new client_s3_1.S3(s3Config),
    bucket: process.env.AWS_S3_BUCKET,
    acl: 'public-read',
    contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const date = Date.now().toString();
            const hash = `profilesimg/${(_a = req.file) === null || _a === void 0 ? void 0 : _a.filename}${yield (0, bcrypt_1.createHash)(7, date)}-${date}`;
            cb(null, hash);
        });
    }
});
