import { cart, removeproduct } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatcurrency } from "./utils/money.js";

let cartSummary = '';

cart.forEach(item => {
  const productID = item.ProductId;

  const match = products.find(product => product.id === productID);
  if (!match) return;

  cartSummary += `
             <div class="cart-item-container js-cart-container-${match.id}">
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
                  $${formatcurrency(match.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">2</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id = "${match.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${match.id}">
                  <div>
                    <div class="delivery-option-date">
                      Tuesday, June 21
                    </div>
                    <div class="delivery-option-price">
                      FREE Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${match.id}">
                  <div>
                    <div class="delivery-option-date">
                      Wednesday, June 15
                    </div>
                    <div class="delivery-option-price">
                      $4.99 - Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${match.id}">
                  <div>
                    <div class="delivery-option-date">
                      Monday, June 13
                    </div>
                    <div class="delivery-option-price">
                      $9.99 - Shipping
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  `;
});

document.querySelector(".order-summary").innerHTML = cartSummary;

document.querySelectorAll(".js-delete-link").forEach((link)=> {
  link.addEventListener('click', ()=>{
    const productid = link.dataset.productId;
    removeproduct(productid);

    const container = document.querySelector(`.js-cart-container-${productid}`);
    container.remove();
  })
})