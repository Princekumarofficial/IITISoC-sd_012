import mongoose , {Schema} from "mongoose" ;

const MeetingChatSchema = new Schema({
    meetingid : {
        type: String,
        required : true ,
        unique : true ,
    },
    sender: { 
        type: String,
         required: true 
        },
    receiver : {
        type : String ,
        required : true ,
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
const MeetingChat = mongoose.model("MeetingChat" ,MeetingChatSchema)
export default MeetingChat ;