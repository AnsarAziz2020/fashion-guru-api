const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const multer = require('multer');
const path = require('path');
const global = require('../global');
const { fileURLToPath } = require('url');
const request = require('request');
const { env } = require('process');
const log = require('../log');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the destination folder
    },
    filename: function (req, file, cb) {
        // Use the original file name with a timestamp to avoid overwriting
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage: storage });
const upload2 = multer();

router.post('/createproduct', async (req, res) => {
    try {
        const { product_name, category, thumbnail_image, other_images, userId } = req.body;
        const id = global.generateRandomString(12)
        const date = new Date();
        const newProduct = new Product({ id, product_name, category, thumbnail_image, other_images, "timeAdded": date.getTime(), userId });

        newProduct.insertProduct().then((result) => {
            res.json({ "message": "Product created successfully" });
        })
        .catch((err) => {
            res.status(500).json({ "error": "Failed to create product", "details": err });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ "error": "Internal Server Error", "details": err });
    }
});

router.get('/getproducts', async (req, res) => {
    try {
        const { product_name, category } = req.query;
        const allProducts = new Product({ product_name, category });
        allProducts.getAllProducts().then((products) => {
            res.json({ "products": products });
        })
            .catch((err) => {
                res.status(500).json({ "error": "Failed to fetch products", "details": err });
            });
    } catch (error) {
        res.status(500).json({ "error": "Internal Server Error", "details": err });
    }
});

router.get('/getvendorproducts', async (req, res) => {
    try {
        const { userId } = req.query;
        const allProducts = new Product({ userId });
        allProducts.getUserProducts().then((products) => {
            res.json({ "products": products });
        })
            .catch((err) => {
                res.status(500).json({ "error": "Failed to fetch products", "details": err });
            });
    } catch (error) {
        res.status(500).json({ "error": "Internal Server Error", "details": err });
    }
});

router.get('/getproduct', async (req, res) => {
    try {
        const { id } = req.query;
        log.error(id);
        const allProducts = new Product({ id });
        allProducts.getProductById().then((products) => {
            
            res.json({ "products": products });
        })
            .catch((err) => {
                res.status(500).json({ "error": "Failed to fetch products", "details": err });
            });
    } catch (error) {
        res.status(500).json({ "error": "Internal Server Error", "details": err });
    }
});

router.post('/addproduct', upload.any('file'), (req, res) => {
    try {
        const files = req.files;
        const { name, description, price, colors, size, category, userId } = req.body;
        const id = global.generateRandomString(12)
        let allFileName = []
        files.forEach((file) => {
            allFileName.push(file.filename)
            
        })
        let product = new Product({ id, "product_name": name, description, price, colors, size, category, "thumbnail_image": allFileName[0], "other_images": allFileName.join(","), userId })
        product.insertProduct().then((value) => {
            files.forEach((file)=>{
                product.addProductDetailsML(file)
            })
            res.status(200).json({
                message: 'Product uploaded successfully',
            });
        }).catch((e) => {
            return res.status(400).json({ message: 'No file uploaded' });
        })
    } catch (e) {
        log.error(e)
        res.status(500).json({ error: 'Internal Server Error', e });
    }
});

router.post('/updateproduct', upload.any('file'), (req, res) => {
    try {
        const files = req.files;
        const { id, name, description, price, colors, size, category, userId } = req.body;
        let allFileName = []
        files.forEach((file) => {
            allFileName.push(file.filename)
        })
        let product = new Product({ id, "product_name": name, description, price, colors, size, category, "thumbnail_image": allFileName[0], "other_images": allFileName.join(","), userId })
        product.updateProduct().then(() => {
            res.status(200).json({
                message: 'Product uploaded successfully',
            });
        }).catch((e) => {
            return res.status(400).json({ message: 'No file uploaded' });
        })
    } catch (e) {
        log.error(e)
        res.status(500).json({ error: 'Internal Server Error', e });
    }
});

router.post('/searchproductbyimage', upload2.any('image'), (req, res) => {
    try {
        const image = req.files[0]
        const product = new Product({})
        product.searchProductByImageML(image).then((response)=>{
            // log.info(response)
            res.status(200).json({"result":response})
        })

    } catch (error) {
        log.error(error)
        res.sendStatus(500).json({ error: 'Internal Server Error', e });
    }
})




// Add more routes for product-related operations

module.exports = router;
