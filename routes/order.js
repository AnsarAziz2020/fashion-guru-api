const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const global = require('../global');
const Cart = require('../models/cart');
const VerifyUser = require('../middleware/verifyUser');
const log = require('../log');
const SendNotification = require('../firebase/sendNotification');
const User = require('../models/user');
const Product = require('../models/product');
const e = require('express');
const db_functions = require('../controllers/db_functions');

router.post('/addorder', async (req, res) => {
    try {
        let orderId = global.generateRandomString(12);
        const { name, address, email, phone_no, userId, cartDetails } = req.body
        cartDetails.forEach(cartId => {
            id = global.generateRandomString(12);
            const newOrder = new Order({ id, orderId, cartId, userId, name, email, phone_no, address })
            newOrder.insertNewOrder().then((res) => {
                const newCart = new Cart({ "id": cartId });
                newCart.deleteItemsFromCart();
                let productOwnerDetails = new Order({});
                productOwnerDetails.getOrderProductOwner(id).then((res) => {
                    SendNotification({
                        notification: {
                            title: 'Order Recieved',
                            // a order request is placed on   
                            body: `a order request is placed on ${res['product_name']}.`,
                        },
                        data: {
                            route: "ViewOrder"
                        },
                        token: res['fcm_token'],
                    })
                })
            })



        });
        res.status(200).json({ "message": "Order Added Successfully" })
    } catch (error) {
        log.error(error);
        res.status(500).json({ "error": "Internal Server Error" });
    }
});

router.get('/getorderbyuserid', async (req, res) => {
    try {
        const { userId } = req.query
        const newOrder = new Order({ userId })
        newOrder.getOrderByUserId().then((result) => {
            res.status(200).send({ "order": result })
        })
            .catch((e) => {
                res.status(500).send({ "message": "Error while getting orders" })
            })

    } catch (error) {
        log.error(error);
        res.status(500).json({ "error": "Internal Server Error" });
    }
})

router.get('/getorderbyid', async (req, res) => {
    try {
        const { id } = req.query
        const newOrder = new Order({ id })
        newOrder.getOrderById().then((result) => {
            res.status(200).send({ "order": result })
        })
            .catch((e) => {
                res.status(500).send({ "message": "Error while getting orders" })
            })

    } catch (error) {
        log.error(error);
        res.status(500).json({ "error": "Internal Server Error" });
    }
})

router.get('/getvendororders', VerifyUser, async (req, res) => {
    try {
        const { id } = req.user
        const newOrder = new Order({})
        let pendingOrder = await newOrder.getAllVendorOrdersPending(id);
        let acceptedOrder = await newOrder.getAllVendorOrders(id, 'Accepted');
        let deliveredOrder = await newOrder.getAllVendorOrders(id, 'Delivered');
        let declinedOrder = await newOrder.getAllVendorOrders(id, 'Declined');

        res.status(200).json({
            pendingOrder,
            acceptedOrder,
            deliveredOrder,
            declinedOrder
        })

    } catch (error) {
        res.status(500).json({ "message": "Internal Server Error" });
    }
})

router.put('/changevendororderstatus', VerifyUser, async (req, res) => {
    try {
        const { id } = req.user;
        const { status, order_id } = req.body;
        const newOrder = new Order({});
        newOrder.updateOrderStatus(status, order_id, id).then(async (response) => {
            let pendingOrder = await newOrder.getAllVendorOrdersPending(id, 'Pending');
            let acceptedOrder = await newOrder.getAllVendorOrders(id, 'Accepted');
            let deliveredOrder = await newOrder.getAllVendorOrders(id, 'Delivered');
            let declinedOrder = await newOrder.getAllVendorOrders(id, 'Declined');

            let productOwnerDetails = new Order({});
            productOwnerDetails.getCustomerDetails(order_id).then((res) => {
                SendNotification({
                    notification: {
                        title: `Order ${status}`,
                        body: `${res['product_name']} order request is ${status}`,
                    },
                    data: {
                        order_id,
                        route: "OrderDetails"
                    },
                    token: res['fcm_token'],
                })
            })

            res.status(200).json({
                pendingOrder,
                acceptedOrder,
                deliveredOrder,
                declinedOrder
            })
        })

    } catch (error) {
        log.error(error)
        res.status(500).json({ "message": "Internal Server Error" });
    }
})

router.post('/addbargainorder', VerifyUser, (req, res) => {
    let id = global.generateRandomString(12);
    let orderId = global.generateRandomString(12);
    let userId = req.user['id']
    let { name, email, phone_no, address, product_id, image, color, quantity, size, price } = req.body

    let order = new Order({});
    order.addBargainOrder(id, orderId, userId, name, email, phone_no, address, product_id, image, color, quantity, size, price, status = "Bargain").then((response) => {

        order.getOrderProductOwner(id).then((res) => {
            SendNotification({
                notification: {
                    title: 'Order Recieved',
                    body: `A bargain request is placed on ${res['product_name']}.`,
                },
                data: {
                    route: "ViewOrder"
                },
                token: res['fcm_token'],
            })
        })
        res.status(200).json({ "message": "Order Added Successfully" })
    })
        .catch((error) => {
            res.status(500).json({ error })
        })
})

router.get('/getadminorders', VerifyUser, async (req, res) => {
    try {
        const { id, type } = req.user
        if (type == 'admin') {
            const { userId } = req.query
            const newOrder = new Order({ userId })
            newOrder.getOrderForAdmin().then((result) => {
                res.status(200).send({ "order": result })
            })
                .catch((e) => {
                    res.status(500).send({ "message": "Error while getting orders" })
                })
        }
        else {
            res.status(404)
        }

    } catch (error) {
        res.status(500).json({ "message": "Internal Server Error" });
    }
})

router.put('/changevendororderstatus', VerifyUser, async (req, res) => {
    try {
        const { id } = req.user;
        const { status, order_id } = req.body;
        const newOrder = new Order({});
        newOrder.updateOrderStatus(status, order_id, id).then(async (response) => {
            let orders = await newOrder.getOrderForAdmin()

            let productOwnerDetails = new Order({});
            productOwnerDetails.getCustomerDetails(order_id).then((res) => {
                SendNotification({
                    notification: {
                        title: `Order ${status}`,
                        body: `${res['product_name']} order request is ${status}`,
                    },
                    data: {
                        order_id,
                        route: "OrderDetails"
                    },
                    token: res['fcm_token'],
                })
            })

            res.status(200).send({ "order": result })
        })

    } catch (error) {
        log.error(error)
        res.status(500).json({ "message": "Internal Server Error" });
    }
})

router.get('/search/:id', VerifyUser, (req, res) => {
    if (req.user['type'] == 'admin') {
        try {
            let { id } = req.params
            db_functions.request(`select o.*,p.product_name,c.category,o.quantity,o.price from orders o inner join products p on p.id=o.product_id  inner join categories c on c.id=p.category where orderId like '%${id}%' order by o.timeAdded desc `).then((results) => {
                res.status(200).json({ results })
            }).catch((error)=>{
                console.log(error)
                res.status(400).json({ error })
            })
        } catch (error) {
            console.log(error)
            res.status(400).json({ error })
        }
    } else {
        res.status(404)
    }
})

module.exports = router;