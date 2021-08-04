import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        requied: true
    },
    image: {
        type: String,
        required: true
    },
    brand :{
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0
    }
},{
    timestamps: true
}
)

const Product = mongoose.model('Product', ProductSchema)

export default Product;