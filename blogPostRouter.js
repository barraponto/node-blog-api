const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create('The Republic', 
	'Discuss the meaning of justice and whether or not the just man is happier than the unjust man.', 
	'Plato',
	'380 BC');
BlogPosts.create('3 hour tour', 
	'Why did they bring so many different outfits?', 
	'Brandon Crews',
	'2017');

router.get('/', (req, res) => {
	res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ["title", "content", "author", "publishDate"];
	for(let i = 0; i<requiredFields.length; i++){
		const field = requiredFields[i];
		if(!field in req.body) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	const item = BlogPosts.create(req.body.title, req.body.content, 
		req.body.author, req.body.publishDate);
});

router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Delete shopping list item \`${req.params.ID}\``);
	req.status(204).end();
});

router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = ["title", "content", "author", "publishDate", "id"];
	for(let i = 0; i<requiredFields.length; i++){
		const field = requiredFields[i];
		if(!field in req.body) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	if(req.params.id !== req.body.id) {
		const message = (
			`Request path id (${req.params.id}) and request body id `
			`(${req.body.id}) must match`);
		console.erro(message);
		return res.status(400).send(message);
	}
	console.log(`Updaing blog post \`${req.params.id}\``);
	const updatedItem = BlogPosts.update({
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate
	});
	res.status(204).json(updatedItem);	
});

module.exports = router;