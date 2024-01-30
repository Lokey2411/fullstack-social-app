import jwt from "jsonwebtoken";
import { db } from "../connect.js";
import moment from "moment";

export const getPosts = (req, res) => {
	const userId = req.query.userId;
	const token = req.cookies.accessToken;
	if (!token) return res.status(401).json("Not logged in");
	jwt.verify(token, "secretkey", (err, userInfo) => {
		if (err) return res.status(403).json("Token invalid");

		const q =
			userId != "undefined"
				? `Select DISTINCT p.*,u.id As userId, name, profilePic FROM posts AS p 
			JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ?
			ORDER BY p.createdAt DESC`
				: `Select DISTINCT p.*,u.id As userId, name, profilePic FROM posts AS p 
			JOIN users AS u ON (u.id = p.userId) 
			JOIN relationships AS r ON (p.userId=r.followedUserId AND r.followerUserId=? or p.userId = ?)
			ORDER BY p.createdAt DESC`;
		const values = userId != "undefined" ? [userId] : [userInfo.id, userInfo.id];
		db.query(q, values, (err, data) => {
			if (err) {
				console.log(err);
				return res.status(500).json(err);
			}
			return res.status(200).json(data);
		});
	});
};

export const addPost = (req, res) => {
	const token = req.cookies.accessToken;
	if (!token) return res.status(401).json("Not logged in");
	jwt.verify(token, "secretkey", (err, userInfo) => {
		if (err) return res.status(403).json("Token invalid");
		const q = "INSERT INTO `posts` (`description`, `img`,  `createdAt`,`userId`) VALUES (?)";
		const values = [req.body.description, req.body.img, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), userInfo.id];
		db.query(q, [values], (err, data) => {
			if (err) {
				console.log(err);
				return res.status(500).json(err);
			}
			return res.status(200).json("Post has been created");
		});
	});
};

export const deletePost = (req, res) => {
	const token = req.cookies.accessToken;
	if (!token) return res.status(401).json("Not logged in");
	jwt.verify(token, "secretkey", (err, userInfo) => {
		if (err) return res.status(403).json("Token invalid");
		// delete comment
		const q = "DELETE FROM comments where `postId`=?";
		db.query(q, [parseInt(req.params.id)], (err, data) => {
			if (err) {
				console.log(err);
				return res.status(500).json(err);
			}
			//delete like from post
			const q = "DELETE FROM likes where `postId`=?";
			db.query(q, [parseInt(req.params.id)], (err, data) => {
				if (err) {
					console.log(err);
					return res.status(500).json(err);
				}
				//delete post
				const q = "DELETE FROM posts where `id`=? and `userId`=?";
				db.query(q, [parseInt(req.params.id), userInfo.id], (err, data) => {
					if (err) {
						console.log(err);
						return res.status(500).json(err);
					}
					if (data.affectedRows > 0) {
						return res.status(200).json("Post has been deleted");
					}
					return res.status(403).json("You can delete only your post");
				});
			});
		});
	});
};
