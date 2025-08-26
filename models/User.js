import { url } from "inspector";
import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone:{
        type: Number,
        default: null,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: true,
    },
    sexe:{
        type: String,
        enum: ['male', 'female']
    },
    adress:{
        type: String,
        default: "Rabat, Morocco"
    },
    ministère: {
        type: String,
        default: "Ministère inconnu"
    },
    département:{
        type: String,
        default: "Département inconnu"
    },
    fonction: {
        type: String,
        default: "Fonction non définie"
    },
    grade: {
        type: String,
        default: "Grade non défini"
    },
    echelle: {
        type: String,
        default: "Échelle non définie"
    },
    ville: {
        type: String,
        default: "Ville inconnue"
    },
    etablissement: {
        type: String,
        default: "Établissement inconnu"
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    isVerified: { 
        type: Boolean,
        default: false 
    },
    verificationToken: { 
        type: String,
        default: null
    },
    birthDate: {
        type: Date,
        default: null
    },
    birthplace: {
        type: String,
        default: "Lieu inconnu"
    },
    active:{
        type: Boolean,
        default: true
    },
    profileImage:{
        type: String,
        default: `https://res.cloudinary.com/dx6x9d8p2/image/upload/v1756153972/default-profile-account-unknown_kckvjg.png`
    },
    coverImage: {
        type: String,
        default: `https://res.cloudinary.com/dx6x9d8p2/image/upload/v1756154031/default_image_ypatak.png`
    },
    bio: {
        type: String,
        default: " "
    },


},{timestamps: true})

export default mongoose.model('User', UserSchema)
