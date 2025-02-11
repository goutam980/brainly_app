import { NextFunction, Request, Response } from "express";
import jWT from "jsonwebtoken"
import { JWT_PASSWORD } from "./config";



export const userMiddleware = (req: Request, res: Response, next: NextFunction
) => {
    const header = req.headers["authorization"];
    const decode = jWT.verify(header as string, JWT_PASSWORD)
    if (decode) {
        //@ts-ignore
        req.userId = decode.id;
        next()




    } else {
        res.status(403).json({
            message: "You are not logged in"
        })
    }

}