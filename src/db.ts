import {model,Schema} from 'mongoose'
import mongoose from 'mongoose'
const userSchema=new Schema({
    username:String,
    password:String
})

export const userModel=model("User",userSchema);
const contentSchema=new Schema({
    title:String,
    link:String,
    tags:[{type:mongoose.Types.ObjectId,ref:'Tag'}],
    userId:[{type:mongoose.Types.ObjectId,ref:'User',required:true}]
})
export const contentModel=model("Content",contentSchema);