import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost/Pick_Bazar", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex:true,
            useFindAndModify: false
        })
        console.log(`MongoDB Connected`.bgCyan.bold)
    } catch (error) {
        console.error(`Error: ${err.message}`.red.underline.bold);
        process.exit(1);
    }
}

export default connectDB;