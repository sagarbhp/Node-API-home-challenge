// Creating user schema to save in Database


const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true,
    },

    password:{
        type:String,
        required:true,
    },
    adress:{
        type:String,
        required:true
    },
})

/// Hashing the password before saving --> should always be done-
//  -when a new user is registered
userSchema.pre("save", function(next){
    const user = this
    //Don't hash if it's already modified --> hashed 
    if(!user.isModified("password")){
        return next()
    }

    bcrypt.genSalt(10 ,(err, salt)=>{
        if(err){
            return next(err)
        }

        bcrypt.hash(user.password, salt, (err, hash)=>{
            if(err){
                return next(err)
            }
            user.password = hash
            next()
        })
    })
})


//comparing login password with stored password in Database
//this will be executed when user sends a post request through login route
userSchema.methods.comparePassword = function (loginPassword){
    const user = this
    return new Promise((resolve, reject)=>{
        bcrypt.compare(loginPassword, user.password,(err,isMatch)=>{
            if(err){
                return reject(err)
            }
            if(!isMatch){
                return reject(err)
            }
            resolve(true)
        })
    })
}

mongoose.model("User", userSchema)