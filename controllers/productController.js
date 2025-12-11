const Product = require("../models/Product");
const Firm = require('../models/Firm');
const multer = require('multer');
const Path = require('path');


const storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory to store uploaded files
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + Path.extname( file.originalname)); // Unique filename
        }
});

const upload = multer({ storage : storage});

const addProduct = async (req, res) => {
    try {
        const { productName , price , category , bestSeller , description } = req.body;
        const image = req.file? req.file.filename: undefined;

        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);

        if(!firm){
            return res.status(404).json({error: "No firm not found"});
        }

        const product = new Product({
            productName , 
            price , 
            category , 
            image , 
            bestSeller , 
            description ,
            firm: firm._id
        })

        const savedProduct = await product.save();
        firm.products.push(savedProduct);

        await firm.save();

        res.status(200).json(savedProduct)
    } catch (error) {
        console.log(error);
        return res.status(500).json({error : "Internal server error"})
    }
};


const getProductbyFirm = async (req , res) => {
    try {
        firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);

        if(!firm){
            return res.status(404).json({error : "No firm found"});
        }

        const products = await Product.find({firm : firmId});

        const RestaurantName = firm.firmname;
        res.status(200).json({ RestaurantName , products});

    } catch (error) {
        console.log(error);
        return res.status(500).json({error : "Internal server error"});
    }
}


const deleteProductById = async (req, res)=>{
    try {
        const productId = req.params.productId;

        const deletedProduct = await Product.findByIdAndDelete(productId);

        if(!deletedProduct){
            return res.status(404).json({error : "No Product found"});
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({error : "Internal server error"});
    }
}

module.exports = {addProduct : [upload.single('image'), addProduct] , getProductbyFirm , deleteProductById};