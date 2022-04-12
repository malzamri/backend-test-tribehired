const express = require("express");
const app = express();
const axios = require("axios");

// GET comments
app.get("/comments", async (req, res) => {
	const response = await axios.get(`https://jsonplaceholder.typicode.com${req.url}`);

	if (response?.status != 200) {
		return res.status(500).send({
			message: "Error",
			data: "Internal Server Error",
		});
	}

	res.status(200).send({
		message: "Success",
		data: response?.data,
	});
});

// GET filtered comments
app.get("/comments", async (req, res) => {
	const response = await axios.get(`https://jsonplaceholder.typicode.com${req.url}`);

	if (response?.status != 200) {
		return res.status(500).send({
			message: "Error",
			data: "Internal Server Error",
		});
	}

	res.status(200).send({
		message: "Success",
		data: response?.data,
	});
});

// GET posts
app.get("/posts", async (req, res) => {
	const response = await axios.get(`https://jsonplaceholder.typicode.com${req.url}`);

	if (!response?.data) {
		return res.status(500).send({
			message: "Error",
			data: "Internal Server Error",
		});
	}

	res.status(200).send({
		message: "Success",
		data: response?.data,
	});
});

// GET top posts
app.get("/top-posts", async (req, res) => {
	const responseComments = await axios.get(`https://jsonplaceholder.typicode.com/comments`);
	const responsePosts = await axios.get(`https://jsonplaceholder.typicode.com/posts`);

	if (!responseComments?.data || !responsePosts?.data) {
		return res.status(500).send({
			message: "Error",
			data: "Internal Server Error",
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

module.exports = app;
