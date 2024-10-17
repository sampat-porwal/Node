import express from 'express';
const router = express.Router();
import UserController from '../controllers/userController.js';
import checkUserAuth from '../middlewares/auth-middleware.js';

// ROute Level Middleware - To Protect Route
router.use('/changepassword', checkUserAuth)
router.use('/changeprofile', checkUserAuth)
router.use('/imageupload', checkUserAuth)
router.use('/imagedelete', checkUserAuth)
router.use('/getusers', checkUserAuth)


router.post('/register', UserController.UserRegistration)
router.post('/login', UserController.UserLogin)

// Protected Routes
router.post('/changepassword', UserController.changePassword)
router.post('/changeprofile', UserController.changeProfile)
router.patch('/imageupload', UserController.imageupload)
router.patch('/imagedelete', UserController.imagedelete)
router.get('/getusers', UserController.getList)

export default router