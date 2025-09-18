import User  from "../models/User.js";

export const userSearch = async (req,res) =>{
    try {
        const query = req.query.p || ""
        const users = await User.find({
      $or: [
        { usfirstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } }
      ]
    }).select("firstName lastName profileImage");
    res.json(users);
    } catch (error) {
        console.log(error);
    }
}