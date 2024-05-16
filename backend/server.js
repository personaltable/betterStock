import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"; 
const PORT = process.env.PORT || 5555;
import userRoutes from './routes/userRoutes.js'
import connectDB from "./config/db.js";

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(cookieParser())

app.use('/api/users', userRoutes)

app.get('/' , (req, res) => res.send('Server is ready'))

app.use(notFound);
app.use(errorHandler);

app.listen(PORT,() => console.log(`Server started one port ${PORT}`))