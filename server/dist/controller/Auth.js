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
const config_db_1 = __importDefault(require("../config/config.db"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = require("bcrypt");
class AuthController {
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                console.log("LoginPayload", body);
                let findUser = yield config_db_1.default.user.findUnique({
                    where: {
                        username: body.username
                    }
                });
                if (!findUser) {
                    res.json({
                        status: 400,
                        message: "Incorrect Credentials, check the username."
                    });
                    return;
                }
                // let passwordMatch = await compare(body.password, findUser.password);
                // if (!passwordMatch) {
                //     res.json({
                //         status: 400,
                //         message: "Incorrect Credentials, wrong password"
                //     })
                //     return;
                // }
                let JWTPayload = {
                    name: body.username,
                    id: findUser.id
                };
                const token = jsonwebtoken_1.default.sign(JWTPayload, process.env.JWT_SECRET, {
                    expiresIn: "365d"
                });
                res.json({
                    status: 200,
                    message: "Logged in successfully",
                    user: Object.assign(Object.assign({}, findUser), { token: `Bearer ${token}` })
                });
                return;
            }
            catch (e) {
                console.log("Failed to login, ", e);
                res.json({
                    status: 500,
                    message: "Something went wrong, failed to log in, try again after some time.",
                });
                return;
            }
        });
    }
    static signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                let findUser = yield config_db_1.default.user.findUnique({
                    where: {
                        username: body.username
                    }
                });
                if (findUser) {
                    res.json({
                        status: 400,
                        message: "User already exists, try other username."
                    });
                    return;
                }
                let hashedPasword = yield (0, bcrypt_1.hash)(body.password, 10);
                let newUser = yield config_db_1.default.user.create({
                    data: Object.assign(Object.assign({}, body), { password: hashedPasword })
                });
                res.json({
                    status: 200,
                    message: "Signed up successfully",
                    user: newUser
                });
                return;
            }
            catch (e) {
                console.log("Failed to Sign Up, ", e);
                res.json({
                    status: 500,
                    message: "Something went wrong, failed to Sign Up, try again after some time.",
                });
                return;
            }
        });
    }
}
exports.default = AuthController;
