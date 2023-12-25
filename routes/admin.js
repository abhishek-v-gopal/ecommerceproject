var express = require('express');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  let product=[
    {
      name:"iphone",
      category:'mobail',
      description:'This is a mobail',
      link:'https://www.reliancedigital.in/medias/iPhone-14-Pro-Max-Deep-Purple-PDP-Image-493177798-i-1-1200Wx1200H-300Wx300H?context=bWFzdGVyfGltYWdlc3wyOTMwMnxpbWFnZS9qcGVnfGltYWdlcy9oMTAvaDBmLzEwMDE2OTY0NzcxODcwLmpwZ3xjNzIwNzBhNmY3ZTAxM2ZjZWI2YWYxMzFjMWRlY2I3NDllZmM4MjcyZGI5MWRkYzc2OTI2OTQ3MDQ4M2RjM2Q4'
    },{
      name:"Redme note 12",
      category:'mobail',
      description:'This is a mobail',
      link:'https://fdn.gsmarena.com/imgroot/reviews/23/xiaomi-redmi-note-12-pro/lifestyle/-1200w5/gsmarena_016.jpg'
    },{
      name:"Poco X2",
      category:'mobail',
      description:'This is a mobail',
      link:'https://www.techspot.com/images/products/2020/smartphones/org/3095629_5c66e710d4868e397c0eb8fca00697b9_500x500.jpg'
    },{
      name:"realme",
      category:'mobail',
      description:'This is a mobail',
      link:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVBnaM5JzZj7j8rl3H2U5DYmje-XudfYxZzVGxRAW2Wh011ZNAEH7rl1J_-rnbLHD1h3E&usqp=CAU'
    },
  ]
  
  res.render('admin/view-products',{admin:true,product})
});
router.get('/addproduct',function(req,res){

  res.render('admin/addproducts')

})

router.post('/addproduct',(req,res)=>{
  console.log(req.body)
  console.log(req.files.Image)
  productHelpers.addProduct(req.body,(result)=>{
    res.render("admin/addproducts")
  })
  
})
module.exports = router;
