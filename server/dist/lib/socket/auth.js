"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AuthWsMiddleWare = (tokenString) => {
    const token = tokenString.split(" ")[1];
    // Verifying the JWT
    try {
        let res = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log("Data from socket authentication = ", res);
        return res;
    }
    catch (e) {
        console.log(e);
        return false;
    }
};
exports.default = AuthWsMiddleWare;
