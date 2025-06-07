const express =require('express')
const router =express.Router()
const adminMiddleware=require('../middleware/adminMiddleware')
const jwtMiddleware=require('../middleware/jwtMiddleware')

const adminController=require('../controller/adminController')

// ================= Admin Routes =================
router.get('/admin-groups',jwtMiddleware,adminMiddleware,adminController.getAllGroupController)
router.delete('/delete-group/:groupId',jwtMiddleware,adminMiddleware,adminController.removeGroupController)
router.delete('/delete-user/:userId',jwtMiddleware,adminMiddleware,adminController.removeUserController)



module.exports=router