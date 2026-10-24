import mongoose, { Schema } from "mongoose";



const cardSchema = new Schema({
    cardDesc:{
        type:String,
    },
    mark:{
        type:String,
        default:"incomplete"
    }
},{ timestamps:false})


const listSchema = new Schema({
    listname:{
        type:String,
        require:true
    },
    cards:[cardSchema]
},{
    timestamps:false
})




const boardSchema = new Schema(
  {
    boardname: {
      type: String,
      require: true,
    },
    orgId: {
      type: mongoose.Types.ObjectId,
      ref: "ORG",
      require: true,
    },

    ownerId: {
      type: mongoose.Types.ObjectId,
      ref: "USER",
    },

    boardMembers: [
      {
        type: String,
      },
    ],

    boardList: [listSchema],
  },
  {
    timestamps: true,
  },
);

const BOARDS = mongoose.model("BOARDS", boardSchema);
export default BOARDS;
