// data/cart.js

export let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productID, quantity) {
  let matchingItem;

  cart.forEach(item => {
    if (item.ProductId === productID) {
      matchingItem = item;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      ProductId: productID,
      quantity: quantity
    });
  }

  saveCart();
}

export function removeproduct(productid) {
  const newCart = [];

  cart.forEach((item)=> {
    if(item.ProductId !== productid) {
      newCart.push(item);
    }
  });

  cart = newCart;
}