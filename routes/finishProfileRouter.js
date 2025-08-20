import Router from "express";
import { finishprofile , finishProffetionel } from "../controllers/finishProfileController.js";

const router = Router();

router.post('/finishProfile/:id',finishprofile)
router.post('/finishProfetionellfields/:id',finishProffetionel)

export default router