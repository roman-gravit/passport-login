const express = require("express");
const dotenv = require("dotenv");

const app = express();
app.set("view-engine", "ejs");

// Loads `.env` file contents into process.env by default.
dotenv.config();
const PORT = process.env.PORT ?? 3000;

// set routes
app.get("/", (req, res) => {
	res.render("index.ejs", {name: "Roman"});
})

app.get("/login", (req, res) => {
	res.render("login.ejs");
})

app.get("/register", (req, res) => {
	res.render("register.ejs");
})


app.listen(PORT, (error)=> {
	if(error) {
		console.log(`!! error while starting express on port=${PORT} error=${error}`);
		return;
	}
	
	console.log(`express is listening on port=${PORT}`);
	
})
