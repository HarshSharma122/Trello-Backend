import mongoose, { Schema } from "mongoose";


const orgSchema = new Schema({
   orgname:{
        type:String,
        require:true
    },
    orgDesc:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    ownerId:{
        type:mongoose.Types.ObjectId,
        ref:"USER",
        require:true
    }
}, {
    timestamps:true
});


const ORG = mongoose.model('ORG', orgSchema);
export default ORG;