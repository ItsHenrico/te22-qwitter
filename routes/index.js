import express from "express";
import db from "../db-sqlite.js"
import bodyParser from "body-parser"
import bcrypt from "bcrypt"
import session from "express-session"
import { query, matchedData, validationResult, body } from "express-validator"

const router = express.Router()
const app = express()
app.use(express.json())

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
    for (let tweet of tweets) {
        tweet.message = tweet.message.trim()
        if (tweet.message == '') {
            await db.run("DELETE FROM tweet WHERE id = ?", tweet.id)
        }
    }
    res.render("index.njk", {
        title: "Qwitter",
        tweets: tweets,
        loggedIn: req.session.loggedin,
        loggedInID: req.session.loggedInID,
    })
})

router.post("/post", body('post').trim().notEmpty().escape(), async (req, res) => {
    const results = validationResult(req)
    if(results.isEmpty()){
        if (req.session.loggedin && req.session.loggedInID.id) {
            const post = req.body
            await db.run('INSERT INTO tweet (message, author_id) VALUES (?, ?)', post.post, req.session.loggedInID.id)
            return res.redirect("/")
        }
    }
    res.redirect("/post")
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
                title: "Edit Qweet",
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

router.post("/edit", body('message').trim().notEmpty().escape(), async (req, res) => {
    const results = validationResult(req)
    const id = req.body.id
    if(results.isEmpty()){
        if (req.session.loggedin) {
            const message = req.body.message
            const author_id = await db.get("SELECT author_id FROM tweet WHERE id = ?", id)
            if (req.session.loggedInID.id == author_id.author_id) {
                await db.run('UPDATE tweet SET message = ?, edited_at = (CURRENT_TIMESTAMP), edited = TRUE WHERE id = ?', message, id)
                return res.redirect("/")
            }
        }
    }
    res.redirect(`/${id}/edit`)
})

router.get("/:id/delete", async (req, res) => {
    if (req.session.loggedin) {
        const id = req.params.id
        const author_id = await db.get("SELECT author_id FROM tweet WHERE id = ?", id)

        if (req.session.loggedInID.id == author_id.author_id) {
            await db.run('DELETE FROM tweet WHERE id = ?', id)
        }
    }

    res.redirect("/")
})

router.get("/login", (req, res) => {
    res.render("login.njk", {
        title: "Qwitter - Login",
        loggedIn: req.session.loggedin,
        loggedInID: req.session.loggedInID,
        error: null
    })
})

router.post("/login", body('username').trim().notEmpty().escape(), body('password').trim().notEmpty().escape(), async (req, res) => {
    const results = validationResult(req)
    if (results.isEmpty()){
        const username = req.body.username
        const SQLpassword = await db.get("SELECT password FROM user WHERE UPPER(name) = UPPER(?)", username)
        if (SQLpassword) {
            const hashPassword = SQLpassword.password
            const givenPassword = req.body.password
            const result = await bcrypt.compare(givenPassword, hashPassword)
            if (result) {
                req.session.loggedin = true
                req.session.loggedInID = await db.get("SELECT id FROM user WHERE UPPER(name) = UPPER(?)", username)
                return res.redirect("/")
            }
            if (!result) {
                return res.render("login.njk", {
                    error: "Invalid Username or Password"
                })
            }
        } else {
            return res.render("login.njk", {
                error: "Invalid Username or Password"
            })
        }
    }
    res.render("login.njk", {
        error: "Please fill out all the fields"
    })
})

router.get("/logout", (req, res) => {
    req.session.destroy(function (err) {
        res.redirect("/")
    })
})

router.get("/signup", (req, res) => {
    res.render("signup.njk", {
        title: "Qwitter - Singup",
        loggedIn: req.session.loggedin,
        loggedInID: req.session.loggedInID,
        error: null,
    })
})

router.post("/signup", body('username').trim().notEmpty().escape(), body('password').trim().notEmpty().escape(), body('confirm').trim().notEmpty().escape(), async (req, res) => {
    const results = validationResult(req)
    if(results.isEmpty()){
        const [a] = await db.all('SELECT EXISTS(SELECT 1 FROM user WHERE UPPER(name) = UPPER(?)) AS bool', req.body.username)
        const usernameExists = a.bool
        if (req.body.password != req.body.confirm) {
            return res.render("signup.njk", {
                error: "Passwords don't match"
            })
        } else if (usernameExists == 1) {
            return res.render("signup.njk", {
                error: "Username already exists"
            })
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            await db.run('INSERT INTO user (name, password) VALUES (?, ?)', [req.body.username, hashedPassword])
            return res.redirect("/login")
        }
    }
    res.render("signup.njk", {
        error: "Please fill out all the fields"
    })
})

export default router 