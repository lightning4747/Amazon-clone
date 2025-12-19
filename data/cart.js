// data/cart.js

// Load cart from localStorage and migrate old property names if needed
let rawCart = JSON.parse(localStorage.getItem('cart')) || [];

// Migrate old cart format to new format
export let cart = rawCart.map(item => {
  // If item has old property names, convert them
  if (item.ProductId !== undefined) {
    return {
      productId: item.ProductId,
      quantity: item.quantity,
      deliveryOptionId: item.deliveryoptions || item.deliveryOptionId || '1'
    };
  }
  // If already in new format, return as-is
  return {
    productId: item.productId,
    quantity: item.quantity,
    deliveryOptionId: item.deliveryOptionId || '1'
  };
});

// Save migrated cart back to localStorage if migration occurred
if (rawCart.length > 0 && rawCart.some(item => item.ProductId !== undefined)) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, quantity) {
  let matchingItem;

  cart.forEach(item => {
    if (item.productId === productId) {
      matchingItem = item;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId: productId,
      quantity: quantity,
      deliveryOptionId: '1'
    });
  }

  saveCart();
}

export function removeProduct(productId) {
  const newCart = [];

  cart.forEach((item) => {
    if (item.productId !== productId) {
      newCart.push(item);
    }
  });

  cart = newCart;
  saveCart();
}