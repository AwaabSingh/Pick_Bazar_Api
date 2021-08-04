import express from 'express'
import {protect } from '../middleware/auth.js'
import { addOrderItems, getOrder, getOrders, getMyOrders  } from '../controller/orderController.js'

const router = express.Router()

router.route('/').post(protect, addOrderItems).get(protect, getOrders)
router.route('/:id').get(protect, getOrder)
router.route('/myorders').get(protect, getMyOrders)

export default router;