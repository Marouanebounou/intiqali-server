import Router from "express";
import { finishprofile , finishProffetionel, setProfile, setCover } from "../controllers/finishProfileController.js";
import uploade, { flexibleUpload } from "../config/uploade.js";

const router = Router();

// Debug middleware to log request details
const debugRequest = (req, res, next) => {
  console.log("=== Request Debug Info ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Headers:", req.headers);
  console.log("Body fields:", Object.keys(req.body || {}));
  if (req.files) {
    console.log("Files:", req.files.map(f => ({ fieldname: f.fieldname, originalname: f.originalname, mimetype: f.mimetype })));
  }
  console.log("========================");
  next();
};

router.post('/finishProfile/:id',finishprofile)
router.post('/finishProfetionellfields/:id',finishProffetionel)
router.put('/profileimage/:id' , debugRequest, flexibleUpload, setProfile)
router.get('/profileimage/:id' ,setProfile)
router.put('/coverimage/:id', debugRequest, flexibleUpload, setCover)
router.get('/coverimage/:id',setCover)
export default router