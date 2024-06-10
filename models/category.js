const db_functions = require("../controllers/db_functions");

class Category {
    #categoryData = {};

    constructor(categoryData) {
        this.#categoryData = categoryData;
    }

    getCategory() {
        return this.#categoryData;
    }

    insertCategory() {
        return new Promise((resolve, reject) => {
            let keysArray = Object.keys(this.#categoryData);
            let keysString = keysArray.join(', ');

            let valuesArray = Object.values(this.#categoryData);
            let valuesString = "'" + valuesArray.join("', '") + "'";

            db_functions
                .request(`INSERT INTO categories (${keysString}) VALUES (${valuesString}); `)
                .then((value) => {
                    console.log(value);
                    resolve(value);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getAllCategories() {
        return new Promise((resolve, reject) => {
            db_functions
                .request(`SELECT * FROM categories`)
                .then((value) => {
                    resolve(value);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    // Add more methods as needed for category-related operations

}

module.exports = Category;
