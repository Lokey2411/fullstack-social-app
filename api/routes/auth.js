import Express from "express";
import { login, register, logout } from "../controller/auth.controller.js";
const router = Express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);

export default router;
