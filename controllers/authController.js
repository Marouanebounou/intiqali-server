import User from "../models/User.js"
import bcrypt from 'bcrypt'


export const Login = async (req,res) =>{
    try {
        
    } catch (error) {
        console.log(error);
    }
}
export const SignUp = async (req,res) =>{
    try {
        const {firstName,lastName,email,phone,password} = req.body;
        const isistenUser = await User.findOne({email});
        const isNumberExist = await User.findOne({phone});
        if(isistenUser){
            res.status(400).json({message:"Email already exist"});
        }else if(isNumberExist){
            res.status(400).json({message:"Phone number already exist"});
        }
        else{
            const hashedPassword =  await bcrypt.hash(password , 10);
            const user = new User({
                firstName,
                lastName,
                email,
                phone,
                password:hashedPassword
            })
            await user.save();
            res.status(200).json({message:"User created successfully"});
        }

    } catch (error) {
        console.log(error);  
    }

}