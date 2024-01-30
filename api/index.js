import Express, { application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

import userRouter from "./routes/users.js";
import postRouter from "./routes/posts.js";
import commentRouter from "./routes/comments.js";
import relationshipRouter from "./routes/relationship.js";
import likeRouter from "./routes/likes.js";
import authRouter from "./routes/auth.js";
const app = Express();

//middleware
app.use((req, res, next) => {
	// allow credential
	res.header("Access-Control-Allow-Credentials", true);
	next();
});
app.use(Express.json());
app.use(
	cors({
		origin: "http://localhost:3000", // allow port 3000 to post
	})
);
app.use(cookieParser());

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "../client/public/upload");
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + file.originalname);
	},
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
	const file = req.file;
	res.status(200).json(file.filename);
});

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/likes", likeRouter);
app.use("/api/auth", authRouter);
app.use("/api/relationship", relationshipRouter);

app.listen(8800, () => {
	console.log("Hello pe pe");
});
