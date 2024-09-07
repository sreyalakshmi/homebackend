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
let registermodel=mongoose.model("registers",schema)
    module.exports={registermodel}