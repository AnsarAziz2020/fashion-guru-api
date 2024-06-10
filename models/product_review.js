const { response } = require("express");
const db_functions = require("../controllers/db_functions");

class ProductReview{

    store(id,rating,review,customer_id,product_id,order_id) {
        return new Promise((resolve,reject)=>{
            
            db_functions.request(`Insert into product_review (id,rating,review,customer_id,product_id) values ('${id}',${rating},'${review}','${customer_id}','${product_id}')`).then((result)=>{
            db_functions.request(`Update orders set is_review = true where id = '${order_id}' and userId = '${customer_id}'`).then((response)=>{
                resolve(response);
            })
            })
            .catch((error)=>{
                reject(error);
            })
        })
    }

    index(product_id){
        return new Promise((resolve,reject)=>{
            db_functions.request(`Select pr.*,u.name,u.profile_pic from product_review pr join users u on pr.customer_id = u.id where product_id = '${product_id}' `).then((result)=>{
                resolve(result);
            })
            .catch((error)=>{
                // console.log(error)
                reject(error);
            })
        })
    }

}

module.exports = ProductReview