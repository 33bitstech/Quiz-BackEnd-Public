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
exports.checkEmailValidate = exports.generateTrimmedString = exports.isTextEmpty = void 0;
function isTextEmpty(text) {
    if (text.length === 0 || text.trim().length === 0)
        return true;
    return false;
}
exports.isTextEmpty = isTextEmpty;
function generateTrimmedString(text) {
    return text.trim();
}
exports.generateTrimmedString = generateTrimmedString;
function checkEmailValidate(text) {
    return __awaiter(this, void 0, void 0, function* () {
        let isEmailEmpty = isTextEmpty(text);
        let validateByRegex = text.match(/^[\w\d.!#$%&'+/=?^_`{|}~-]+@[\w\d-]+(?:\.[\w\d-]+)+$/);
        return new Promise((resolve, reject) => {
            if (!isEmailEmpty && validateByRegex)
                return resolve(true);
            return reject(false);
        });
    });
}
exports.checkEmailValidate = checkEmailValidate;
