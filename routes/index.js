import express from "express";
import db from "../db-sqlite.js"
import bodyParser from "body-parser"

const router = express.Router()

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get("/", async (req, res) => {
    const tweets = await db.all("SELECT tweet.*, user.name FROM tweet JOIN user ON tweet.author_id = user.id ORDER BY edited_at DESC")
    console.log(tweets)
    res.render("index.njk", {
        title: "Qwitter",
        tweets: tweets,
    })
})

router.post("/post", async (req, res) => {
    const post = req.body
    const author_id = 1

    db.run('INSERT INTO tweet (message, author_id) VALUES (?, ?)', post.post, author_id)

    res.redirect("/")
})

router.get("/post", async (req, res) => {
    res.render("post.njk", {
        title: "Qwitter - Post",
    })
})

router.get("/:id/edit", async (req, res) => {
    const id = req.params.id
    const tweet = db.all('SELECT tweet.* FROM tweet JOIN user ON user.id = tweet.author_id WHERE tweet.id = ?', id)
    res.render("edit.njk", {
        tweet: tweet[0]
    })
})

router.post("/edit", async (req, res) =>{
    const message = req.body.message
    const id = req.body.id
    const timestamp = new Date()
    db.run('UPDATE tweet SET message = ?, edited_at = ?, edited = TRUE WHERE id = ?', message, timestamp, id)
    res.redirect("/")
})

router.get("/:id/delete", async (req, res) => {
    const id = req.params.id
    
    db.run('DELETE FROM tweet WHERE id = ?', id)
    //await db.run('DELETE FROM favorites WHERE tweet_id = ?', id)
    
    res.redirect("/")
})

/*router.get("/favorites", async (req, res) => {
    const [tweets] = await db.run("SELECT tweet.*, user.name FROM tweet JOIN user ON tweet.author_id = user.id JOIN favorites ON favorites.tweet_id = tweet.id ORDER BY tweet.edited_at DESC;")

    res.render("favorites.njk", {
        title: "Qwitter - Favorites",
        tweets: tweets
    })
})

router.get("/:id/favorite", async (req, res) => {
    console.log(req.params.id)
    const tweet_id = req.params.id
    const user_id = 1

    await db.run('INSERT INTO favorites (tweet_id, user_id) VALUES (?, 1)', tweet_id, user_id)

    res.redirect("/")
})

router.get("/:id/unfavorite", async (req, res) => {
    const id = req.params.id
    const user_id = 1

    await db.run('DELETE FROM favorites WHERE tweet_id = ? AND user_id = ?', id, user_id)
    res.redirect("/favorites")
})*/

export default router 