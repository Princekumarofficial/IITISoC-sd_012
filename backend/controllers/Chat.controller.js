import Chat from "../models/Chat.model.js";

export const newChat = async (request, response) => {
    try {
        const chat = await new Chat(request.body);
        chat.save();

        response.status(200).json('chat sent successfully');
    } catch (error) {
        response.status(500).json(error);
    }
}

export const getAllChat = async (request, response) => {
    try {
       
        const   chat = await Chat.find({});
     
        response.status(200).json(chat);
    } catch (error) {
        response.status(500).json(error)
    }
};