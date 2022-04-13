const express = require("express");
const app = express();
const axios = require("axios");

const jsonUrl = "https://jsonplaceholder.typicode.com";

app.use(express.json());

// GET comments
app.get("/comments", async (req, res) => {
	const response = await axios.get(`${jsonUrl}${req.url}`).catch(function (error) {
		console.log(error.toJSON());
	});

	if (response?.status != 200) {
		return res.status(500).send({
			message: "Error",
		});
	}

	res.status(200).send({
		message: "Success",
		data: response?.data,
	});
});

// GET posts
app.get("/posts", async (req, res) => {
	const response = await axios.get(`${jsonUrl}${req.url}`).catch(function (error) {
		console.log(error.toJSON());
	});

	if (!response?.data) {
		return res.status(500).send({
			message: "Error",
		});
	}

	res.status(200).send({
		message: "Success",
		data: response?.data,
	});
});

// GET top posts
app.get("/top-posts", async (req, res) => {
	const responseComments = await axios.get(`${jsonUrl}/comments`).catch(function (error) {
		console.log(error.toJSON());
	});
	const responsePosts = await axios.get(`${jsonUrl}/posts`).catch(function (error) {
		console.log(error.toJSON());
	});

	if (responseComments?.status != 200 || responsePosts?.status != 200) {
		return res.status(500).send({
			message: "Error",
		});
	}

	const comments = responseComments.data;
	const posts = responsePosts.data;

	const unsortedTopPosts = posts.map(post => {
		const commentPerPost = comments.filter(comment => comment.postId === post.id);
		return {
			post_id: post.id,
			post_title: post.title,
			post_body: post.body,
			total_number_of_comments: commentPerPost.length,
		};
	});

	const sortedTopPosts = unsortedTopPosts.sort((a, b) =>
		a.total_number_of_comments > b.total_number_of_comments ? -1 : 1
	);

	res.status(200).send({
		message: "Success",
		data: sortedTopPosts,
	});
});

// GET specific top post with id
app.get("/top-posts/:id", async (req, res) => {
	const { id } = req.params;
	const responseComments = await axios.get(`${jsonUrl}/comments`).catch(function (error) {
		console.log(error.toJSON());
	});
	const responsePosts = await axios.get(`${jsonUrl}/posts`).catch(function (error) {
		console.log(error.toJSON());
	});

	if (responseComments?.status != 200 || responsePosts?.status != 200) {
		return res.status(500).send({
			message: "Error",
		});
	}

	const comments = responseComments.data;
	const posts = responsePosts.data;

	const unsortedTopPosts = posts.map(post => {
		const commentPerPost = comments.filter(comment => comment.postId === post.id);
		return {
			post_id: post.id,
			post_title: post.title,
			post_body: post.body,
			total_number_of_comments: commentPerPost.length,
		};
	});

	const topPost = unsortedTopPosts.find(x => x.post_id === parseInt(id));

	res.status(200).send({
		message: "Success",
		data: topPost,
	});
});

// GET filtered comment
app.post("/filter-comment/", async (req, res) => {
	console.log(req.body);
	const { id, postId, name, email, body } = req.body;

	if (!id && !postId && !name && !email && !body) {
		return res.status(400).send({
			message: "Invalid request.",
		});
	}

	const response = await axios.get(`${jsonUrl}/comments`).catch(function (error) {
		console.log(error.toJSON());
	});

	if (response?.status != 200) {
		return res.status(500).send({
			message: "Error",
		});
	}

	const comments = response.data;
	const regex = new RegExp(/^(%).*\1$/);

	let tempComments = comments;

	if (!!id || !!postId || !!name || !!email || !!body) {
		if (!!id) tempComments = tempComments.filter(comment => comment.id === id);
		if (!!postId) tempComments = tempComments.filter(comment => comment.postId === postId);
		if (!!name) {
			if (regex.test(name)) {
				const ilike = name.substring(1, name.length - 1);
				tempComments = tempComments.filter(comment => comment.name.includes(ilike));
			} else tempComments = tempComments.filter(comment => comment.name === name);
		}
		if (!!email) {
			if (regex.test(email)) {
				const ilike = email.substring(1, email.length - 1);
				tempComments = tempComments.filter(comment => comment.email.includes(ilike));
			} else tempComments = tempComments.filter(comment => comment.email === email);
		}
		if (!!body) {
			if (regex.test(body)) {
				const ilike = email.substring(1, body.length - 1);
				tempComments = tempComments.filter(comment => comment.body.includes(ilike));
			} else tempComments = tempComments.filter(comment => comment.body === body);
		}
	}

	res.status(200).send({
		message: "Success",
		// data: "Filter Comments",
		data: tempComments,
	});
});

module.exports = app;
