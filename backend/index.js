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


mongoose.connect("mongodb+srv://manishbraje:manishraje@cluster0.nuu5t.mongodb.net/shoppy");


app.get("/", (req, res) => {
    res.send("express app is running");
})


const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage: storage });


app.use('/images', express.static('upload/images'));

app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })

})


const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
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
        default: true,
    }
})

app.post('/addproduct', async (req, res) => {
    try {
        // Fetch all products to find the last product
        let products = await Product.find({});
        let id;

        // Calculate the new `id`
        if (products.length > 0) {
            let last_product = products[products.length - 1]; // Get the last product
            id = last_product.id + 1;
        } else {
            id = 1; // Start with 1 if no products exist
        }

        // Create a new product with the calculated `id`
        const product = new Product({
            id: id, // Use calculated `id` instead of req.body.id
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
        });

        console.log(product);
        await product.save();
        console.log("Saved");

        // Send a success response
        res.json({
            success: true,
            product,
        });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});



app.post('/deleteproduct', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("removed");
    res.json({
        success: true,
        name: req.body.name
    })
})


app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    console.log("all products fetched");
    res.send(products);
})

//middleware for fetching user
 const fetchUser=async(req,res,next)=>{
    const token=req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"Please authenticate using valid token"});
    }
    else{
        try {
            const data=jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({errors:"please authenticate using a valid token"})
        }
    }
 }



 
// Add product to cart
app.post('/addtocart', fetchUser, async (req, res) => {
    console.log("Added", req.body.itemId);

    let userData = await Users.findOne({ _id: req.user.id });
    
    // If the product is already in the cart, increment its quantity, else add it with quantity 1
    if (userData.cartData[req.body.itemId]) {
        userData.cartData[req.body.itemId] += 1;
    } else {
        userData.cartData[req.body.itemId] = 1;
    }

    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Added to cart");
});

// Remove product from cart
app.post('/removefromcart', fetchUser, async (req, res) => {
    console.log("Removed", req.body.itemId);

    let userData = await Users.findOne({ _id: req.user.id });

    // If the product exists in the cart, decrement the quantity or remove it if the quantity is 0
    if (userData.cartData[req.body.itemId] > 0) {
        userData.cartData[req.body.itemId] -= 1;
        if (userData.cartData[req.body.itemId] === 0) {
            delete userData.cartData[req.body.itemId]; // Remove the product from the cart if quantity is 0
        }
    }

    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Removed from cart");
});



//cart data
// Get cart data
app.post('/getcart', fetchUser, async (req, res) => {
    console.log("GetCart");
    let userData = await Users.findOne({ _id: req.user.id });
    res.json(userData.cartData); // Send the cart data
});


//user
const Users = mongoose.model('Users', {
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    cartData: {
        type: Object, // This will hold the product IDs and quantities
        default: {}
    },
    date: {
        type: Date,
        default: Date.now,
    }
});


app.post('/signup', async (req, res) => {
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, errors: "Existing user found with the same email" })
    }

    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: {}, // Start with an empty cart
    });

    await user.save();
    const data = {
        user: {
            id: user.id
        }
    };
    const token = jwt.sign(data, 'secret_ecom');
    res.json({ success: true, token });
});

  //as

app.post('/login',async(req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data={
                user:{
                    id:user.id
                }
            }
            const token=jwt.sign(data,'secret_ecom');
            res.json({success:true,token});

        }
        else{
            res.json({success:false,errors:"Wrong password"});
        }
    }
    else{
        res.json({success:false,errors:"Wrong email id"});
    }
})







//mansi trying to do smthng



app.listen(port, (error) => {
    if (!error) {
        console.log("Server running on port " + port);
    }
    else {
        console.log("error : ", +error);
    }
});