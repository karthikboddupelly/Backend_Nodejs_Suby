
const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const vendorRoutes = require('./routes/vendorRoutes');
const bodyParser = require('body-parser');
const firmRoutes = require('./routes/firmRoutes')
const productRoutes = require('./routes/productRoutes')
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 4000;

dotEnv.config();

mongoose.connect(process.env.MANGO_URI)
    .then(()=>console.log("MangoDB successfully connected!!!"))
    .catch((error)=>console.log("the error is ",error))


app.use(bodyParser.json());
app.use('/Vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);
app.use('/uploads',express.static('uploads'));

app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`);
});

app.use('/',(req,res) => {
    res.send("<h1>Welcome to Suby</h1>")
});