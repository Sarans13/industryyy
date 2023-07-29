// Intialize the express
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const { StartupCollection, InvestorCollection } = require("./mongodb");
const { companiesData } = require("./data");
const { topperformers } = require("./company")


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
app.post('/pay',(req,res)=>{
    res.status(201).render("pay");
})
app.post('/debit',(req,res)=>{
    res.status(201).render("debit");
})
app.get('/backtohome',(req,res)=>{
    res.status(201).render("index");
})



//handling post requests for mongodb
app.post('/signup', async (req, res) => {
    const data = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      companyname: req.body.companyname,
      companytype: req.body.companytype,
      phonenumber: req.body.phonenumber,
      problemmentioned: req.body.problemmentioned,
      color: req.body.color
    };
  
    try {
      let collection;
      if (req.body.color === 'red') {
        collection = StartupCollection;
      } else {
        collection = InvestorCollection;
      }
  
      const checking = await collection.findOne({ username: req.body.username });
  
      if (checking) {
        if (checking.username === req.body.username && checking.password === req.body.password) {  
          res.status(201).render("index", {});
        } else {
          res.send("Incorrect password");
        }
      } else {
        await collection.insertMany([data]);
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
        let collection;
        if (req.body.color === 'red') {
          collection = StartupCollection;
        } else {
          collection = InvestorCollection;
        }
        const check = await collection.findOne({ username: req.body.username })
        console.log(check.username,check.password);
        if (check.password === req.body.password) {
          if(check.color === 'red'){
            const matchingCompanies = companiesData.filter((company) => company.type === check.companytype);
            const count = await collection.countDocuments({});
            if (matchingCompanies.length > 0) {
                res.status(201).render("dashboard", { user: check, currentDate,count, matchingCompanies });
              }
            }
            else{
                const startupCollectionData = await StartupCollection.find({}).lean();
                res.status(201).render("investordashboard", { user: check, startupCollectionData });
            }
          }
        else {
            res.send("incorrect password")
        }
    }
    catch (e) {
        console.log(e);
        res.send("wrong details")
    }
})

//to book.hbs
    app.post('/book', (req, res) => {
        const companyType = req.body.companytype;
        const topcompanies = topperformers.filter((company) => company.type === companyType);
        if (topcompanies.length > 0) {
            res.status(201).render("book", {topcompanies });
          }
    });    


