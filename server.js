require("dotenv").config()
const express = require("express");
const path = require("path");
const articleRouter = require("./routes/article");
const Article = require("./models/articleModels");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const app = express();

mongoose.connect(process.env.DATABASE_URL);
mongoose.set("strictQuery", false);

app.set("view engine", "ejs"); 

// every articleRouter route will have "/articles" in front of it
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use("/articles", articleRouter);

app.get("/", async (req, res) => {
	const articles = await Article.find().sort({ createdAt: "desc" });
	//for each is being implemented in index.ejs
	res.render("articles/Index", { articles: articles });
});

// serving static files here:
app.use(express.static(path.join(__dirname, "public")));

const Port = process.env.PORT;
app.listen(Port, () => {
	console.log(`Listening at: http://localhost:${Port}/`);
});




// TODO - ISSUES TO BE SOLVED:

// !Markdown isn't working
// !Edit button isn't updating stuff 
