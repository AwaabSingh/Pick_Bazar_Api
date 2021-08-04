import express from 'express'
import { getProducts, getProductById, deleteProduct, createProduct, updateProduct } from '../controller/productControllers.js'
import  {protect, authorize}  from '../middleware/auth.js'
const router = express.Router();

router.route('/').get( getProducts).post(protect,  authorize('publisher', 'admin') , createProduct)
router.route('/:id').get( getProductById).delete(protect,deleteProduct).put(protect,authorize('publisher', 'admin'), updateProduct)

export default router