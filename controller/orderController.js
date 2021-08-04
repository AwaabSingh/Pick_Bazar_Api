import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'

// @desc    Create new order
// @route   POST /api/orders
// @access  Private admin & publisher
const addOrderItems = asyncHandler(async (req, res) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    } = req.body
  
    if (orderItems && orderItems.length === 0) {
      res.status(400)
      throw new Error('No order items')
    } else {
      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
      })
  
      const createdOrder = await order.save()
  
      res.status(201).json({
          success: true,
          data:createdOrder
        })
    }
  })


// @desc    Get orders
// @route   Get /api/orders
// @access  Private/admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name')
    res.status(200).json({
                success: true,
                count: orders.length,
                data: orders
            })
  })
  


// @desc    Get order by ID
// @route   Get /api/orders/:id
// @access  Private 
const getOrder = asyncHandler( async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if(order) {
        res.status(200).json({
            success:true,
            data: order
        })
    }else {
        res.status(400)
        throw new Error ('Order is not found')
    }


})


  
 
  
  // @desc    Get logged in user orders
  // @route   GET /api/orders/myorders
  // @access  Private
  const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
    res.status(200).json({
        success:true,
        data: orders
    })
  })
  
export { addOrderItems, getOrder, getOrders,  
    getMyOrders ,
}