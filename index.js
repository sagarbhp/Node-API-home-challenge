const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")


//getting a deprication warning from mongoose so adding this.
mongoose.set("useCreateIndex", true);
// -----
const {mongoUrl} = require("./keys")
const PORT =3000

// setting up express 
const app = express()


// importing mongoose model from moddels folder
require("./models/user")


//importing authRoute which handles all the requests//
const authRoutes = require("./routes/authRouter")
app.use(bodyParser.json())
app.use(authRoutes)


// Connecting to Atlas using mongoose
mongoose.connect(mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true})

//checking if successfully connected to DB or handling error
const db = mongoose.connection
db.on("error", (err)=>{
    console.log("Couldn't connect to Atlas", err)
})
db.on("connected", ()=>{
    console.log("Successfully connected to Atlas")
})


// Starting server in localhost or heroku port
app.listen(process.env.PORT || PORT ,()=>{
    console.log("Server is online.")
})