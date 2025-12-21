import { orderSummary } from "./checkout/ordersummary.js";
import { renderPaymentSummary } from "./checkout/paymentsummary.js";
import '../data/classCart.js';
import { loadProducts } from "../data/products.js";
// import '../data/backend.js';


loadProducts(()=> {
 renderPaymentSummary();
 orderSummary();
})
