import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { UserModel } from "./db";

const JWT_PASSWORD = "!1212";

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


app.get("/api/v1/content", async (req, res) => {
    const title = req.body.title
    const content = req.body.content
    const tags = req.body.tags
    res.send

})


app.delete("/api/v1/content", (req, res) => {

})
app.post("/api/v1/brain/share", (req, res) => {

})


app.get("/api/v1/brain/:sharelink", (req, res) => {

})
// We have to add the context with the content we share with gpt/model 
app.post("/api/v1/addContent", (req, res) => {

})

app.listen(3000);