var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  
  res.render('admin/view-products',{admin:true,product})
});
router.get('/addproduct',function(req,res){

  res.render('admin/addproducts')

})

router.post('/addproduct',(req,res)=>{
  console.log(req.body)
  console.log(req.files.Image)
  
})
module.exports = router;
