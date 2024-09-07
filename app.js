const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const{usermodel}=require("./Models/user")
const { loginModel } = require("./Models/admin")


const app=express()
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb+srv://sreya:sreya123@cluster0.rk6cqoj.mongodb.net/homeservicedb?retryWrites=true&w=majority&appName=Cluster0")

const generateHashedPassword=async(password)=>{
    const salt=await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)
}
app.post("/signup",async(req,res)=>{
    let input=req.body
    let hashedPassword=await generateHashedPassword(input.password)
    console.log(hashedPassword)
    input.password=hashedPassword
    let user=new usermodel(input)
    user.save()
    console.log(user)
    res.json({"status":"success"})
})
app.post("/signin",(req,res)=>{
    let input=req.body
    usermodel.find({"email":req.body.email}).then(
     (response)=>{
         if (response.length>0) {
             let dbPassword=response[0].password
             console.log(dbPassword)
             bcrypt.compare(input.password,dbPassword,(error,isMatch)=>{
                 if (isMatch) {
                    jwt.sign({email:input.email},"home-app",{expiresIn:"1d"},
                    (error,token)=>{
                     if (error) {
                         res.json({"status":"unable to create token"})
                     } else {
                         res.json({"status":"success","userid":response[0]._id,"token":token})
                     }
                    }
                 )
                 } else {
                     res.json({"status":"incorrect"})
                 }
             })
             
         } else {
             res.json({"status":"user not found"})
         }
         }
    ).catch()
 })
 app.post("/adminsignUp",(req,res)=>{
    let input=req.body
    let hashedpassword=bcrypt.hashSync(input.password,12)
    input.password=hashedpassword
    console.log(input)
    let result=new loginModel(input)
    result.save()
    res.json({"status":"success"})
})
app.post("/adminsignin",(req,res)=>{
    let input=req.body
    let result=loginModel.find({username:input.username}).then(
        (response)=>{
            if (response.length>0) {
                const validator=bcrypt.compareSync(input.password,response[0].password)
                if(validator)
                {
                    jwt.sign({email:input.username},"home-app",{expiresIn:"1d"},
                    (error,token)=>{
                        if (error) {
                            res.json({"status":"Token Creation Failed"})
                        } else {
                            res.json({"status":"success","token":token})
                        }
                    })
                }else
                {
                    res.json({"status":"Wrong Password"})
                }
            } else {
                res.json({"status":"Invalid Authentication"}) 
            }
        }
    ).catch()
})
app.listen(8080,()=>{
    console.log("server started")
})