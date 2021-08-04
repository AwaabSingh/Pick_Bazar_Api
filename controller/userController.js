import generateToken from '../utils/generateToken.js'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

// @desc Register a new users 
// @route POST /api/v1/users
// @access Public
const registerUser = asyncHandler( async (req, res, next) => {
    const { name, email, password, role } = req.body
  
    const userExists = await User.findOne({ email })
  
    if (userExists) {
      res.status(400)
      throw new Error('User already exists')
    }
  
    const user = await User.create({
      name,
      email,
      password,
      role
    })
  

    if(user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }

})


// @desc Auth user
// @route POST /api/v1/users/login
// @access Public
const authUser = asyncHandler( async (req, res, next) => {
    const { email ,password} = req.body
    
    const user = await User.findOne({ email })

    if( user &&( await user.matchPassword(password))) {
      res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
          token: generateToken(user._id)
      })
    }else {
        res.status(401)
        throw new Error('Invaild email or password ')
    }
})

// @desc Get user profile
// @route Get /api/v1/users/login
// @access Private
const getUserProfile = asyncHandler( async (req, res, next) => {
    const user = await User.findById(req.user._id)


    if(user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        })
    } else {
        res.status(404)
        throw new Error ('User not found')
    }
    
    
})

// @desc Get user profile
// @route POST /api/v1/users/profile
// @access Private
const updateUserProfile = asyncHandler( async (req, res, next) => {
    const user = await User.findById(req.user._id)


    if(user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if(req.body.password) {
            user.password  = req.body.password
        }

        const  updatedUser = await user.save()

        
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id)
        })

    } else {
        res.status(404)
        throw new Error ('User not found')
    }
    
    
})

// @desc Get all user 
// @route GET /api/v1/users
// @access Private/Admin
const getUsers = asyncHandler( async (req, res, next) => {
    let query;

    const reqQuery = { ...query }

    const removeField = ['select']

    removeField.forEach(param => delete reqQuery[param])

    let queryStr = JSON.stringify(reqQuery)

    query = User.find(JSON.parse(queryStr))

    if(req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields)
    }
    
    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.select(sortBy)
    } else {
        query = query.sort('-createdAt')
    }

     // Pgination
     const page = parseInt(req.query.page, 10) || 1;
     const limit = parseInt(req.query.limit, 10) || 10;
     const startIndex = (page - 1) * limit
     const endtIndex = page * limit
     const total = await User.countDocuments();
     
     query = query.skip(startIndex).limit(limit)
    const users = await query

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
        count: users.length,
        pagination,
        data: users
    })

})

// @desc Delete a user 
// @route DELETE /api/v1/users/:id
// @access Private/Admin
const delUser = asyncHandler( async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if(user) {
        await user.remove()
        res.status(200).json({
            success: true,
            msg: 'User Removed Successully',
            data: {}
        })
    } else {
        res.status(400)
        throw new Error('User not found')
    }
})

// @desc Get a user 
// @route GET /api/v1/users/:id
// @access Private/Admin
const getUserById = asyncHandler( async (req, res, next) => {
    const user = await User.findById(req.params.id).select('-password')

    if(user) {
        res.status(200).json({
            success: true,
            count: user.length,
            data: user
        })
    }else {
        res.status(400)
        throw new Error('User is not found')
    }
   

})

// @desc Update a user 
// @route PUT /api/v1/users/:id
// @access Private/Admin
const updateUser = asyncHandler( async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if(user) {
        user.name= req.body.name || user.name,
        user.email = req.body.email || user.email,
        user.role = req.body.role || user.role

        const updatedInfo = await user.save()

        res.status(200).json({
            _id: updatedInfo._id,
            name: updatedInfo.name,
            email: updatedInfo.email,
            role: updatedInfo.role,
            token: generateToken(updatedInfo._id)
        })
    }

    
})    

export { registerUser, authUser, getUserProfile, updateUserProfile, getUsers, delUser, getUserById, updateUser }