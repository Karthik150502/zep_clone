"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader === null || authHeader === undefined) {
        return res.status(401).json({
            status: 401,
            message: "Unauthorized"
        });
    }
    const token = authHeader.split(" ")[1];
    // Verifying the JWT
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err)
            return res.status(401).json({
                status: 401,
                message: "Unauthorized"
            });
        req.user = user;
        next();
    });
};
exports.default = AuthMiddleware;
