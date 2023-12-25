var db=require('../config/connection')
var collection=require('../config/collection')
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
    }
}