import express from "express";
import pool from "../db.js"
import bodyParser from "body-parser"

const router = express.Router()

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get("/", async (req, res) =>{
    const [tweets] = await pool.promise().query("SELECT tweet.*, user.name FROM tweet JOIN user ON tweet.author_id = user.id") 
    console.log(tweets)
    res.render("index.njk", {
        title: "Qwitter",
        tweets: tweets
    })
})

router.post("/", async (req, res) =>{
    const post = req.body
    const author_id = 1

    console.log(post)

    const [result] = await pool.promise().query('INSERT INTO tweet (message, author_id) VALUES (?, 1)', post.post, author_id)

    res.redirect("/")
})

router.get("/post", async (req, res) =>{
    
    res.render("post.njk", {
        title: "Qwitter - Post",
    })
})

export default router 