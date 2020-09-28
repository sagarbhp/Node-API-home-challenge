const express = require("express")
const mongoose =require("mongoose")
const jwt = require("jsonwebtoken")
const {jwtKey} = require("../keys")
const requireAuth = require("../protected/requireAuth")

const router = express.Router()
//creating new User using mongoose userSchema
const User = mongoose.model("User");

//post request to register a new user. the callback function needs to
//be async because we are accessing our database
router.post("/register", async(req, res)=>{
    //destructuring the data from post request
    const {username, password, adress} = req.body
    /*now will see if we can add the new user in our database
    in this step the schema actually varifies if username is unique
    or any missing filed */
    try{
        const user = new User({username,password,adress})
        await user.save()
        //new user saved in database
        //now we send the jsonwebtoken in response to maintain login
        const token = jwt.sign({userId:user._id},jwtKey)
        res.send({token:token})

    }catch(err){
        return res.status(422).send({"error":"Could not register. username exists"})
    }

})


//similarly handling post request in the login route
router.post("/login", async (req, res)=>{
    const {username, password} = req.body;
    //handling err
    if(!username || !password){
        return res.status(422).send({"error":"must provide email and password"})
    }

    const user = await User.findOne({username})
    //User doesnot exist --> Throw err
    if(!user){
        return res.status(422).send({"error":"username not vaild"})
    }
    //user exists so compare password. check user.js for comparepassword method
    try{
        await user.comparePassword(password)
        //now we send the jsonwebtoken in response to maintain login
        const token = jwt.sign({userId:user._id},jwtKey)
        res.send({token:token})
    }catch(err){
        return res.status(422).send({"error":"Invalid password"})
        //note: All the error message should be kep same. keeping different
        //for testing.
    }

})


/// just for test
// router.get("/", (req,res)=>{
//   res.send({"message":"you came to the right location"})
// })
router.get("/", requireAuth,(req,res)=>{
    console.log(req.user)
    res.send( {"username":req.user.username,"adress":req.user.adress})
})

module.exports = router
