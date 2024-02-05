var express = require('express');
var router = express.Router();
// var productHelper=require('../helpers/product-helpers')
const productHelpers = require('../helpers/product-helpers');
const userHelper=require('../helpers/user-helpers');
const { response } = require('../app');
const userHelpers = require('../helpers/user-helpers');
const verifylogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
 }
/* GET home page. */
router.get('/', function(req, res, next) {
  let user=req.session.user
  console.log(user)
  let cartCount=userHelpers.getCartCount(req.session.user._id)
  productHelpers.getallproducts().then((product)=>{
    res.render('users/view-products',{product,user})
  })
  
});
router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
    res.render('users/login',{"loginErr":req.session.loginErr})
    req.sessionloginErr=false
  }
})
router.get('/signup',(req,res)=>{
  res.render('users/signup') 
})
router.post('/signup',(req,res)=>{
  userHelper.doSignup(req.body).then((response)=>{
    console.log(response)
    req.session.loggedIn=true
    req.session.user=response
    res.redirect('/')
  })
 }) 
 router.post('/login',(req,res)=>{
   userHelper.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')
    }else{
      req.session.loginErr ="Invalid username or password"
      res.redirect('/login')
    }
   })
 })
 router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/login')
 })
 router.get('/cart',verifylogin,async(req,res)=>{
  let products=await userHelper.getCartProducts(req.session.user._id)
  console.log(products)
  res.render('users/cart',{products,user:req.session.user})
 })

 router.get('/add-to-cart/:id',verifylogin,(req,res)=>{
    console.log(req.params.id)
    console.log(req.session.user._id)
   userHelper.addTOCart(req.params.id,req.session.user._id).then(()=>{
    res.redirect('/')
   })
 })

module.exports = router;