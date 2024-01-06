var db=require('../config/connection')
var collection=require('../config/collection')
const bcrypt=require('bcrypt')
module.exports={
    doSignup: (userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.Password=await bcrypt.hash(userData.Password,10)
            db.collection(collection.USER_COLLECTION).insertOne(userData).then(()=>{
                resolve(data)
            })
        })
      
    }
}