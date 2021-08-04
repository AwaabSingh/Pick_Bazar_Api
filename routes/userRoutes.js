import express from 'express';
import { registerUser, authUser,getUserProfile, updateUserProfile, getUsers, delUser,getUserById, updateUser } from '../controller/userController.js';
import { protect, authorize } from '../middleware/auth.js'
const router = express.Router()

router.route('/').post(registerUser).get(protect, authorize('admin'), getUsers)
router.route('/login').post(authUser)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)
router.route('/:id')
.delete(protect, authorize('admin'), delUser)
.get(protect, authorize('admin'), getUserById)
.put(protect,authorize('admin'), updateUser)

export default router