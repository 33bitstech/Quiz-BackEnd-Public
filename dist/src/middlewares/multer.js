"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfileImg = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_2 = require("../config/multer");
exports.uploadProfileImg = (0, multer_1.default)({
    storage: multer_2.storageProfile,
    limits: {
        fileSize: 11 * 1024 * 1024,
    },
    fileFilter(req, file, cb) {
        if (!file.mimetype.match(/image\/*/))
            return cb(null, false);
        return cb(null, true);
    }
}).single('profileImg');
