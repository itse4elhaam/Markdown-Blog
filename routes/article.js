const express = require("express");
const router = express.Router();
const Article = require("./../models/articleModels");
 

// Every path from here on will be added to the end of "/articles"
router.get("/new", (req, res) => {
	res.render("articles/new", {article: new Article()});
});


//Takes all the edit buttons to "edit.js" page
router.get("/edit/:id", async(req, res) => {
	const article = await Article.findById(req.params.id);
	res.render("articles/edit", {article: article});
});

// Makes sure that we see a readable slug and show the relevant article:
router.get("/:slug", async(req, res) => {
	const article = await Article.findOne({slug: req.params.slug})
    if (article == null) {
        res.redirect('/');
    }
    res.render('articles/show', {article:  article} )
});

// Storing a new article in our DB to render it again when searched by the relevant ID:
router.post("/", async (req, res, next) => {
	req.article = new Article();
	next();
}, saveArticleAndRedirect('new'));
 
// This updates the article whenever save button is clicked on the "Show.ejs" page 
router.put('/:id', async (req, res, next) => {
	console.log('Editing...');
	req.article = await Article.findById(req.params.id)
	next();
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
	console.log("Deleting...");
	await Article.findByIdAndDelete(req.params.id);
	res.redirect('/');
});


// Created because .put and .delete use the same thingy: 
function saveArticleAndRedirect(path){
	return async (req,res) =>{
		let article = req.article ;
		article.title = req.body.title ;
		article.description = req.body.description ;
		article.markdown = req.body.markdown ;
		article.createdAt = req.body.createdAt ;
	
		try {
			article = await article.save();
			res.redirect(`/articles/${article.slug}`);
		} catch (err) {
			console.log(err);
			res.redirect(`/articles/${path}`); 
	
		}
	}
}

module.exports = router;
