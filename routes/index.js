import express from "express";
import pool from "../db.js"
import bodyParser from "body-parser"

const router = express.Router()

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get("/", async (req, res) =>{
    const [tweets] = await pool.promise().query("SELECT tweet.*, user.name FROM tweet JOIN user ON tweet.author_id = user.id ORDER BY edited_at DESC") 
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

router.get("/favorites", async (req, res) =>{
    const [tweets] = await pool.promise().query("SELECT favorites.*, user.name FROM favorites JOIN user ON favorites.user_id = user.id ORDER BY tweet.edited_at DESC") 

    res.render("favorites.njk", {
        title: "Qwitter - Favorites",
        tweets: tweets
    })
})


router.get("/:id/delete", async (req, res) =>{
    const id = req.params.id

    await pool.promise().query('DELETE FROM tweet WHERE id = ?', [id])
    await pool.promise().query('DELETE FROM favorites WHERE tweet_id = ?', [id])

    res.redirect("/")
})

router.get("/:id/favorite", async (req, res) =>{
    const tweet_id = 22
    const user_id = 1

    await pool.promise().query('INSERT INTO favorites (tweet_id, user_id) VALUES (22, 1)', tweet_id, user_id)

    res.redirect("/")
})

export default router 