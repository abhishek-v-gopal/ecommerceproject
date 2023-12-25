var express = require('express');
var router = express.Router();
// var productHelper=require('../helpers/product-helpers')
const productHelpers = require('../helpers/product-helpers');


/* GET home page. */
router.get('/', function(req, res, next) {
  productHelpers.getallproducts().then((product)=>{
    console.log(product)
    res.render('users/view-products',{product})
  })
  
});

module.exports = router;
