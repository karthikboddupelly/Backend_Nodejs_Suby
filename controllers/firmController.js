
const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const Path = require('path');



const storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + Path.extname( file.originalname));
        }
});

const upload = multer({ storage : storage});

const addFirm = async (req , res ) => {
    try{
        const { firmname , area , category , region , offer } = req.body;
    const image = req.file? req.file.filename: undefined;
    const vendor = await Vendor.findById(req.vendorId);

    if(!vendor){
        return res.status(404).json({error: "vendor not found"});
    }

    if(vendor.firm.length > 0){
        return res.status(400).json({message : "Vendor can have only one firm"});
    }

    const firm = new Firm({
        firmname , 
        area , 
        category , 
        region , 
        offer , 
        image , 
        vendor: vendor._id
    })

    const savedFirm = await firm.save();

    const firmId = savedFirm._id;
    vendor.firm.push(savedFirm);

    await vendor.save();

    return res.status(200).json({message: "Firm added Successfully" , firmId})
    }
    catch(error){
        console.log(error);
        return res.status(500).json({error : "Internal server error"})
    }
};


const deleteFirmById = async (req , res) => {
    try {
        const firmId = req.params.firmId;

        const deletedProduct = await Firm.findByIdAndDelete(firmId);

        if(!deletedProduct){
            return res.status(404).json({error : "No Product found"});
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({error : "Internal server error"});
    }
}

module.exports = {addFirm : [upload.single('image'), addFirm] , deleteFirmById};