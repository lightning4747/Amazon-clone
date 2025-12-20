// data/cart.js

// Load cart from localStorage and migrate old property names if needed
function getRawCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// Migrate old cart format to new format
export let cart = [];

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

export function loadFromStorage() {
  const rawCart = getRawCart();
  
  cart = rawCart.map(item => {
    // Handle migration from old format
    if (item.ProductId !== undefined) {
      return {
        productId: item.ProductId,
        quantity: item.quantity,
        deliveryOptionId: item.deliveryoptions || item.deliveryOptionId || '1'
      };
    }
    // Already in new format
    return {
      productId: item.productId,
      quantity: item.quantity,
      deliveryOptionId: item.deliveryOptionId || '1'
    };
  });

  // Save migrated cart back to localStorage if migration occurred
  if (rawCart.length > 0 && rawCart.some(item => item.ProductId !== undefined)) {
    saveCart();
  }
}

// Load cart on module initialization
loadFromStorage();

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

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;

  cart.forEach(item => {
    if (item.productId === productId) {
      matchingItem = item;
    }
  });

  if (!matchingItem) {
    console.error('Product not found in cart:', productId);
    return;
  }

  matchingItem.deliveryOptionId = deliveryOptionId;
  saveCart();
}