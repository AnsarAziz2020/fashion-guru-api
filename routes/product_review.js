const express = require('express');
const router = express.Router();
const ProductReview = require('../models/product_review');
const global = require('../global');
const VerifyUser = require('../middleware/verifyUser');
const log = require('../log');
const SendNotification = require('../firebase/sendNotification');

router.post('/add',VerifyUser, (req,res)=>{
    // recived orderId get product it
    let {rating,review,product_id,order_id} = req.body;
    let customer_id = req.user['id'];
    let id = global.generateRandomString(12);

    let productReview = new ProductReview();
    productReview.store(id,rating,review,customer_id,product_id,order_id).then((response)=>{
        res.status(200).json({'message':"review added"});
    })
    .catch((error)=>{
        console.log(error)
        res.status(500).json({error});
    })

})

router.get('/list/:product_id', (req,res)=>{
    
    let product_id = req.params.product_id
    let productReview = new ProductReview();
    productReview.index(product_id).then((response)=>{
        res.status(200).json({'reviews':response});
    })
    .catch((error)=>{
        log.error(error)
        res.status(500).json({error});
    })

})

module.exports = router;