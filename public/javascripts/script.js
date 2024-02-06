function addToCart(productID){
    $.ajax({
        url:'/add-to-cart'+productID,
        method:'get',
        success:(response)=>{
            alert(response)
        }
    })
}