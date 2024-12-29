const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require('fs');
const { type } = require("os");
const { error } = require("console");

app.use(express.json());
app.use(cors());

// Database Connection with MongoDB
mongoose.connect("mongodb+srv://dbecommerce:dbecommerce123@dbecommerce.ndp6c.mongodb.net/dbecommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Connected to MongoDB Atlas");
})
.catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
});

// Pastikan folder upload/images ada
const dir = './upload/images';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

// Image Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, dir); // Menyimpan file di folder yang benar
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`); // Menambahkan ekstensi file secara otomatis
    }
});

const upload = multer({ storage: storage });
app.use('/images', express.static('upload/images'));

// API Route
app.get("/", (req, res) => {
    res.send("Express App is Running");
});

// Upload Route
app.post("/upload", upload.single('product'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: 0,
            message: "No file uploaded."
        });
    }
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});
// Schema for creating products
const Product = mongoose.model("Product", {
    id:{
        type: Number,
        required:true,
    },
    name:{
        type: String,
        required:true,
    },
    image:{
        type: String,
        required:true,
    },
    category:{
        type: String,
        required:true,
    },
    new_price:{
        type: Number,
        required:true,
    },
    old_price:{
        type: Number,
        required:true,
    },
    date:{
        type: Date,
        default:Date.now,
    },
    avilable:{
        type:Boolean,
        default:true,
    },

})

// Collections Data
app.get('/newcollections', async(req,res)=>{
    let products = await Product.find({});
    let newcollections = products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollections);
})
// Popular Data
app.get('/popularinwomen', async(req,res)=>{
    let products = await Product.find({category:"women"});
    let popularinwomen = products.slice(0,4);
    console.log("Popular Fetched");
    res.send(popularinwomen);
})
// Middleware fetch User
const fetchUser = async (req, res, next) => {
    // Mengambil token dari header Authorization
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ error: "Token is missing or invalid" });
    }

    try {
        // Verifikasi token
        const data = jwt.verify(token, 'dbecommerce');
        req.user = data.user;  // Menyimpan data user yang sudah terverifikasi
        next();  // Melanjutkan ke middleware berikutnya
    } catch (error) {
        return res.status(401).send({ error: "Invalid Token" });
    }
};


// Add Cart
app.post('/addtocart', fetchUser, async (req, res) => {
    console.log("added", req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] +=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("added")
});

// remove
app.post('/removefromcart',fetchUser,async(req,res)=>{
    console.log("remove", req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("remove")
})

app.post('/getcart', fetchUser, async(req,res)=>{
    console.log("getCart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
    
})

app.post('/addproduct', async(req, res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0)
    {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }else{
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})
// Creating API untuk delete product
app.post('/removeproduct', async(req, res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name,
    })
})

// Creating API untuk mendapatkan semua product
app.get('/allproducts', async(req,res)=>{
    let products = await Product.find({});
    console.log("All Products");
    res.send(products);
})

// Schema creating for User
const Users = mongoose.model('Users',{
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
    date:{
        type:Date,
        default:Date.now,
    }
})

const jwt = require('jsonwebtoken');

app.post('/signup', async (req, res) => {
    try {
        let check = await Users.findOne({ email: req.body.email });
        if (check) {
            return res.status(400).json({ success: false, errors: "error user" });
        }

        // Cart Data
        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        const user = new Users({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            cartData: cart,
        });

        await user.save();

        const data = {
            user: {
                id: user.id,
            },
        };

        const token = jwt.sign(data, 'dbecommerce');
        res.json({ success: true, token });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ success: false, errors: "Internal Server Error" });
    }
});

// User Login
app.post('/login', async (req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'dbecommerce');
            res.json({success:true,token});
        }else{
            res.json({success:false,errors:"Wrong Password"});
        }
    }else{
        res.json({success:false, errors:"Wrong Email"});
    }
})

// Start server
app.listen(port, (error) => {
    if (!error) {
        console.log("Server running on port " + port);
    } else {
        console.log("Error : " + error);
    }
});
