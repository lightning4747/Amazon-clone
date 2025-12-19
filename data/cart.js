// data/cart.js

export const cart = JSON.parse(localStorage.getItem('cart')) || [];

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
