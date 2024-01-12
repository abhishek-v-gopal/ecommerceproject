var db=require('../config/connection')
var collection=require('../config/collection')
const {ObjectId}=require('mongodb') 
const { response } = require('express');
// var objectId=require('mongodb').objectID
module.exports={
    addProduct:(product,callback)=>{
        // console.log(product)
        db.collection('product').insertOne(product).then((data)=>{
            console.log(data)
            callback(data.insertedId)
            console.log("done done")

        })
    },
    getallproducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let product=await db.collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(product)
        })
    },
    deleteProduct:(productId)=>{
        return new Promise((resolve,reject)=>{
            db.collection(collection.PRODUCT_COLLECTION).deleteOne({_id:new ObjectId(productId)}).then((response)=>{
                console.log(response)
                resolve(response)
            })
        })
    },
    getProductDetails:(productId)=>{
        return new Promise((resolve,reject)=>{
            db.collection(collection.PRODUCT_COLLECTION).findOne({_id:new ObjectId(productId)}).then((product)=>{
                resolve(product)
            })
        })

    },
    updateProduct:(productId,prodetails)=>{
        return new Promise((resolve,reject)=>{
            db.collection(collection.PRODUCT_COLLECTION)
            .updateOne({_id:new ObjectId(productId)},{
                $set:{
                    Name:prodetails.Name,
                    description:prodetails.description,
                    Price:prodetails.Price,
                    catagory:prodetails.catagory
                }
            }).then((response)=>{
                resolve()
            })
        })
    }
}