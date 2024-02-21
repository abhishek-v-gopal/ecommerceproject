var db=require('../config/connection')
var collection=require('../config/collection')
const bcrypt=require('bcrypt')
const {ObjectId}=require('mongodb') 
const { Collection } = require('mongoose')
const e = require('express')
const { response } = require('../app')
const { log } = require('handlebars')
module.exports={
    doSignup: (userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.Password=await bcrypt.hash(userData.Password,10)
            db.collection(collection.USER_COLLECTION).insertOne(userData).then(()=>{
                resolve(userData)
            })
        })
      
    },
    doLogin: (userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}
            let user=await db.collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        console.log("login succes")
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                        console.log('login failed')
                        resolve({status:false})
                    }
                })
            }else{
                console.log('email not match')
                resolve({status:false})

            }
        })
    },
    addTOCart: (productID,userID)=>{
        let productobject={
            item:new ObjectId(productID),
            quantity:1
        }
        return new Promise(async(resolve,reject)=>{
            let userCart=await db.collection(collection.CART_COLLECTION).findOne({user:new ObjectId(userID)})
            if(userCart){
                let proExist=userCart.products.findIndex(product=> product.item==productID)
                console.log(proExist)
                if(proExist!=-1){
                    db.collection(collection.CART_COLLECTION).updateOne({user:new ObjectId(userID),'products.item':new ObjectId(productID)},
                    {
                        $inc:{'products.$.quantity':1}
                    }).then(()=>{
                        resolve()
                    })
                }else
                {
                db.collection(collection.CART_COLLECTION).updateOne({user:new ObjectId(userID)},
                {
                    $push:{products:productobject}
                }
                ).then((response)=>{
                    resolve()
                })
            }
            }else{
                let cartObj={
                    user:new ObjectId(userID),
                    products:[productobject]
                }
                db.collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve()
                }).catch((error) => {
                    reject(error);
                });
            }
        })
    },
    getCartProducts:(userID)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems=await db.collection(collection.CART_COLLECTION).aggregate([
                {
                    $match: { user:new ObjectId(userID) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item :'$products.item',
                        quantity : '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as: 'product'
                    }
                },
                {
                    $project:{
                        item: 1,
                        quantity: 1,
                        product: {$arrayElemAt: ['$product', 0]}

                    }
                }
               
                // {
                //     $project: {
                //         item: 1,
                //         quantity: 1,
                //         product: { $arrayElemAt: ['$product', 0] }
                //     }
                // }

            ]).toArray()
            // resolve(cartItems)
            // console.log(cartItems[0].product)\
            resolve(cartItems)
        })
    },
    getCartCount:(userID)=>{
        return new Promise(async(resolve,reject)=>{
            let count=0
            let cart=await db.collection(collection.CART_COLLECTION).findOne({user:new ObjectId(userID)})
            if(cart)
            {
                count=cart.products.length
            }
            resolve(count)
        })
    },
    ChangeProductQuantity:(details)=>{
        details.count=parseInt(details.count)
        details.quantity=parseInt(details.quantity)

        return new Promise((resolve,reject)=>{
            if(details.count==-1 && details.quantity==1){
                db.collection(collection.CART_COLLECTION).updateOne({_id:new ObjectId(details.cart)},
                {
                    $pull:{products:{item:new ObjectId(details.product)}}
                }
                ).then((response)=>{
                    resolve({removeProduct:true})
                })

            }else{
                db.collection(collection.CART_COLLECTION).updateOne({_id:new ObjectId(details.cart),'products.item':new ObjectId(details.product)},
                        {
                            $inc:{'products.$.quantity':details.count}
                        }).then((response)=>{
                            resolve(true)
                        }) 
            }
        })
    },
    removeCartProduct: (details) => {
        return new Promise((resolve, reject) => {
            db.collection(collection.CART_COLLECTION)
                .updateOne({_id:new ObjectId(details.cart)},
                {
                    $pull: {products: {item:new ObjectId(details.product)} }
                }
            ).then((response)=>{
                resolve()
            })
        })
    },
    getTotalAmount: (userID)=>{
        return new Promise(async(resolve,reject)=>{
            let total=await db.collection(collection.CART_COLLECTION).aggregate([
                {
                    $match: { user:new ObjectId(userID) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item :'$products.item',
                        quantity : '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as: 'product'
                    }
                },
                {
                    $project:{
                        item: 1,
                        quantity: 1,
                        product: {$arrayElemAt: ['$product', 0]}

                    }
                },
                {
                    $group:{
                        _id:null,
                        total:{$sum:{$multiply:['$quantity','$product.Price']}}
                    }
                }
               
                // {
                //     $project: {
                //         item: 1,
                //         quantity: 1,
                //         product: { $arrayElemAt: ['$product', 0] }
                //     }
                // }

            ]).toArray()
            if (total && total[0] && total[0].total !== undefined) {
                console.log(total[0].total);
                resolve(total[0].total)
            } else {
                console.error("Total is undefined or does not have the expected structure.");
            }
            
        })

    }
}