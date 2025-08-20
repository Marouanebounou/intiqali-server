import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        default: "John"
    },
    lastName: {
        type: String,
        required: true,
        default: "Doe"
    },
    email: {
        type: String,
        required: true,
        unique: true,
        default: "example@example.com"
    },
    phone:{
        type: Number,
        required: true,
        unique: true,
        default: 212600000000
    },
    password: {
        type: String,
        required: true,
        default: "password123"
    },
    sexe:{
        type: String,
        enum: ['homme', 'femme'],
        default: 'homme'
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
    }

},{timestamps: true})

export default mongoose.model('User', UserSchema)
