import User from "../models/User.js";

export const finishprofile = async(req,res)=>{
    try {
        const {adress , birthdate , birthplace} = req.body
        const user = await User.findById(req.params.id);
        user.birthDate = birthdate
        user.birthplace = birthplace
        user.adress = adress
        await user.save()
        res.status(200).json({message:"Profile completed succesfuly"})
    } catch (error) {
        console.log(error);
    }
}

export const finishProffetionel = async(req , res )=>{
    try {
        const {ministère , département , fonction , grade , echelle , ville , etablissement} = req.body
        const user = await User.findById(req.params.id);
        user.ministère = ministère
        user.département = département
        user.fonction = fonction
        user.grade = grade
        user.echelle = echelle
        user.ville = ville
        user.etablissement = etablissement
        await user.save()
        res.status(200).json({message:"Profetionell fileds completed succesfuly"})
    } catch (error) {
        console.log(error);         
    }
}