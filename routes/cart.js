const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const global = require('../global');

router.post('/addtocart', async (req, res) => {
    try {
        const { product_id,image,color,size,userId,quantity,price } = req.body
        console.log(req.body);
        const id = global.generateRandomString(12)
        const newCart= new Cart({id,product_id,image,color,size,userId,quantity,price});
        newCart.insertCartItem().then((result)=>{
            // throw new Error("Division by zero is not allowed.");
            res.json({ "message": "Added In Cart Successfully" });
        })
        .catch((err) => {
            res.status(500).json({ "error": "Failed to insert item in cart", "details": err });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ "error": "Internal Server Error" });
    }
});

router.get('/getcartproducts', async (req, res) => {
    try {
        const { userId } = req.query;
        const newCart= new Cart({userId});
        newCart.getItemsFromCart().then((result)=>{
            // throw new Error("Division by zero is not allowed.");
            res.json({"cart":result});
        })
        .catch((err) => {
            res.status(500).json({ "error": "Failed to get items in cart", "details": err });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ "error": "Internal Server Error" });
    }
});

router.delete('/deletecartproduct', async (req, res) => {
    try {
        const { cartId } = req.body;
        const newCart= new Cart({"id":cartId});
        console.log(cartId);
        newCart.deleteItemsFromCart().then((result)=>{
            // throw new Error("Division by zero is not allowed.");
            res.json({ "message": "Item Removed Successfully" });
        })
        .catch((err) => {
            res.status(500).json({ "error": "Failed to delete items from cart", "details": err });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ "error": "Internal Server Error" });
    }
});

router.put('/updatecartquantity', async (req, res) => {
    try {
        const { cartList } = req.body;
        for (const key in cartList) {
            console.log(key)
            const newCart= new Cart({"id":key,"quantity":cartList[key]});
            newCart.updateCartQuantity();
        }
        res.json({ "message": "Cart Quantity Updated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ "error": "Internal Server Error" });
    }
});

module.exports = router;