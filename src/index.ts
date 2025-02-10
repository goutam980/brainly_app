import express from "express";
import { JWT_PASSWORD } from "./config";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { UserModel, ContentModel } from "./db";
import { userMiddleware } from "./middleware";
import { TypeFormatFlags } from "typescript";
import { Request, Response } from "express";



const app = express()
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password

    try {
        await UserModel.create({
            username: username,
            password: password
        })
        res.json({
            message: "User Signed Up"
        })
    }
    catch (e) {
        res.status(411).json({
            message: "User already he bhai dossara user bana"
        })


    }
})

app.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password
    const existingUser = await UserModel.findOne({
        username,
        password
    })
    if (existingUser) {
        const token = jwt.sign({
            id: existingUser._id
        }, JWT_PASSWORD)

        res.json({
            token
        })
    }
    else {
        res.status(403).json({
            message: "invalid user "

        })

    }


})

app.post("/api/v1/content", userMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, link } = req.body;

        await ContentModel.create({
            link,
            title,
            //@ts-ignore
            userId: req.userId,
            tags: []
        });

        res.json({ message: "Content added" });
    } catch (error) {
        console.error("Error adding content:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.get("/api/v1/content", userMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId
    }).populate("userId", "username")
    res.json(
        { content }
    )
})


app.delete("/api/v1/content", userMiddleware, async (req, res): Promise<void> => {
    try {
        //@ts-ignore
        const contentId = req.body.contentId;
        //@ts-ignore
        const userId = req.userId; // Ensure userId is properly extracted

        await ContentModel.deleteMany({
            contentId,
            userId
        });

        res.json({ message: "Deleted" }); // Use res.json() instead of returning an object
    } catch (error) {
        console.error("Error deleting content:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.post("/api/v1/brain/share", (req, res) => {

})


app.get("/api/v1/brain/:sharelink", (req, res) => {

})
// We have to add the context with the content we share with gpt/model 
app.post("/api/v1/addContent", (req, res) => {

})

app.listen(3000);