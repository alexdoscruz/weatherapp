require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express')
const app = express()
const port = 3000
const path = require('path')

const bcrypt=require('bcrypt')
const bodyParser=require('express').json
const { error } =require('console')

//user model in mongodb
const User = require('./object/user')


try {
    mongoose.connect(
        process.env.DATABASE_URL
    )
    console.log("DB CONNECTED")
} catch (error) {
    console.log(error)
}

app.use(express.json())

    


// async function compare (userPass,hassPass){
//     const res= await bcrypt.compare(userPass,hassPass,10)
//     return res
// }

app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, '/public')));
app.use(bodyParser());

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, "./public/index.html"));
});


app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname, "./public/login.html"));
});


app.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname, "./public/signup.html"))
})



app.post("/signup", async (req,res) => {
    const {name, email, password } = req.body;
    
    try {
        if(name===""|| email===""|| password===""){
            throw new Error("You are Required to fill all inputs");
        }else if(name.length<8){
            throw new Error("Name should be more than 8 letters");
        }else if(!/^[^\s@]+@[^\s@]+\.|[^\s@]+$/.test(email)) {
            throw new Error("invalid email inputed");
        }else if (password.length<8){
            throw new Error("password is short");
        }else{
            //check if user exist already
        const existingUser = await User.findOne({ email});
        if (existingUser) {
            throw new Error("Email address is associated with an existing user");
        }
        

        const saltRounds=10;
        const hashedPassword=await bcrypt.hash(password, saltRounds);
            
        const newUser= new User({
            name,
            email,
            password:hashedPassword,
        });

        await newUser.save();
        
        res.json({
        status:"SUCCESSFUL",
        message:"Account created successfully",
        });
    }

    }catch(error){
        console.error(error);
        res.status(400).json({
            status:"FAILED",
            message:error.message,
        });
    }
});
        
app.post('/login', async (req, res) => {
    const { email, password} = req.body;
    
    try {
        if (!email || !password){
            throw new Error("Please provide your email and Password")
        }
        
        const user = await User.findOne({email});

        if(!user) {
            throw new Error("Incorrect email");
        }

        const matchPassword = await bcrypt.compare(password, user.password);

        if(!matchPassword){
            throw new Error("Incorrect Password")
        }

        res.status(200).json({
            status:"SUCCESSFULLY",
            message:"Login success",               
        });
    }catch(error){
        console.error(error);
        res.status(400).json({
            status:"FAilED",
            message:error.message,
        });
    }


})
    
    


// const usersRouter = require('./route/users')
// app.use('/', usersRouter)


app.listen(port, () => {
    console.log(`Server is running on localhost:${port}`)
})