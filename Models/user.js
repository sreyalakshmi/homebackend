const mongoose=require("mongoose")
const schema=mongoose.Schema(
    {
        "name":String,
        "email":String,
        "phone":String,
        "place":String,
        "password":String
        
    }
)
let usermodel=mongoose.model("uers",schema)
    module.exports={usermodel}