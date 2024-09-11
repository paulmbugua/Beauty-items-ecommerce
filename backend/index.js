const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use('/upload/images', express.static(path.join(__dirname, 'upload', 'images')));

// Database connection with MongoDB
mongoose.connect("mongodb+srv://paulpep2002:Turbo4040*@ecommerce.c4pxz.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=ecommerce")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

// Configure multer storage for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'upload', 'images')); // Adjust the path
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Generate unique filenames
    }
});

const upload = multer({ storage: storage });

// Handling multiple file fields
app.post('/upload', upload.fields([
    { name: 'main_image', maxCount: 1 },
    { name: 'other_images', maxCount: 5 }
]), (req, res) => {
    try {
        const mainImageUrl = req.files['main_image'] ? `http://localhost:${port}/upload/images/${req.files['main_image'][0].filename}` : null;
        const otherImagesUrls = req.files['other_images'] ? req.files['other_images'].map(file => `http://localhost:${port}/upload/images/${file.filename}`) : [];

        res.json({
            success: true,
            main_image_url: mainImageUrl,
            other_images_url: otherImagesUrls
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Image upload failed', error: error.message });
    }
});

// Product Schema and Model
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    main_image: {
        type: String, // Single URL for main image
        required: true,
    },
    other_images: {
        type: [String], // Array for multiple other image URLs
        required: false,
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
    summary: {
        type: String,
        required: false,
    },
    detailed_description: {
        type: String,
        required: false,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
});

// Add product endpoint
app.post('/addproduct', async (req, res) => {
    try {
        const { name, category, new_price, old_price, summary, detailed_description, main_image_url, other_images_url } = req.body;

        console.log("Received data:", req.body);

        // Get current product count to assign a new ID
        let products = await Product.find({});
        let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

        // Create a new product object
        const product = new Product({
            id: id,
            name: name,
            main_image: main_image_url,            // Store main image URL
            other_images: other_images_url,        // Store other images URLs array
            category: category,
            new_price: new_price,
            old_price: old_price,
            summary: summary,
            detailed_description: detailed_description
        });

        // Save the product to the database
        await product.save();

        // Send a success response
        res.status(201).json({
            success: true,
            message: 'Product added successfully',
            product: product
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to add product',
            error: error.message
        });
    }
});

// Remove product endpoint
app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({ success: true, name: req.body.name });
});

// Fetch all products endpoint
app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    console.log("All products Fetched");
    res.send(products);
});

// User Schema and Model
const Users = mongoose.model('Users', {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    cartData: { type: Object },
    date: { type: Date, default: Date.now }
});

// Signup endpoint
app.post('/signup', async (req, res) => {
    try {
        let check = await Users.findOne({ email: req.body.email });
        if (check) return res.status(400).json({ success: false, error: "User with this email already exists." });

        let cart = {};
        for (let i = 0; i < 300; i++) cart[i] = 0;

        const user = new Users({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            cartData: cart,
        });

        await user.save();
        const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET || 'secret_ecom');
        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const token = jwt.sign({ user: { id: user.id } }, 'secret_ecom');
            res.json({ success: true, token });
        } else {
            res.json({ success: false, errors: "Wrong Password" });
        }
    } else {
        res.json({ success: false, errors: "Wrong Email Id" });
    }
});

// New collections endpoint
app.get('/newcollections', async (req, res) => {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection);
});

// Related products endpoint
app.get('/relatedproducts', async (req, res) => {
    let products = await Product.find({ category: "Serums" });
    let relatedproducts = products.slice(0, 4);
    console.log("RelatedProducts Fetched");
    res.send(relatedproducts);
});

// Popular choices endpoint
app.get('/popularchoices', async (req, res) => {
    let products = await Product.find({ category: "Serums" });
    let PopularChoices = products.slice(0, 4);
    console.log("Popular choices fetched");
    res.send(PopularChoices);
});

// Middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send({ errors: "Please authenticate using a valid token" });

    try {
        const data = jwt.verify(token, 'secret_ecom');
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ errors: "Please authenticate using a valid token" });
    }
};

// Add to cart endpoint
app.post('/addtocart', fetchUser, async (req, res) => {
    console.log("Added", req.body.itemId);
    let userData = await Users.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Added");
});

// Remove from cart endpoint
app.post('/removefromcart', fetchUser, async (req, res) => {
    console.log("Removed", req.body.itemId);
    let userData = await Users.findOne({ _id: req.user.id });
    if (userData.cartData[req.body.itemId] > 0) userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Removed");
});

// Get cart data endpoint
app.post('/getdata', fetchUser, async (req, res) => {
    console.log("GetCart");
    let userData = await Users.findOne({ _id: req.user.id });
    res.json(userData.cartData);
});

// Update product endpoint
app.post('/updateproduct', upload.single('main_image'), async (req, res) => {
    const { id, name, old_price, new_price, category, summary, detailed_description } = req.body;
    let updateFields = { name, old_price, new_price, category, summary, detailed_description };

    if (req.file) {
        updateFields.main_image = `http://localhost:${port}/upload/images/${req.file.filename}`;
    }

    try {
        const updatedProduct = await Product.findOneAndUpdate(
            { id },
            { $set: updateFields },
            { new: true }
        );

        if (updatedProduct) {
            res.json({ success: true, message: 'Product updated successfully', updatedProduct });
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating product', error });
    }
});

// Server listen
app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on Port " + port);
    } else {
        console.log("Error: " + error);
    }
});
