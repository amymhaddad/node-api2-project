const express = require('express');
const db = require('../data/db.js');
const router = express.Router();

router.use('/:id', (req, res, next) => {
	const postId = req.params.id;

	db
		.findById(postId)
		.then((post) => {
			const invalidId = post.length === 0;
			if (invalidId) {
				return res.status(404).json({ message: 'The post with the specified ID does not exist.' });
			}
			if (post) {
				req.post = post;
			}
			return next();
		})
		.catch((error) => {
			return res.status(500).json({ error: 'Server error.' });
		});
});

router.get('/', (req, res) => {
	db
		.find()
		.then((posts) => {
			return res.status(200).json(posts);
		})
		.catch((error) => {
			return res.status(500).json({ error: 'Server error' });
		});
});

router
	.route('/:id')
	.get((req, res) => res.status(200).json(req.post[0]))
	.delete((req, res) => {
		db.remove(req.post[0].id).then((row) => {
			return res.status(200).json();
		});
	})
	.put((req, res) => {
		const postId = req.params.id;
		const postContent = req.body;

		const missingInformation = !postContent.title || !postContent.contents;
		if (missingInformation) {
			return res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' });
		}

		db
			.update(postId, postContent)
			.then((row) => {
				res.status(200).json(postContent);
			})
			.catch((error) => {
				return res.status(500).json({ error: 'Server error.' });
			});
	});

router.post('/', (req, res) => {
	const newPost = req.body;
	const missingInformation = !newPost.title || !newPost.contents;

	if (missingInformation) {
		return res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' });
	}

	db
		.insert(newPost)
		.then((newPostId) => {
			return res.status(201).json(newPost);
		})
		.catch((error) => {
			return res.status(500).json({ error: 'Server error.' });
		});
});

module.exports = router;
