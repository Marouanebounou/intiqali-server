import multer from "multer";

const storage = multer.diskStorage({})
const uploade = multer({storage})

export default uploade