var express = require('express');
var router = express.Router();
// var productHelper=require('../helpers/product-helpers')
const productHelpers = require('../helpers/product-helpers');
const userHelper=require('../helpers/user-helpers');
const { response } = require('../app');


/* GET home page. */
router.get('/', function(req, res, next) {
  productHelpers.getallproducts().then((product)=>{
    console.log(product)
    res.render('users/view-products',{product})
  })
  
});
router.get('/login',(req,res)=>{
  res.render('users/login')
})
router.get('/signup',(req,res)=>{
  res.render('users/signup') 
})
router.post('/signup',(req,res)=>{
  userHelper.doSignup(req.body).then((response)=>{
    console.log(response)
  })
 }) 
 router.post('/login',(req,res)=>{
   userHelper.doLogin(req.body)
 })
module.exports = router;
