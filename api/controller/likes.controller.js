import jwt from "jsonwebtoken";
import { db } from "../connect.js";
export const getLikes = (req, res) => {
	const q = "SELECT userId from likes where postId = ?";

	db.query(q, [req.query.postId], (err, data) => {
		if (err) {
			console.log(err);
			return res.status(500).json(err);
		}
		return res.status(200).json(data.map((like) => like.userId));
	});
};

export const addLike = (req, res) => {
	const token = req.cookies.accessToken;
	if (!token) return res.status(401).json("Not logged in");
	jwt.verify(token, "secretkey", (err, userInfo) => {
		if (err) return res.status(403).json("Token invalid");
		const q = "INSERT INTO `likes` (`userId`,  `postId`) VALUES (?)";
		const values = [userInfo.id, req.body.postId];
		db.query(q, [values], (err, data) => {
			if (err) {
				console.log(err);
				return res.status(500).json(err);
			}
			return res.status(200).json("Post has been liked");
		});
	});
};

export const deleteLike = (req, res) => {
	const token = req.cookies.accessToken;
	if (!token) return res.status(401).json("Not logged in");
	jwt.verify(token, "secretkey", (err, userInfo) => {
		if (err) return res.status(403).json("Token invalid");
		const q = "Delete from likes where `userId` = ? AND `postId` = ?";
		db.query(q, [userInfo.id, req.query.postId], (err, data) => {
			if (err) {
				console.log(err);
				return res.status(500).json(err);
			}
			return res.status(200).json("Post has been disliked");
		});
	});
};
