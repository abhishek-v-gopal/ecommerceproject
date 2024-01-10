var db=require('../config/connection')
var collection=require('../config/collection')
var objectId=require('mongodb').objectId
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
            db.collection(collection.PRODUCT_COLLECTION).removeOne({_id:objectId(productId)}).then((response)=>{
                console.log(response)
                resolve(response)
            })
        })
    }
}