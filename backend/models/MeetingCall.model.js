import mongoose , {Schema} from "mongoose" ;

const participantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  joinedAt: {
    type: Date,
    required: true,
  },
  leftAt: {
    type: Date,
    required: true,
  },
  emotions: [
    {
      type: String, // e.g., "happy", "neutral"
    },
  ],
});

const MeetingCallSchema = new Schema({
    meetingid : {
        type: String,
        required : true ,
        unique : true ,
    },
    name : {
        type : String , 
        required : true , 
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    participants: [participantSchema],
    
    
   
} , {timestamps : true});
const MeetingCall = mongoose.model("MeetingCall" ,MeetingCallSchema)
export default MeetingCall ;