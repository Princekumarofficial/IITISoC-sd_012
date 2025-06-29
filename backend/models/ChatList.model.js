import mongoose , {Schema} from "mongoose" ;

const ChatListSchema = new Schema({
    userID :{
        type : String,
    },
    username: { 
        type: String,
         required: true 
        },
    avatar : {
        type : String ,
        required : true ,
        default : "/profile.jpg"
    },
    email : {
        type : String ,
    },
    isOnline : {
        type : Boolean,
    },
    isPinned: { type: Boolean, default: false },
    //  participantsName: [String],
    //  participantsID: [String],
     type: { type: String, enum: ["direct", "group"], default: "direct" },
   
} , {timestamps : true});
const ChatList = mongoose.model("ChatList" ,ChatListSchema)
export default ChatList ;