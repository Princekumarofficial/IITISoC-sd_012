import mongoose , {Schema} from "mongoose" ;

const ChatSchema = new Schema({
    sender: { 
        type: String,
         required: true 
        },
    receiver : {
        type : String ,
    },
    date : {
        type : String ,
        required : true ,
    },
    text : {
        type : String ,
        required : true ,
    },
   
} , {timestamps : true});
const Chat = mongoose.model("Chat" ,ChatSchema)
export default Chat ;