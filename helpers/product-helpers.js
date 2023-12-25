var db=require('../config/connection')
module.exports={
    addProduct:(product,callback)=>{
        // console.log(product)
        db.collection('product').insertOne(product).then((data)=>{
            console.log(data)
            callback(data.insertedId)
            console.log("done done")

        })
    }
}