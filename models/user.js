const db_functions = require("../controllers/db_functions")
var jwt = require('jsonwebtoken');
require('dotenv').config();
const jwt_secret = process.env.JWT_SECRET
const bcrypt = require('bcrypt');

class User {

    #userData = {}

    constructor(userData) {
        this.#userData = userData
    }

    getUser() {
        return this.#userData;
    }

    insertUser() {
        return new Promise((resolve, reject) => {
            let keysArray = Object.keys(this.#userData);
            let keysString = keysArray.join(', ');

            let valuesArray = Object.values(this.#userData);
            let valuesString = "\'" + valuesArray.join('\', \'') + "\'";

            db_functions.request(`INSERT INTO users (${keysString}) VALUES (${valuesString}); `).then((value) => {
                resolve(value);
            })
                .catch((err) => {
                    reject(err)
                })
        })
    }

    getAllUser() {
        return new Promise((resolve, reject) => {
            db_functions.request(`Select * from users`).then((value) => {
                resolve(value);
            })
                .catch((err) => {
                    reject(err)
                })
        })
    }

    generateNewToken() {
        const expiresIn = 7 * 24 * 60 * 60;
        const authToken = jwt.sign(this.#userData, jwt_secret, { expiresIn })
        return authToken;
    }

    getCurrentUser() {
        return new Promise((resolve, reject) => {
            db_functions.request(`Select * from users where email='${this.#userData.email}'`).then(async (value) => {
                this.#userData = {
                    "id": value[0].id,
                    "name": value[0].name,
                    "email": value[0].email,
                    "phone_no": value[0].phone_no,
                    "address": value[0].address,
                    "type": value[0].type,
                    "shop_name": value[0].shop_name,
                    "password": value[0].password,
                    "profile_pic": value[0].profile_pic,
                };
                const token = this.generateNewToken();
                this.#userData['authToken'] = token
                resolve(this.#userData);
            })
                .catch((err) => {
                    reject(err)
                })
        })
    }

    findUser() {
        console.log(this.#userData)
        return new Promise((resolve, reject) => {
            db_functions.request(`Select * from users where email='${this.#userData.email}'`).then(async (value) => {
                if (value.length > 0) {
                    let userConfirm = await bcrypt.compare(this.#userData.password, value[0].password)
                    if (userConfirm) {
                        db_functions.request(`update users set fcm_token = '${this.#userData.fcm_token}' where id = '${value[0].id}'`)
                        this.#userData = {
                            "id": value[0].id,
                            "name": value[0].name,
                            "email": value[0].email,
                            "phone_no": value[0].phone_no,
                            "address": value[0].address,
                            "type": value[0].type,
                            "shop_name": value[0].shop_name,
                            // "password": value[0].password,
                            "profile_pic": value[0].profile_pic,
                        };

                        const token = this.generateNewToken();
                        this.#userData['authToken'] = token
                        resolve(this.#userData);
                    } else {
                        reject({ "error": "user not found" })
                    }
                } else {
                    reject({ "error": "email not found" })
                }
            })
                .catch((err) => {
                    console.log(err)
                    reject(err)
                })
        })
        // return this.#userData
    }

    getAllUsers() {
        return new Promise((resolve, reject) => {
            db_functions.request(`Select * from users`).then(async (users) => {
                resolve(users)
            }).catch((err) => {
                reject(err)
            })
        })
        // return this.#userData
    }

    getUsersByType(userType) {
        return new Promise((resolve, reject) => {
            db_functions.request(`Select * from users where type='${userType}'`).then(async (users) => {
                resolve(users)
            }).catch((err) => {
                reject(err)
            })
        })
        // return this.#userData
    }

    UpdatePassword() {
        return new Promise((resolve, reject) => {
            db_functions.request(`Update users set password='${this.#userData.password}' where email='${this.#userData.email}'`).then(async (value) => {
                resolve(value)
            })
                .catch((err) => {
                    console.log(err)
                    reject(err)
                })
        })
    }

    UpdateProfilePic() {
        return new Promise((resolve, reject) => {
            db_functions.request(`Update users set profile_pic='${this.#userData.profile_pic}' where id='${this.#userData.id}'`).then(async (value) => {
                resolve(value)
            })
                .catch((err) => {
                    console.log(err)
                    reject(err)
                })
        })
    }

    getUserById(id){
        return new Promise((resolve, reject) => {
            db_functions.request(`Select * from users where id='${this.#userData.id}'`).then(async (value) => {
                resolve(value[0])
            })
                .catch((err) => {
                    console.log(err)
                    reject(err)
                })
        }) 
    }


}

module.exports = User

