const { response } = require("express");
const db_functions = require("../controllers/db_functions");
const { error } = require("../log");

class Order {
    #orderData = {};

    constructor(orderData) {
        this.#orderData = orderData;
    }

    insertNewOrder() {
        return new Promise((resolve, reject) => {
            let keysArray = Object.keys(this.#orderData);
            let keysString = keysArray.join(', ');

            let valuesArray = Object.values(this.#orderData);
            let valuesString = "'" + valuesArray.join("', '") + "'";
            db_functions.getRow(`Select * from cart  where id='${this.#orderData['cartId']}'`).then((cartItem) => {
                db_functions
                    .request(`INSERT INTO orders set id = '${this.#orderData['id']}', orderId = '${this.#orderData['orderId']}', userId = '${this.#orderData['userId']}', name = '${this.#orderData['name']}', email = '${this.#orderData['email']}', phone_no = '${this.#orderData['phone_no']}', address = '${this.#orderData['address']}', product_id = '${cartItem['product_id']}', image = '${cartItem['image']}', size = '${cartItem['size']}', color = '${cartItem['color']}', quantity = '${cartItem['quantity']}' , price = '${cartItem['price']}'`)
                    .then((value) => {
                        resolve(value);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            })
        });
    }

    getOrderByUserId() {
        return new Promise((resolve, reject) => {
            db_functions
                .request(`select o.id,o.orderId,o.image,o.product_id,o.status,o.is_review,o.timeAdded,p.product_name,c.category,o.quantity,o.price from orders o inner join products p on p.id=o.product_id  inner join categories c on c.id=p.category where o.userId = '${this.#orderData['userId']}' order by o.timeAdded desc`)
                .then((value) => {
                    resolve(value);
                })
                .catch((err) => {
                    s
                    reject(err);
                });
        })
    }

    getOrderForAdmin() {
        return new Promise((resolve, reject) => {
            db_functions
                .request(`select o.*,p.product_name,c.category,o.quantity,o.price from orders o inner join products p on p.id=o.product_id  inner join categories c on c.id=p.category order by o.timeAdded desc`)
                .then((value) => {
                    resolve(value);
                })
                .catch((err) => {
                    s
                    reject(err);
                });
        })
    }

    getOrderById() {
        return new Promise((resolve, reject) => {
            db_functions
                .request(`select o.*,p.product_name,c.category from orders o inner join products p on p.id=o.product_id  inner join categories c on c.id=p.category where o.id = '${this.#orderData['id']}' limit 1`)
                .then((value) => {
                    resolve(value[0]);
                })
                .catch((err) => {
                    reject(err);
                });
        })
    }

    getAllVendorOrders(vendorId, status) {
        return new Promise((resolve, reject) => {
            db_functions
                .request(`select o.*,p.product_name,c.category from orders o inner join products p on p.id=o.product_id  inner join categories c on c.id=p.category where p.userId = '${vendorId}' and o.status='${status}' order by o.timeAdded desc`)
                .then((value) => {
                    resolve(value);
                })
                .catch((err) => {
                    reject(err);
                });
        })
    }

    getAllVendorOrdersPending(vendorId) {
        return new Promise((resolve, reject) => {
            db_functions
                .request(`select o.*,p.product_name,c.category from orders o inner join products p on p.id=o.product_id  inner join categories c on c.id=p.category where p.userId = '${vendorId}' and o.status='Pending' or  o.status='Bargain' order by o.timeAdded desc`)
                .then((value) => {
                    resolve(value);
                })
                .catch((err) => {
                    reject(err);
                });
        })
    }

    updateOrderStatus(status, order_id, vendorId) {
        return new Promise((resolve, reject) => {
            db_functions
                .request(`update orders set status = '${status}' where id='${order_id}'`)
                .then((value) => {
                    resolve(value);
                })
                .catch((err) => {
                    reject(err);
                });
        })
    }

    getOrderProductOwner(orderId) {
        return new Promise((resolve, reject) => {
            db_functions.request(`select u.*,p.product_name from orders o inner join products p on p.id=o.product_id inner join users u on u.id=p.userId where o.id = '${orderId}' limit 1`).then((response) => {
                resolve(response[0]);
            }).catch((error) => {
                reject(error)
            })
        })
    }

    getCustomerDetails(orderId) {
        return new Promise((resolve, reject) => {
            db_functions.request(`select u.*,p.product_name from orders o inner join products p on p.id=o.product_id inner join users u on u.id=o.userId where o.id = '${orderId}' limit 1`).then((response) => {
                resolve(response[0]);
            }).catch((error) => {
                reject(error)
            })
        })
    }

    addBargainOrder(id, orderId, userId, name, email, phone_no, address, product_id, image, color, quantity, size, price, status) {
        return new Promise((resolve,reject)=>{
            db_functions.request(`INSERT INTO orders set id = '${id}', orderId = '${orderId}', userId = '${userId}', name = '${name}', email = '${email}', phone_no = '${phone_no}', address = '${address}', product_id = '${product_id}', image = '${image}', size = '${size}', color = '${color}', quantity = '${quantity}' , price = '${price}' , status = '${status}'`).then((value) => {
                resolve(value);
            })
                .catch((err) => {
                    reject(err);
                });
        })
    }

}

module.exports = Order