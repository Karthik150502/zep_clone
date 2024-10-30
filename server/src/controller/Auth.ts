import { Request, Response } from "express"
import prisma from "../config/config.db"
import jwt from "jsonwebtoken"
import { hash, compare } from "bcrypt"
interface LoginPayload {
    username: string,
    password: string,
}
interface SignupPayload {
    username: string,
    password: string,
}

export default class AuthController {
    static async login(req: Request, res: Response) {
        try {
            const body: LoginPayload = req.body;


            console.log("LoginPayload", body)

            let findUser = await prisma.user.findUnique(
                {
                    where: {
                        username: body.username
                    }
                }
            )

            if (!findUser) {
                res.json({
                    status: 400,
                    message: "Incorrect Credentials, check the username."
                })
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
            }

            const token = jwt.sign(JWTPayload, process.env.JWT_SECRET as string, {
                expiresIn: "365d"
            })

            res.json({
                status: 200,
                message: "Logged in successfully",
                user: {
                    ...findUser,
                    token: `Bearer ${token}`
                }
            })
            return;
        } catch (e) {
            console.log("Failed to login, ", e)
            res.json({
                status: 500,
                message: "Something went wrong, failed to log in, try again after some time.",
            })
            return;
        }
    }




    static async signup(req: Request, res: Response) {
        try {
            const body: SignupPayload = req.body;
            let findUser = await prisma.user.findUnique(
                {
                    where: {
                        username: body.username
                    }
                }
            )

            if (findUser) {
                res.json({
                    status: 400,
                    message: "User already exists, try other username."
                })
                return;
            }



            let hashedPasword = await hash(body.password, 10);


            let newUser = await prisma.user.create({
                data: {
                    ...body,
                    password: hashedPasword
                }
            })

            res.json({
                status: 200,
                message: "Signed up successfully",
                user: newUser
            })
            return;
        } catch (e) {
            console.log("Failed to Sign Up, ", e)
            res.json({
                status: 500,
                message: "Something went wrong, failed to Sign Up, try again after some time.",
            })
            return;
        }
    }
}