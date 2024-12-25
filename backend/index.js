const port = 5000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require('fs');
const { type } = require("os");

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

// Start server
app.listen(port, (error) => {
    if (!error) {
        console.log("Server running on port " + port);
    } else {
        console.log("Error : " + error);
    }
});