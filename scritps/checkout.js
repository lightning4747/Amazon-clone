import { cart } from "../data/cart.js";
import { products } from "../data/products.js";

let cartSummary = '';

cart.forEach(item => {
  const productID = item.ProductId;

  const match = products.find(product => product.id === productID);
  if (!match) return;

  cartSummary += `
    <div class="cart-item-container">
      <div class="delivery-date">
        Delivery date: Tuesday, June 21
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${match.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${match.name}
          </div>
          <div class="product-price">
            $${(match.priceCents / 100).toFixed(2)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${item.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary">
              Update
            </span>
            <span class="delete-quantity-link link-primary">
              Delete
            </span>
          </div>
        </div>
      </div>
    </div>
  `;
});

document.querySelector(".order-summary").innerHTML = cartSummary;
