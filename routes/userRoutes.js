const express=require('express')
const router = express.Router()
const userController =require('../controller/userController')
const jwtMiddleware=require('../middleware/jwtMiddleware')
const messageController=require('../controller/messageController')
const groupController =require('../controller/groupController')

// ================= User Routes =================
router.post('/signup', userController.signUpController);
router.post('/login', userController.logInController);
router.post('/logout', userController.logOutController);

// ================= Profile Routes ==============
router.put('/update-profile', jwtMiddleware, userController.updateProfileController);
router.get('/check-auth', jwtMiddleware, userController.checkAuthentication);

// ================= Messaging Routes ============
router.get("/users", jwtMiddleware, messageController.getUsersForSidebar);
router.get('/get-messages/:id', jwtMiddleware, messageController.getMessages);
router.post('/send-messages/:id', jwtMiddleware, messageController.sendMessages);

// ================= Group Routes ================
router.post('/add-group', jwtMiddleware, groupController.addGroupController);
router.get('/get-groups', jwtMiddleware, groupController.getGroupController);
router.get('/get-groupMessage/:groupId', jwtMiddleware, groupController.getGroupMessagesController);
router.post('/send-groupMessage/:groupId', jwtMiddleware, groupController.sendMessageGroupController);

module.exports=router