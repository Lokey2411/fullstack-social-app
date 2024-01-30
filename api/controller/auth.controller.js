import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const login = (req, res) => {
	const q = "Select * from users where username = ?";
	console.log(req.body);
	db.query(q, [req.body.username], (err, data) => {
		if (err) return res.status(500).json(err);
		console.log(data);
		if (data.length === 0) return res.status(500).json("User not found");
		const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);
		if (!checkPassword) return res.status(400).json("Wrong username or password");
		const token = jwt.sign({ id: data[0].id }, "secretkey");
		const { password, ...dbData } = data[0];
		res.cookie("accessToken", token, {
			httpOnly: true,
		})
			.status(200)
			.json(dbData);
	});
};
export const register = (req, res) => {
	//CHECK IF USER DEFINED

	const q = "Select * from users where username = ?";
	db.query(q, [req.body.username], (err, data) => {
		if (err) {
			console.log(err);
			return res.status(500).json(err);
		}
		if (data.length !== 0) return res.status(409).json("User has already exists!");
		//Hash the password
		const salt = bcrypt.genSaltSync(10);
		//CHECK IF PASSWORD IS CORRECT
		const hashPassword = bcrypt.hashSync(req.body.password, salt);
		//CREATE NEW USER
		const q = "INSERT INTO `users` ( `username`, `email`, `password` ,`name`) VALUES (?)";
		const values = [req.body.username, req.body.email, hashPassword, req.body.name];
		db.query(q, values, (err, data) => {
			if (err) {
				console.log(err);
				return res.status(500).json(err);
			}
			return res.status(200).json("User has been created");
		});
	});
};
export const logout = (req, res) => {
	res.clearCookie({
		secure: true,
		saneSite: "none",
	})
		.status(200)
		.json("User has logged out");
};
