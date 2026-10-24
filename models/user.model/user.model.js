import mongoose, { Schema } from "mongoose";


const userSchema = new Schema({
    username:{
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String
    }
}, {
    timestamps:true
});


const USER = mongoose.model('USER', userSchema);

export default USER;