import express from "express";
import { userSearch } from "../controllers/userControllers.js";
const router = express.Router();

router.get("/search", userSearch);

export default router;
