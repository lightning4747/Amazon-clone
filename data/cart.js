export const cart =[

]

export function addToCart(productID, quantity) {
      let matchingitem;

    cart.forEach((item)=> {
      if ( productID === item.ProductId) {
        matchingitem = item;
      }
    });

    if(matchingitem) {
      matchingitem.quantity += quantity;
    }
    else {
    cart.push({
      ProductId : productID,
      quantity : quantity
    });
  }
}
