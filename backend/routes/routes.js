import express from 'express';

import { authGoogle } from '../controllers/user.controller.js';
import { newChat , getAllChat } from '../controllers/Chat.controller.js';
import { newContactUs } from '../controllers/ContactUs.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.js';
import { updateProfile } from '../controllers/user.controller.js';
const router = express.Router();

// routes for signin
router.post('/google-auth' , authGoogle);
// update profile 
router.put("update-profile" , protectRoute ,upload.single('photo') , updateProfile)

//routes for chat 
router.post('/newChat',  newChat);
router.get('/chats',  getAllChat);



//routes for contactus
router.post('/contactUs' , newContactUs);

export default router;