const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const{registermodel}=require("./models/register")

const app=express()
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb+srv://sreya:sreya123@cluster0.rk6cqoj.mongodb.net/homeservicedb?retryWrites=true&w=majority&appName=Cluster0")

app.post("/signup",async(req,res)=>{
    let input=req.body
    let hashedPassword=await generateHashedPassword(input.password)
    console.log(hashedPassword)
    input.password=hashedPassword
    let register=new registermodel(input)
    register.save()
    console.log(register)
    res.json({"status":"success"})
})

app.listen(8080,()=>{
    console.log("server started")
})