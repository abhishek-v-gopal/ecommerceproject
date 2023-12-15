// const mongoCinet=require('mongodb').mongoCinet
const { ClientSession } = require('mongodb');
const mongoose = require("mongoose");
// var router = express.Router();
const url='mongodb://localhost:27017'
const dbname='shopping'

const state={
    db:null
}
// module.exports.connect=function(done){
    // const url='mongodb://localhost:27017'
    // const dbname='shopping'

//     mongoCinet.connection(url,(err,data)=>{
//         if(err) return done(err)
//         state.db=data.db(dbname)
//         done()
//     })

   
// }
module.exports.connect=function(done){

    mongoose.connect(url)
    .then((client) => {
      state.db=client.db(dbname)
            done()
    })
    .catch((err) => {
        return done(err)
    });

}

module.exports.get=function(){
    return state.db
}