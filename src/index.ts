import express, { Express, Request, Response } from "express";
import contractsRoutes from './routes/contractsRoutes';
import tokensRoutes from './routes/tokensRoutes';
import searchRoutes from './routes/searchRoutes'
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';
dotenv.config();

const app: Express = express();
const port = process.env.PORT ;

const corsOptions = {
  origin: 'https://nftworld-iota.vercel.app/',
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const mongoURI:any = process.env.MONGO_URI ;
async function connectToDatabase() {
  try {
    await mongoose.connect(mongoURI);

    console.log('Connected to MongoDB database!');
  
  } catch (error:any) {
    console.error('MongoDB connection error:', error.message);
  }
}

connectToDatabase();
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use(express.json());

app.use('/contracts', contractsRoutes);
app.use('/tokens', tokensRoutes);
app.use('/search',searchRoutes)
 

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});