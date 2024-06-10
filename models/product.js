const db_functions = require("../controllers/db_functions");
const request = require('request');
const { env } = require('process');
const fs = require('fs');
const { json } = require("body-parser");
const log = require('../log');

class Product {
    #productData = {};

    constructor(productData) {
        this.#productData = productData;
    }

    getProduct() {
        return this.#productData;
    }

    insertProduct() {
        return new Promise((resolve, reject) => {
            let keysArray = Object.keys(this.#productData);
            let keysString = keysArray.join(', ');

            let valuesArray = Object.values(this.#productData);
            let valuesString = "'" + valuesArray.join("', '") + "'";

            db_functions
                .request(`INSERT INTO products (${keysString}) VALUES (${valuesString}); `)
                .then((value) => {
                    resolve(value);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    updateProduct() {
        return new Promise((resolve, reject) => {
            // let keysArray = Object.keys(this.#productData);
            // let keysString = keysArray.join(', ');

            // let valuesArray = Object.values(this.#productData);
            // let valuesString = "'" + valuesArray.join("', '") + "'";
            let queryString = [];
            Object.keys(this.#productData).forEach((key) => {
                queryString.push(`${key}="${this.#productData[key]}"`);
            })
            console.log(`Update products set ${queryString.join(",")} where id=${this.#productData['id']}`);

            db_functions
                .request(`Update products set ${queryString.join(", ")} where id="${this.#productData['id']}" `)
                .then((value) => {
                    resolve(value);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getAllProducts() {
        return new Promise((resolve, reject) => {
            db_functions
                .request(`SELECT p.*,c.category as 'category_name' FROM products p left outer join categories c on p.category=c.id where c.id like '%${this.#productData.category}%' and p.product_name like '%${this.#productData.product_name}%'`)
                .then((value) => {
                    resolve(value);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }


    getUserProducts() {
        return new Promise((resolve, reject) => {
            db_functions
                .request(`SELECT p.*,c.category as 'category_name' FROM products p left outer join categories c on p.category=c.id where p.userId like '%${this.#productData.userId}%'`)
                .then((value) => {
                    resolve(value);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getProductById() {
        return new Promise((resolve, reject) => {
            db_functions
                .request(`SELECT * FROM products p where p.id like '%${this.#productData.id}%'`)
                .then((value) => {
                    // console.log(value[0])
                    resolve(value[0]);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    addProductDetailsML(file) {
        return new Promise((resolve, reject) => {
            try {
                const image = file
                const formData = {
                    image: {
                        value: fs.createReadStream(image.path),
                        options: {
                            filename: image.originalname, // Provide a filename for the image
                            contentType: 'image/jpeg' // Specify the content type of the image
                        }
                    }
                };
                request.post(env.IMAGE_SEARCH_URL + '/image', { formData: formData }, (err, response, body) => {
                    if (err) {
                        reject('upload failed:', err);
                    } else {

                        let image_info = JSON.parse(body);
                        db_functions
                            .request(`Insert into ml_products set product_id = '${this.#productData['id']}', image = '${image.filename}', category = '${image_info['type']}', pattern = '${image_info['pattern']}'`)
                            .then((value) => {
                                let id = value['insertId']
                                let dominant_color = JSON.parse(image_info['dominant_color'])
                                dominant_color.forEach((color, i) => {
                                    db_functions.request(`Insert into ml_products_colors set ml_products_id = ${id}, red = ${color[0]}, green = ${color[1]}, blue = ${color[2]}, priority = ${i}  `)
                                })

                                resolve(value)

                            })
                            .catch((err) => {
                                reject(err);
                            });
                    }

                })
            } catch (error) {
                reject(error)
            }
        })

    }

    searchProductByImageML(file) {
        return new Promise((resolve, reject) => {
            try {
                const image = file
                const formData = {
                    image: {
                        value: image.buffer,
                        options: {
                            filename: image.originalname, // Provide a filename for the image
                            contentType: 'image/jpeg' // Specify the content type of the image
                        }
                    }
                };
                request.post(env.IMAGE_SEARCH_URL + '/image', { formData: formData }, (err, response, body) => {
                    if (err) {
                        reject('upload failed:', err);
                    } else {
                        let image_info = JSON.parse(body);
                        if (image_info.pattern != 'Not Found' && image_info.type != 'Not Found') {
                            image_info['dominant_color'] = JSON.parse(image_info['dominant_color'])
                            let [r, g, b] = image_info['dominant_color'][0]
                            // console.log(`select * from ml_products_colors where ml_products_id in (select id from  ml_products where category = '${image_info['type']}' and pattern = '${image_info['pattern']}') and (red BETWEEN ${r-10} and ${r+10}) and (green BETWEEN ${g-10} and ${g+10}) and (blue BETWEEN ${b-10} and ${b+10})`)
                            let threshold = 50
                            db_functions
                                .request(`select mlp.image,p.*,c.category from ml_products mlp inner join products p on p.id=mlp.product_id inner join categories c on c.id=p.category where mlp.id in (select distinct(ml_products_id) from ml_products_colors where ml_products_id in (select id from  ml_products where category = '${image_info['type']}' and pattern = '${image_info['pattern']}') and (red BETWEEN ${r - threshold} and ${r + threshold}) and (green BETWEEN ${g - threshold} and ${g + threshold}) and (blue BETWEEN ${b - threshold} and ${b + threshold}) order by priority) `)
                                .then((value) => {
                                    log.debug(value)
                                    resolve(value);
                                })
                                .catch((err) => {
                                    reject(err);
                                });
                        }
                        else {
                            resolve([])
                        }
                    }

                })
            } catch (error) {
                reject(error)
            }
        })
    }



    // Add more methods as needed for product-related operations

}

module.exports = Product;