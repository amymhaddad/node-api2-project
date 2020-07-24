const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const postsRouter = require('./routes/postsRouter');
const commentsRouter = require('./routes/commentsRouter');
const port = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/posts', postsRouter);
app.use('/api/posts', commentsRouter);

app.get('/', (req, res) => {
	res.send('Welcome');
});
app.listen(port, () => {
	console.log('Running on port', port);
});
