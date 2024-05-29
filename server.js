const express = require("express");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");

const users = [];
// Loads `.env` file contents into process.env by default.
dotenv.config();
const PORT = process.env.PORT ?? 3000;


const InitializePassport = require("./passport.config");
InitializePassport(
	passport, 
	email => users.find(user=>user.email === email),
	id => users.find(user=>user.id === id)
);

const app = express();
app.set("view-engine", "ejs");
app.use(express.urlencoded({extended: false}))
app.use(flash());
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// set routes
app.get("/", CheckAuthenticated, (req, res) => {
	res.render("index.ejs", {name: req.user.name});
})

app.get("/login", CheckNotAuthenticated, (req, res) => {
	res.render("login.ejs");
})

app.post("/login", CheckNotAuthenticated, passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/login",
	failureFlash: true
}))


app.get("/register", CheckNotAuthenticated, (req, res) => {
	res.render("register.ejs");
})

app.post("/register", CheckNotAuthenticated, async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const hashed_pwd = await bcrypt.hash(password, 10);
		users.push(
			{
				id: Date.now().toString(),
				name,
				email,
				password: hashed_pwd
			}
		)
		res.redirect("/login");

	} catch(e) {
		console.log(`!!! error in register=${e}`);
		res.redirect("/error");
	}
	console.log(users);
})


app.delete("/logout", (req, res) => {
	req.logOut();
	res.redirect("/login");
})

function CheckAuthenticated(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}

	res.redirect("/login");
}

function CheckNotAuthenticated(req, res, next) {
	if(req.isAuthenticated()) {
		return res.redirect("/");
	}

	return next();
}


app.listen(PORT, (error)=> {
	if(error) {
		console.log(`!! error while starting express on port=${PORT} error=${error}`);
		return;
	}
	
	console.log(`express is listening on port=${PORT}`);
	
})
