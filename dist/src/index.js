"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const connectionDatabase_1 = __importDefault(require("./database/connectionDatabase"));
(0, connectionDatabase_1.default)().then(done =>  
app_1.default.listen(5555);
