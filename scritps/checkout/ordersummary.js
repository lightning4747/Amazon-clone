import { cart } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { formatcurrency } from "../utils/money.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js'; //default export
import { deliveryoptions, getDeliveryOption } from '../../data/deliveryoptions.js';
import { renderPaymentSummary } from "./paymentsummary.js";

function deliveryoptionsHTML(id, cartItem) {
  let html = '';
  deliveryoptions.forEach((item) => {
    const today = dayjs();
    const deliverydate = today.add(item.deliverytime, 'days');

    const dateString = deliverydate.format('dddd, MMMM D');
    const priceString = item.priceCents === 0 ? "FREE" : `$${formatcurrency(item.priceCents)}`;

    const ischecked = item.id === cartItem.deliveryOptionId;

    html += `
        <div class="delivery-option js-delivery-option"
        data-product-id="${id}"
        data-delivery-option-id="${item.id}">
          <input type="radio"
            ${ischecked ? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} - Shipping
            </div>
          </div>
        </div>
      `;
  });
  return html;
}

export function orderSummary() {
  let cartSummary = '';
  const orderSummaryElement = document.querySelector(".order-summary");
  const updatecheckout = document.querySelector(".js-update-count");

  if (!orderSummaryElement) {
    console.error('Order summary element not found');
    return;
  }

  cart.cartItems.forEach((item) => {
    const productId = item.productId;

    const match = products.find(product => product.id === productId);
    if (!match) {
      return;
    }

    // Ensure deliveryOptionId exists, default to '1' if missing
    const deliveryOptionId = item.deliveryOptionId || '1';

    const deliveryOption = getDeliveryOption(deliveryOptionId);
    if (!deliveryOption) {
      return;
    }

    const today = dayjs();
    const deliverydate = today.add(deliveryOption.deliverytime, 'days');
    const dateString = deliverydate.format('dddd, MMMM D');

    cartSummary += `
  <div class="cart-item-container
  js-cart-item-container
  js-cart-container-${match.id}">
    <div class="delivery-date">
      Delivery date: ${dateString}
    </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${match.image}">

              <div class="cart-item-details">
                <div class="product-name">
                 ${match.name}
                </div>
                <div class="product-price">
                  ${match.getPrice()}
                </div>
                <div class="product-quantity
                js-product-quantity-${match.id}
                ">
                  <span>
                    Quantity: <span class="quantity-label js-quantity-label-${match.id}">${item.quantity}</span>
                  </span>
                  <input class="quantity-input js-quantity-input-${match.id}">
                  <span class="save-quantity-link link-primary js-save-link" data-product-id="${match.id}">
                    Save
                  </span>
                  <span class="update-quantity-link link-primary js-update-link" data-product-id="${match.id}">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-link
                  js-delete-link-${match.id}
                  " data-product-id="${match.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
               
               ${deliveryoptionsHTML(match.id, item)}
              </div>
            </div>
          </div>
  `;
  });

  orderSummaryElement.innerHTML = cartSummary;

  // Update cart count
  let total = 0;
  cart.cartItems.forEach((item) => {
    total += item.quantity;
  });
  if (updatecheckout) {
    if (!isNaN(total)) {
      updatecheckout.innerHTML = `${total} items`;
    } else {
      updatecheckout.innerHTML = `0 items`;
    }
  }

  // Attach event listeners for delete links
  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      cart.removeFromCart(productId);

      const container = document.querySelector(`.js-cart-container-${productId}`);
      if (container) {
        container.remove();
      }
      renderPaymentSummary();
      orderSummary(); // Re-render to update the display
    });
  });

  // Attach event listeners for update links
  document.querySelectorAll(".js-update-link").forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(`.js-cart-container-${productId}`);
      if (container) {
        container.classList.add('is-editing-quantity');

        // Focus the input and set current quantity
        const input = container.querySelector(`.js-quantity-input-${productId}`);
        const currentQty = container.querySelector(`.js-quantity-label-${productId}`).innerText;
        input.value = currentQty;
        input.focus();
      }
    });
  });

  // Attach event listeners for save links
  document.querySelectorAll(".js-save-link").forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(`.js-cart-container-${productId}`);
      const input = container.querySelector(`.js-quantity-input-${productId}`);
      const newQuantity = Number(input.value);

      if (newQuantity <= 0 || isNaN(newQuantity)) {
        alert('Quantity must be at least 1');
        return;
      }

      cart.updateQuantity(productId, newQuantity);
      container.classList.remove('is-editing-quantity');

      renderPaymentSummary();
      orderSummary();
    });
  });

  // Attach event listeners for delivery options
  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener('click', () => {
      const productId = element.dataset.productId;
      const deliveryOptionId = element.dataset.deliveryOptionId;

      if (!productId || !deliveryOptionId) {
        console.error('Missing data attributes:', element.dataset);
        return;
      }

      // Check the radio button
      const radioInput = element.querySelector('.delivery-option-input');
      if (radioInput) {
        radioInput.checked = true;
      }

      cart.updateDeliveryOption(productId, deliveryOptionId);

      // Find the delivery option to get the new date
      const deliveryOption = deliveryoptions.find(opt => opt.id === deliveryOptionId);
      if (deliveryOption) {
        const today = dayjs();
        const deliverydate = today.add(deliveryOption.deliverytime, 'days');
        const dateString = deliverydate.format('dddd, MMMM D');

        // Update the delivery date in the DOM
        const container = document.querySelector(`.js-cart-container-${productId}`);
        if (container) {
          const deliveryDateElement = container.querySelector('.delivery-date');
          if (deliveryDateElement) {
            deliveryDateElement.textContent = `Delivery date: ${dateString}`;
          }
        }
      }
      renderPaymentSummary();
    });
  });
}
