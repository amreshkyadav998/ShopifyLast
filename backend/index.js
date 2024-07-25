const port = 4001;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { type } = require("os");
const jwt = require('jsonwebtoken');
require('dotenv').config();


app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb+srv://amreshky998:oFaQ9MTd1O2SJ8Ev@cluster0.b2ad6nh.mongodb.net/Shopify", {
    dbName:'Shopify',
    serverSelectionTimeoutMS: 30000, 
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // Exit process if cannot connect to DB
});

// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

app.use('/images', express.static('upload/images'));

app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

// Product Schema
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        required: true,
    }
});

app.post('/addproduct', async (req, res) => {
    try {
        let products = await Product.find({});
        let id;
        if (products.length > 0) {
            let last_product = products[products.length - 1];
            id = last_product.id + 1;
        } else {
            id = 1;
        }
        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
            available: req.body.available,
        });
        await product.save();
        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        console.error("Error saving product:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

app.post('/removeproduct', async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.body.id });
        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        console.error("Error removing product:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

//creating api for getting all products
app.get('/allproducts', async (req, res) => {
    try {
        let products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

//Schema creating for user Model

const Users = mongoose.model('Users', {
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,  
    },
    cartData:{
        type:Object,
    },
    data:{
        type:Date,
        default:Date.now,
    }
})

//Creating Endpoint for registering the user
app.post('/signup' , async(req,res)=>{

    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"existing user found with same email address"});
    }
    let cart = {};
    for(let i=0;i < 300 ; i++){
        cart[i] = 0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })

    await user.save();
    const data = {
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data , 'secret_ecom');
    res.json({success:true,token})
})

// creating endpoint for user login
app.post('/login' , async(req,res) => {
    let user = await Users.findOne({email:req.body.email});
    if(user) {
        const passwordCompare = req.body.password === user.password;
        if(passwordCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data , 'secret_ecom');
            res.json({success:true , token});
        }
        else{
            res.json({success:false,errors:"Wrong Password"})
        }
    }
    else{
        res.json({success:false,errors:"Wrong Email-Id"})
    }
})

//creating endpoint for newcollection data 
app.get("/newcollections" , async(req,res) => {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection);
})

//creating endpoint for popular in women section
app.get("/popularinwomen" , async(req,res) => {
    let product = await Product.find({category:"women"});
    let popular_in_women = product.slice(0,4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
})

//creating middleware to fetch user

const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ errors: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, 'secret_ecom');
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).send({ errors: "Please authenticate using a valid token" });
    }
};


// creating endpoint for adding products in cartdata
app.post("/addcart", fetchUser, async (req, res) => {
    console.log("Added" , req.body.itemId);
    try {
        let userData = await Users.findById(req.user.id);
        if (!userData) {
            return res.status(404).send({ errors: "User not found" });
        }

        // Initialize cartData if not present
        if (!userData.cartData) {
            userData.cartData = {};
        }

        // Initialize item count if not present
        if (!userData.cartData[req.body.itemId]) {
            userData.cartData[req.body.itemId] = 0;
        }

        userData.cartData[req.body.itemId] += 1;

        await Users.findByIdAndUpdate(req.user.id, { cartData: userData.cartData });

        res.json({ message: "Added" });  // Return JSON response
    } catch (error) {
        res.status(500).send({ errors: "Internal Server Error" });
    }
});

// creating endpoint to remove product from cart data
app.post('/removefromcart',fetchUser,async(req,res) => {
    console.log("removed" , req.body.itemId);
    try {
        let userData = await Users.findById(req.user.id);
        if (!userData) {
            return res.status(404).send({ errors: "User not found" });
        }

        // Initialize cartData if not present
        if (!userData.cartData) {
            userData.cartData = {};
        }

        // Initialize item count if not present
        if (!userData.cartData[req.body.itemId]) {
            userData.cartData[req.body.itemId] = 0;
        }

        if(userData.cartData[req.body.itemId] > 0) {
        userData.cartData[req.body.itemId] -= 1;
        }

        await Users.findByIdAndUpdate(req.user.id, { cartData: userData.cartData });

        res.json({ message: "Removed" });  // Return JSON response
    } catch (error) {
        res.status(500).send({ errors: "Internal Server Error" });
    }
})

//creating endpoint to get cartdata
app.post('/getcart' ,fetchUser,async(req,res) => {
    console.log("GetCart");
    let userData = await Users.findById(req.user.id);
    res.json(userData.cartData);
})

app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on Port " + port);
    } else {
        console.log("Error :", error);
    }
});



//7:28:03