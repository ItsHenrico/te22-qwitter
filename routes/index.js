import express from "express";
import db from "../db-sqlite.js"
import bodyParser from "body-parser"
import bcrypt from "bcrypt"
import session from "express-session"

const router = express.Router()

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { sameSite: true }
}))

router.get("/", async (req, res) => {
    const tweets = await db.all("SELECT tweet.*, user.name FROM tweet JOIN user ON tweet.author_id = user.id ORDER BY created_at DESC")
    //Fixa qweets med enter och tomma
    console.log(tweets)
    tweets.forEach(tweet => {
        tweet.message = tweet.message.trim()
        if(tweet.message == ""){
            tweets.splice(tweets.indexOf(tweet), 1)
        }
    });
    console.log(tweets)
    res.render("index.njk", {
        title: "Qwitter",
        tweets: tweets,
        loggedIn: req.session.loggedin,
        loggedInID: req.session.loggedInID,
    })
})

router.post("/post", async (req, res) => {
    if (req.session.loggedin && req.session.loggedInID.id) {
        const post = req.body

        db.run('INSERT INTO tweet (message, author_id) VALUES (?, ?)', post.post, req.session.loggedInID.id)

        res.redirect("/")
    }
})

router.get("/post", async (req, res) => {

    if (req.session.loggedin) {
        res.render("post.njk", {
            title: "Qwitter - Post",
            header: "Qweet",
            action: "Post",
            link: "./post",
            loggedIn: req.session.loggedin,
            loggedInID: req.session.loggedInID,
        })
    } else {
        res.redirect("/login")
    }
})

router.get("/:id/edit", async (req, res) => {
    if (req.session.loggedin) {
        const id = req.params.id
        const author_id = await db.get("SELECT author_id FROM tweet WHERE id = ?", id)
        if (req.session.loggedInID.id == author_id.author_id) {
            const tweet = await db.all('SELECT tweet.* FROM tweet JOIN user ON user.id = tweet.author_id WHERE tweet.id = ?', id)
            res.render("edit.njk", {
                tweet: tweet[0],
                header: "Edit Qweet",
                action: "Edit",
                link: "./edit",
                loggedIn: req.session.loggedin,
                loggedInID: req.session.loggedInID,
            })
        } else {
            res.redirect("/")
        }
    }
})

router.post("/edit", async (req, res) => {
    if (req.session.loggedin) {
        const message = req.body.message
        const id = req.body.id
        const author_id = await db.get("SELECT author_id FROM tweet WHERE id = ?", id)
        if (req.session.loggedInID.id == author_id.author_id) {
            await db.run('UPDATE tweet SET message = ?, edited_at = (CURRENT_TIMESTAMP), edited = TRUE WHERE id = ?', message, id)
            res.redirect("/")
        }
    }
})

router.get("/:id/delete", async (req, res) => {
    if (req.session.loggedin) {
        const id = req.params.id
        const author_id = await db.get("SELECT author_id FROM tweet WHERE id = ?", id)

        if (req.session.loggedInID.id == author_id.author_id) {
            await db.run('DELETE FROM tweet WHERE id = ?', id)
            //await db.run('DELETE FROM favorites WHERE tweet_id = ?', id)
        }
    }

    res.redirect("/")
})

router.get("/login", (req, res) => {
    res.render("login.njk", {
        loggedIn: req.session.loggedin,
        loggedInID: req.session.loggedInID,
    })
})

router.post("/login", async (req, res) => {
    const username = req.body.username
    const SQLpassword = await db.get("SELECT password FROM user WHERE UPPER(name) = UPPER(?)", username)
    if (SQLpassword) {
        const hashPassword = SQLpassword.password
        const givenPassword = req.body.password
        const result = await bcrypt.compare(givenPassword, hashPassword)
        if (result) {
            req.session.loggedin = true
            req.session.loggedInID = await db.get("SELECT id FROM user WHERE UPPER(name) = UPPER(?)", username)
            res.redirect("/")
        }
        if (!result) {
            res.redirect("/login")
        }
    } else {
        res.redirect("/login")
    }
})

router.get("/logout", (req, res) => {
    req.session.destroy(function (err) {
        res.redirect("/")
    })
})

router.get("/signup", (req, res) => {
    res.render("signup.njk", {
        loggedIn: req.session.loggedin,
        loggedInID: req.session.loggedInID,
    })
})

router.post("/signup", async (req, res) => {
    const [a] = await db.all('SELECT EXISTS(SELECT 1 FROM user WHERE name = ?) AS bool', req.body.username)
    const usernameExists = a.bool
    if (req.body.password != req.body.confirm) {
        res.redirect("/signup")
    } else if (usernameExists == 1) {
        res.redirect("/signup")
    } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await db.run('INSERT INTO user (name, password) VALUES (?, ?)', [req.body.username, hashedPassword])
        res.redirect("/login")
    }
})

/*router.get("/favorites", async (req, res) => {
    const [tweets] = await db.run("SELECT tweet.*, user.name FROM tweet JOIN user ON tweet.author_id = user.id JOIN favorites ON favorites.tweet_id = tweet.id ORDER BY tweet.edited_at DESC;")

    res.render("favorites.njk", {
        title: "Qwitter - Favorites",
        tweets: tweets
    })
})

router.get("/:id/favorite", async (req, res) => {
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