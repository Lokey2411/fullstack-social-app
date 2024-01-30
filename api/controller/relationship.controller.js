import jwt from "jsonwebtoken";
import { db } from "../connect.js";
export const getRelationships = (req, res) => {
	const q = "SELECT followerUserId from relationships where followedUserId = ?";

	db.query(q, [req.query.followedUserId], (err, data) => {
		if (err) {
			console.log(err);
			return res.status(500).json(err);
		}
		return res.status(200).json(data.map((relationship) => relationship.followerUserId));
	});
};

export const addRelationship = (req, res) => {
	const token = req.cookies.accessToken;
	if (!token) return res.status(401).json("Not logged in");
	jwt.verify(token, "secretkey", (err, userInfo) => {
		if (err) return res.status(403).json("Token invalid");
		const q = "INSERT INTO `relationships` (`followerUserId`,  `followedUserId`) VALUES (?)";
		const values = [userInfo.id, req.body.userId];
		db.query(q, [values], (err, data) => {
			if (err) {
				console.log(err);
				return res.status(500).json(err);
			}
			return res.status(200).json("following");
		});
	});
};

export const deleteRelationship = (req, res) => {
	const token = req.cookies.accessToken;
	if (!token) return res.status(401).json("Not logged in");
	jwt.verify(token, "secretkey", (err, userInfo) => {
		if (err) return res.status(403).json("Token invalid");
		const q = "Delete from relationships where `followerUserId` = ? AND `followedUserId` = ?";
		db.query(q, [userInfo.id, req.query.userId], (err, data) => {
			if (err) {
				console.log(err);
				return res.status(500).json(err);
			}
			return res.status(200).json("Unfollowed");
		});
	});
};
