import { cart } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryoptions.js";
import { formatcurrency } from "../utils/money.js";
import { addOrder } from "../../data/orders.js";

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  let cartQuantity = 0;

  cart.cartItems.forEach((item) => {
    const productId = item.productId;
    const match = products.find(product => product.id === productId);

    productPriceCents += match.priceCents * item.quantity;
    cartQuantity += item.quantity;

    const deliveryOption = getDeliveryOption(item.deliveryOptionId)
    shippingPriceCents += deliveryOption.priceCents;

  });

  const beforetax = productPriceCents + shippingPriceCents;
  const tax = beforetax * 0.1
  const totalCents = beforetax + tax;

  const paymentsummaryHtml = `
         <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (${cartQuantity}):</div>
            <div class="payment-summary-money">$${formatcurrency(productPriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatcurrency(shippingPriceCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatcurrency(beforetax)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatcurrency(tax)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatcurrency(totalCents)}</div>
          </div>

          <button class="place-order-button button-primary 
          js-place-order">
            Place your order
          </button>
    `;

  document.querySelector(".js-payment-summary").innerHTML = paymentsummaryHtml;

  document.querySelector('.js-place-order')
    .addEventListener('click', async () => {
      try {
        const response = await fetch('https://supersimplebackend.dev/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            cart: cart
          })
        });

        const order = await response.json();
        addOrder(order);
        cart.clearCart();
      }
      catch (error) {
        console.log(error);
      }

      window.location.href = 'orders.html';
    });
}