import mongoose , {Schema} from "mongoose" ;

const ChatListSchema = new Schema({

    id : {
        type : String ,
        required : true , 
    },
    name: { 
        type: String,
         required: true 
        },
    avatar : {
        type : String ,
        required : true ,
        default : "/profile.jpg"
    },
    lastMessage : {
        type : String ,
        
    },
    lastMessageTime : {
        type : String ,
      
    },
    unreadcount : {
        type : Number ,
    },
    isGroup : {
        type : Boolean,
    },
    isOnline : {
        type : Boolean,
    },
    participants : {
        type : String[] , 
    },
    type  : {
        type : String ,
    }
   
} , {timestamps : true});
const ChatList = mongoose.model("ChatList" ,ChatListSchema)
export default ChatList ;