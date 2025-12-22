import { orderSummary } from "./checkout/ordersummary.js";
import { renderPaymentSummary } from "./checkout/paymentsummary.js";
import '../data/classCart.js';
import { loadProducts } from "../data/products.js";
// import '../data/backend.js';

new Promise((resolve)=> {
    loadProducts(()=> {
        resolve();
    });
}).then(()=> {
    renderPaymentSummary();
    orderSummary();
})


