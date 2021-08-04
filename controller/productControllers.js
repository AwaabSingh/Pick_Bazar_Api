import express from 'express';
import asyncHandler from 'express-async-handler' 
import Product from '../models/productModel.js'


// @desc get all product
// @route GET /api/v1/products
// @access Public
const getProducts = asyncHandler ( async (req, res, next) => {
    let query;
    // copy req.query
    const reqQuery = { ...req.query}
    // Fields to exclude
    const removeFields = ['select','sort','page', 'limit']
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param])
    // Create query string
    let queryStr = JSON.stringify(reqQuery)
    // finiding resource
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
    
    query = Product.find(JSON.parse(queryStr))
    // select fields 
     if(req.query.select){
        // split to turn to an array and join to make a string
        const fields =req.query.select.split(',').join(' ');
       query = query.select(fields)
    }
    // sort
    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join('')
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdAt')
    }
    // Pgination
     const page = parseInt(req.query.page, 10) || 1;
     const limit = parseInt(req.query.limit, 10) || 10;
     const startIndex = (page - 1) * limit
     const endtIndex = page * limit
     const total = await Product.countDocuments();
     
     query = query.skip(startIndex).limit(limit)
     
     const products = await query

    //  pagination result
    const pagination = {}

    // Creating the next page
    if(endtIndex) {
        pagination.next = {
             page: page + 1,
             limit 
        }
    }
    // Creating the prev  page
    if(endtIndex) {
        pagination.prev = {
             page: page - 1,
             limit 
        }
    }
     
     res.status(200).json({
         success: true,
         cout: products.length,
         pagination,
         data: products  
        })
    })
   
// @desc get product by id
// @route GET /api/v1/products/:id
// @access Public
const getProductById = asyncHandler( async (req, res) => {
    const  product = await Product.findById(req.params.id)

    if(product) {
        res.status(200).json({
            success: true,
            data: product
        })
    }else {
        res.status(400)
        throw new Error('Product not Found')
    }
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
  
    if (product) {
      await product.remove()
      res.json({ 
          message: 'Product removed',
        data: {}
     })
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
  })
  
  // @desc    Create a product
  // @route   POST /api/products
  // @access  Private/Admin
  const createProduct = asyncHandler(async (req, res) => {
      const {name, price,  image, brand, category, countInStock, description} = req.body;
    const product = await Product.create({
        name, 
        user: req.user._id,
        price ,
        description,
        image,
        brand,
        category,
        countInStock
    })
  
    const createdProduct = await product.save()
  
    res.status(201).json({
        success: true,
        data: createdProduct
      })
   
    
    
  })
  
  // @desc    Update a product
  // @route   PUT /api/products/:id
  // @access  Private/Admin
  const updateProduct = asyncHandler(async (req, res) => {
    const {
      name,
      price,
      description,
      image,
      brand,
      category,
      countInStock,
    } = req.body
  
    const product = await Product.findById(req.params.id)
  
    if (product) {
      product.name = name
      product.price = price
      product.description = description
      product.image = image
      product.brand = brand
      product.category = category
      product.countInStock = countInStock
  
      const updatedProduct = await product.save()
      res.json(updatedProduct)
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
  })

export { getProducts, getProductById, deleteProduct, createProduct, updateProduct}