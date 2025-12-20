import { cart, removeProduct, updateDeliveryOption } from "../../data/cart.js";
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

  cart.forEach((item) => {
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
                  $${formatcurrency(match.priceCents)}
                </div>
                <div class="product-quantity
                js-product-quantity-${match.id}
                ">
                  <span>
                    Quantity: <span class="quantity-label">${item.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link">
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
  cart.forEach((item) => {
    total += item.quantity;
  });
  if (updatecheckout) {
    if (!isNaN(total)) {
      updatecheckout.innerHTML = `item : ${total}`;
    } else {
      updatecheckout.innerHTML = `item : 0`;
    }
  }

  // Attach event listeners for delete links
  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeProduct(productId);

      const container = document.querySelector(`.js-cart-container-${productId}`);
      if (container) {
        container.remove();
      }
      renderPaymentSummary();
      orderSummary(); // Re-render to update the display
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

      updateDeliveryOption(productId, deliveryOptionId);

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
