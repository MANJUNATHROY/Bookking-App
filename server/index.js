import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors'
import authRoute from './routes/auth.js'
import usersRoute from './routes/users.js'
import hotelsRoute from './routes/hotels.js'
import roomsRoute from './routes/rooms.js'
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

const app = express()
dotenv.config()
app.use(cookieParser())
app.use(express.json())
app.use(bodyParser.json({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("connected to mongodb")
    } catch (error) {
        throw error;
    }
}
mongoose.connection.on("disconnected", () => {
    console.log("mongodb disconnected")
})

app.get("/", (req, res) => {
    res.send("hello !!")
})




app.use("/server/auth", authRoute)
app.use("/server/users", usersRoute)
app.use("/server/hotels", hotelsRoute)
app.use("/server/rooms", roomsRoute)

app.use((err,req,res,next)=>{
    const errorStatus=err.status||500
    const errorMessage=err.message||"something went wrong"
    return res.status(errorStatus).json({
        success:false,
        status:errorStatus,
        message:errorMessage,
        stack:err.stack,
    })
})

app.listen(8800, () => {
    connect()
    console.log("connected to backend")
})