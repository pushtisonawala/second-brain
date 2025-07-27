import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { userModel,contentModel } from './db';
import {mid} from './middleware/mid'


dotenv.config();

const JWT_PASSWORD = process.env.JWT_PASSWORD!;
const MONGODB_URI = process.env.MONGODB_URI!;



const app = express();
app.use(express.json());


app.post("/api/v1/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userModel.create({ username, password });
    res.json({ message: "Signup successful", user });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: "Signup failed", details: error.message });
  }
});


app.post("/api/v1/signin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ username, password });

    if (!existingUser) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: existingUser._id }, JWT_PASSWORD, {
      expiresIn: "1h",
    });

    res.json({ message: "Signin successful", token });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: "Error logging in", details: error.message });
  }
});

app.post("/api/v1/content", mid,async (req, res) => {
 try{
  const link=req.body.link;
 const type=req.body.type;
 await contentModel.create({
  link,
  type,
  //@ts-ignore
  userId:req.userId,
  tags:[]
 })
 res.json("Content added");
}
catch(err){
  const error = err as Error;
  res.json("Content cant be added");


}
});
app.get("/api/v1/content",mid,async (req,res)=>{
 try{ //@ts-ignore
  const userId=req.userId
  const content = await contentModel.find({
    userId:userId
  })
  res.json({content})
}
catch(err){
  const error = err as Error;
  console.log("error getting content", error.message);
  res.status(500).json({ error: "Failed to get content", details: error.message });
}
})

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (err) {
    const error = err as Error;
    console.error(" Error connecting to DB or starting server:", error.message);
  }
}

startServer();
