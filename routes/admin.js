var express = require('express');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.getallproducts().then((product)=>{
    console.log(product)
    res.render('admin/view-products',{admin:true,product})
  })
 
});
router.get('/addproduct',function(req,res){

  res.render('admin/addproducts')

})

router.post('/addproduct',(req,res)=>{
  console.log(req.body)
  console.log(req.files.Image)
  productHelpers.addProduct(req.body,(id)=>{
    let image=req.files.Image 
    console.log(id)
    // image.mv('../public/product-images/'+id+'.jpg')
    // .this(()=>{
    //   res.render("admin/addproducts")
    // })    
    // .catch((err)=>{
    //   console.log(err)
    // })
    image.mv('./public/product-images/'+id+'.jpg',(err)=>{
      if(err){
        console.log(err)
      }else{
        console.log("file uploaded")
      }
    })
  })
  
})
router.get('/delet-product/:id',(req,res)=>{
    let productId=req.params.id
    console.log(productId)
})
module.exports = router;
