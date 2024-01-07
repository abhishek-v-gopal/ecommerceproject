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
      
    },
    doLogin: (userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}
            let user=await db.collection(collection.USER_COLLECTION).findOne({email:userData.email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((result)=>{
                    if(status){
                        console.log("login succes")
                    }else{
                        console.log('login failed')
                    }
                })
            }else{
                console.log('email not match')
            }
        })
    }
}