
const express = require('express');
const productController = require('../controllers/productController');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();


router.post('/add-product/:firmId' , productController.addProduct);

router.get('/:firmId/products' , productController.getProductbyFirm);

router.get('/uploads/:imageName' , (req , res) => {
    const imageName = req.params.imageName;
    res.header('Content-Type' , 'image/jpeg');
    res.sendFile(Path.join(__dirname, '..', 'uploads', imageName));
});

router.delete('/:productId', productController.deleteProductById);

module.exports = router ;
