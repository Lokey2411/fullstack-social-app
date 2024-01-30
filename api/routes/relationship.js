import Express from "express";
import { getRelationships, addRelationship, deleteRelationship } from "../controller/relationship.controller.js";
const router = Express.Router();

router.get("/", getRelationships);
router.post("/", addRelationship);
router.delete("/", deleteRelationship);

export default router;
