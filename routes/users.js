var express = require('express');
var router = express.Router();
// var productHelper=require('../helpers/product-helpers')
const productHelpers = require('../helpers/product-helpers');
const userHelper=require('../helpers/user-helpers');
const { response } = require('../app');
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
    req.session.loggedIn.user
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
 router.get('/cart',verifylogin,(req,res)=>{
  
  res.render('users/cart')
 })

module.exports = router;