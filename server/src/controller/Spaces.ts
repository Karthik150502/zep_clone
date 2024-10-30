import { Request, Response } from "express";
import prisma from "../config/config.db";


export class SpaceController {




    public static async create(req: Request, res: Response) {

        let { name, height, width, thumbnail } = req.body;



        let response = await prisma.space.create({
            data: { name, height, width, thumbnail }
        });



        res.status(200).json({
            status: 200,
            message: "The space has been created.",
            id: response.id
        })
    }




    public static async getSpace(req: Request, res: Response) {

        let { spaceId } = req.params;



        let response = await prisma.space.findUnique({
            where: {
                id: spaceId as string
            }
        });



        res.status(200).json({
            status: 200,
            message: "The space has been fetched.",
            space: response
        })
    }


}