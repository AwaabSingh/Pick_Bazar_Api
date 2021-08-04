import jwt from 'jsonwebtoken'
import asynHandeler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asynHandeler(async (req,res,next)  => {
    let token 

    if(
        req.headers.authorization 
        && req.headers.authorization.startsWith('Bearer')
        ) {
      try {
          token = req.headers.authorization.split(' ')[1]

          const decoded = jwt.verify(token, process.env.JWT_SECRET)

          req.user = await User.findById(decoded.id).select('-password')

          next()

      } catch (error) {
          console.log(error);
          res.status(401)
          throw new Error('Not authrized,no token')
      }
   }

   if(!token) {
       res.status(401)
       throw new Error('Not authrized,no token')
   }

   
})


const authorize = (...roles) => {
   return (req, res, next) => {
     if (!roles.includes(req.user.role)) {
       return next(
          new Error (
           `User role ${req.user.role} is not authorized to access this route`,
           403
         )
       );
     }
     next();
   };
 };

export { protect, authorize};