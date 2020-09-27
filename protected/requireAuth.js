const jwt = require("jsonwebtoken")
const mongoose = require ("mongoose")
const User = mongoose.model("User")
const {jwtKey} = require("../keys")

module.exports = (req, res, next)=>{
    const { authorization } = req.headers
    //Check if there is authorization in header
    if(!authorization){
        return res.status(401).send({error:"Must be logged in to access this page"})
    }

    //retriving just the token value from header authorization
    const token =authorization.replace("Bearer ", "")
    //verifying the token with verify method
    jwt.verify(token,jwtKey, async (err, payload)=>{
        
        if(err){
            return res.status(401).send({error:"Authorization failed. Please log in"})
        }

        //if token is authorized then retriving userId from payload
        const {userId} = payload
        // Now we will find the user in our database with the id
        const user = await User.findById(userId)
        req.user=user

        next();
    })
}