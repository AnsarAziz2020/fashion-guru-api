const db_functions = require("../controllers/db_functions");

class Cart {
    #cartData = {};

    constructor(cartData) {
        this.#cartData = cartData;
    }

    getCart() {
        return this.#cartData;
    }

    insertCartItem() {
        return new Promise((resolve, reject) => {
            let keysArray = Object.keys(this.#cartData);
            let keysString = keysArray.join(', ');

            let valuesArray = Object.values(this.#cartData);
            let valuesString = "'" + valuesArray.join("', '") + "'";

            db_functions
                .request(`INSERT INTO cart (${keysString}) VALUES (${valuesString}); `)
                .then((value) => {
                    resolve(value);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getItemsFromCart(userId=this.#cartData['userId']) {
        return new Promise((resolve, reject) => {
            db_functions
                .request(`SELECT c.id,c.image,p.product_name,cg.category,p.price,c.quantity,c.size,c.color FROM cart c inner join products p on p.id=c.product_id inner join categories cg on p.category=cg.id where c.userId='${userId}' order by c.timeAdded`)
                .then((value) => {
                    resolve(value);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    deleteItemsFromCart(cartId=this.#cartData['id']) {
        return new Promise((resolve, reject) => {
            db_functions
                .request(`DELETE FROM cart WHERE id = '${cartId}'`)
                .then((value) => {
                    resolve(value);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    updateCartQuantity(id=this.#cartData['id'],quantity=this.#cartData['quantity']) {
        return new Promise((resolve, reject) => {
            db_functions
                .request(`UPDATE cart SET quantity = '${quantity}' WHERE id = '${id}';`)
                .then((value) => {
                    resolve(value);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}

module.exports = Cart;
