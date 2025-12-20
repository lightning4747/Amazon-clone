import { cart } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryoptions.js";
import { formatcurrency } from "../utils/money.js";

export function renderPaymentSummary() {
    let prodcutPriceCents = 0;
    let shippingPriceCents = 0;

     cart.forEach((item) => {
      const productId = item.productId;
      const match = products.find(product => product.id === productId);

      prodcutPriceCents += match.priceCents * item.quantity;
      const deliveryOption = getDeliveryOption(item.deliveryOptionId)
      shippingPriceCents = deliveryOption.priceCents;
      
    });

    const beforetax = prodcutPriceCents + shippingPriceCents;
    const tax =  beforetax * 0.1
    const totalCents = beforetax + tax;

    const paymentsummaryHtml = `
         <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (3):</div>
            <div class="payment-summary-money">$${formatcurrency(prodcutPriceCents)}5</div>
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

          <button class="place-order-button button-primary">
            Place your order
          </button>
    `;

    document.querySelector(".js-payment-summary").innerHTML = paymentsummaryHtml;
}