import { orderSummary } from "./checkout/ordersummary.js";
import { renderPaymentSummary } from "./checkout/paymentsummary.js";
import '../data/classCart.js';
import {  LoadProductsFetch } from "../data/products.js";
// import '../data/backend.js';

LoadProductsFetch().then(() => {
  orderSummary();
  renderPaymentSummary();
});


