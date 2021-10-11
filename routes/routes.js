var express =require("express");
const {getBalance, sendTransaction} =require("../controllers/sendTransaction");
const {register, login} =require("../controllers/register");
var router=express.Router();


router.get("/",async(req,res)=>{
    res.send("wel")
})

router.post("/register",register);
router.post("/login",login);
router.post("/balance",getBalance);
router.post("/sendtrx",sendTransaction);

module.exports=router;

