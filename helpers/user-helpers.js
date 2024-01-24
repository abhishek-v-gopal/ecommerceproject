var db=require('../config/connection')
var collection=require('../config/collection')
const bcrypt=require('bcrypt')
const {ObjectId}=require('mongodb') 
const { Collection } = require('mongoose')
const e = require('express')
const { response } = require('../app')
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
        return new Promise(async(resolve,reject)=>{
            let userCart=await db.collection(collection.CART_COLLECTION).findOne({user:new ObjectId(userID)})
            if(userCart){
                db.collection(collection.CART_COLLECTION).updateOne({user:new ObjectId(userID)},
                {
                    $push:{products:new ObjectId(productID)}
                                    
                }
                ).then((response)=>{
                    resolve()
                })
            }else{
                let cartObj={
                    user:new ObjectId(userID),
                    products:[new ObjectId(productID)]
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
                    $match:{user:new ObjectId(userID)}
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        let:{productslist:'$products'},
                        pipeline:[
                            {
                               $match:{
                                
                                $expr:{
                                    $in:['$_id',"$$productslist"]
                                }
                               }  
                            }
                        ],
                        as:'cartItems'
                    }
                } 
                    
            ]).toArray()
            resolve(cartItems[0].cartItems)
        })
    }
}