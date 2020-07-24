const express = require('express');
const db = require('../data/db.js');
const router = express.Router();

router.get('/:post_id/comments', (req, res) => {
	const postId = req.params.post_id;

	db
		.findCommentById(postId)
		.then((posts) => {
			const invalidId = posts.length === 0;
			if (invalidId) {
				return res.status(404).json({ message: 'The post with the specified ID does not exist.' });
			}

			db.findPostComments(postId).then((comments) => {
				return res.status(200).json(comments);
			});
		})
		.catch((error) => {
			return res.status(500).json({ error: 'Server error.' });
		});
});

router.post('/:post_id/comments', (req, res) => {
	const post_id = req.params.post_id;
	const text = req.body.text;
	const newComment = { text, post_id };

	if (!text) {
		return res.status(400).json({ message: 'Please include a comment.' });
	}

	db
		.findCommentById(post_id)
		.then((id) => {
			const invalidId = id.length === 0;
			if (invalidId) {
				return res.status(404).json({ message: 'The post with the specified ID does not exist.' });
			}
			db.insertComment(newComment).then((postId) => {
				return res.status(201).json(newComment);
			});
		})
		.catch((error) => {
			console.log('error', error);
			return res.status(500).json({ error: 'Server error.' });
		});
});

module.exports = router;
