const showdown = require("showdown");
const slugify = require("slugify");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const mongoose = require("mongoose");

const dompurify = createDomPurify(new JSDOM().window);
mongoose.set("strictQuery", false); //cuz of deprication warning
const converter = new showdown.Converter();


// This is how you make a new document in mongoose:
const articleSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	markdown: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: new Date(),
	},
	slug: {
		type: String,
		required: true,
		unique: true,
	},
	sanitizedHtml: {
		type: String,
		required: true,
	},
});


articleSchema.pre("validate", function (next) {
	const doc = this;  //did this to simplify the code
	if (doc.title) {
	  doc.slug = slugify(doc.title, { lower: true, strict: true });
	}
	if (doc.markdown) {
	  doc.sanitizedHtml = dompurify.sanitize(converter.makeHtml(doc.markdown));
	}
	next();
  });
  




module.exports = mongoose.model("Article", articleSchema);
