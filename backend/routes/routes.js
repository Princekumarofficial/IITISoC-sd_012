import express from 'express';

import { authGoogle , updateProfile , checkAuth ,logout} from '../controllers/User.controller.js';

import { newContactUs } from '../controllers/ContactUs.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.js';
import { getUsersForSidebar ,saveuser } from '../controllers/ChatList.controller.js';
import { getMessages , sendMessage } from '../controllers/Chat.controller.js';
const router = express.Router();

// routes for signin
router.post('/google-auth' , authGoogle);
router.put("/updateProfile" , protectRoute ,upload.single('file') , updateProfile)

router.get("/check", protectRoute, checkAuth);
router.post("/logout" , logout);



// routes related to chat 
router.get("/chatlist" ,getUsersForSidebar);

router.post("/saveuser" , saveuser);
router.get("/create/:id", protectRoute, getMessages);

router.post("/send", protectRoute, sendMessage);


//routes for contactus
router.post('/contactUs' , newContactUs);

export default router;