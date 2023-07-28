// Intialize the express
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const InvestmentSeekersCollection = require("./mongodb");

//use app from express
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//import path module
const path = require("path");

//Import path for various directories
const static_path = path.join(__dirname, "../public");
app.use(express.static(static_path));
app.use(express.static(path.join(__dirname, "../public/images")));

//Start the server
app.listen(port, () => {
    console.log("server started at " + port);
});

//specify the default engine
app.set("view engine", "hbs");

//Display pages
app.get("/", (req, res) => {
    res.render("index");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/about", (req, res) => {
    res.render("about");
});
app.get("/Contact", (req, res) => {
    res.render("contact");
});
app.get("/signup", (req, res) => {
    res.render("signup");
});

//handling post requests for mongodb
app.post('/signup', async (req, res) => {
    const data = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        companyname: req.body.companyname,
        companytype: req.body.companytype,
        phonenumber: req.body.phonenumber
    }

    try {
        const checking = await InvestmentSeekersCollection.findOne({ username: req.body.username });

        if (checking) {
            if (checking.username === req.body.username && checking.password === req.body.password) {
                res.send("User details already exist");
            } else {
                res.send("Username already taken");
            }
        } else {
            await InvestmentSeekersCollection.insertMany([data]);
            res.status(201).render("index");
        }
    } catch (error) {
        console.log(error);
        res.send("Error occurred while checking the database");
    }
});


//to test login credentials
app.post('/login', async (req, res) => {
    const currentDate = new Date().toLocaleString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    try {
        const check = await InvestmentSeekersCollection.findOne({ username: req.body.username })
        if (check.password === req.body.password) {
            const count = await InvestmentSeekersCollection.countDocuments({});
            res.status(201).render("dashboard", { user: check, currentDate,count })
        }
        else {
            res.send("incorrect password")
        }
    }
    catch (e) {
        res.send("wrong details")
    }
})