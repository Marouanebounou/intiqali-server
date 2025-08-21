import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ message: "Authorization token required" });
    }
    const token = authorization.split(" ")[1];
    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(id);
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Request is not authorized" });
    }
};