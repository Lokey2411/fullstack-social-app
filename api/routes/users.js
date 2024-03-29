import Express from "express";
import { getUser, updateUser } from "../controller/users.controller.js";
const router = Express.Router();

router.get("/find/:userId", getUser);
router.put("/", updateUser);

export default router;
