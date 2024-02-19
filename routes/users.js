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
router.get('/', async (req,res,next)=>{
  let user=req.session.user
  console.log(user)
  let cartCount=null
  if(req.session.user){
 
    cartCount=await userHelper.getCartCount(req.session.user._id)
}
  productHelpers.getallproducts().then((product)=>{
    res.render('users/view-products',{product,user,cartCount})
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

 router.get('/add-to-cart/:id',(req,res)=>{
    console.log(req.params.id)
    console.log(req.session.user._id)
    console.log("api call")
   userHelper.addTOCart(req.params.id,req.session.user._id).then(()=>{
    res.json({status:true})
   })
 })

 router.post('/change-product-quantity',(req,res,next)=>{
  console.log(req.body)
  userHelper.ChangeProductQuantity(req.body).then(()=>{
    res.json(response)
  })
 })

 router.post('/remove-cart-product', (req, res) => {
  userHelper.removeCartProduct(req.body)
    res.redirect('/cart')
})


module.exports = router;