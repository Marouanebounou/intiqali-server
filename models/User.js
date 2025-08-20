import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone:{
        type: Number,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    adress:{
        type: String
    },
    ministère: {
        type: String
    },
    département:{
        type: String
    },
    fonction: {
        type: String
    },
    grade: {
        type: String
    },
    echelle: {
        type: String
    },
    ville: {
        type: String
    },
    etablissement: {
        type: String
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }


},[{timestamps: true}])