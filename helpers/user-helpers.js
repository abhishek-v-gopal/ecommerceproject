var db=require('../config/connection')
var collection=require('../config/collection')
const bcrypt=require('bcrypt')
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
    }
}