import { orders } from '../data/orders.js';
import { products, LoadProductsFetch } from '../data/products.js';
import { getDeliveryOption } from '../data/deliveryoptions.js';
import { cart } from '../data/cart.js';
import { updateAuthHeader } from '../data/auth.js';

// Update auth header
updateAuthHeader();

// Get URL parameters
function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        orderId: urlParams.get('orderId'),
        productId: urlParams.get('productId')
    };
}

// Update cart quantity in header
function updateCartQuantity() {
    const cartQuantityElement = document.querySelector('.js-quantity');
    if (cartQuantityElement) {
        let total = 0;
        cart.cartItems.forEach((item) => {
            total += item.quantity;
        });
        cartQuantityElement.innerHTML = total;
    }
}

// Calculate delivery status based on order date and delivery option
function calculateDeliveryStatus(orderDate, deliveryDays) {
    const orderTime = new Date(orderDate).getTime();
    const now = Date.now();
    const deliveryTime = orderTime + (deliveryDays * 24 * 60 * 60 * 1000);

    const totalDuration = deliveryTime - orderTime;
    const elapsed = now - orderTime;
    const progress = Math.min((elapsed / totalDuration) * 100, 100);

    let status = 'preparing';
    if (progress >= 100) {
        status = 'delivered';
    } else if (progress >= 50) {
        status = 'shipped';
    }

    return { progress, status };
}

// Format date for display
function formatDeliveryDate(orderDate, deliveryDays) {
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);

    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return deliveryDate.toLocaleDateString('en-US', options);
}

// Render tracking page
function renderTracking() {
    const { orderId, productId } = getUrlParams();
    const trackingContainer = document.querySelector('.js-order-tracking');

    // Find the order
    const order = orders.find(o => o.id === orderId);

    if (!order) {
        trackingContainer.innerHTML = `
      <div class="tracking-error">
        <p>Order not found.</p>
        <a href="orders.html" class="link-primary">View all orders</a>
      </div>
    `;
        return;
    }

    // Find the product in the order
    const orderProduct = order.products.find(p => p.productId === productId);

    if (!orderProduct) {
        trackingContainer.innerHTML = `
      <div class="tracking-error">
        <p>Product not found in this order.</p>
        <a href="orders.html" class="link-primary">View all orders</a>
      </div>
    `;
        return;
    }

    // Get product details from products data
    const product = products.find(p => p.id === productId);

    if (!product) {
        trackingContainer.innerHTML = `
      <div class="tracking-error">
        <p>Product details not available.</p>
        <a href="orders.html" class="link-primary">View all orders</a>
      </div>
    `;
        return;
    }

    // Get delivery option
    const deliveryOption = getDeliveryOption(orderProduct.deliveryOptionId);
    const deliveryDays = deliveryOption.deliverytime;

    // Calculate delivery status
    const { progress, status } = calculateDeliveryStatus(order.orderTime, deliveryDays);
    const deliveryDateFormatted = formatDeliveryDate(order.orderTime, deliveryDays);

    // Determine status classes
    const preparingClass = status === 'preparing' ? 'current-status' : '';
    const shippedClass = status === 'shipped' ? 'current-status' : '';
    const deliveredClass = status === 'delivered' ? 'current-status' : '';

    // Render the tracking HTML
    trackingContainer.innerHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">
      ${status === 'delivered' ? 'Delivered on' : 'Arriving on'} ${deliveryDateFormatted}
    </div>

    <div class="product-info">
      ${product.name}
    </div>

    <div class="product-info">
      Quantity: ${orderProduct.quantity}
    </div>

    <img class="product-image" src="${product.image}" alt="${product.name}">

    <div class="progress-labels-container">
      <div class="progress-label ${preparingClass}">
        Preparing
      </div>
      <div class="progress-label ${shippedClass}">
        Shipped
      </div>
      <div class="progress-label ${deliveredClass}">
        Delivered
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${progress}%;"></div>
    </div>
  `;
}

// Initialize page
LoadProductsFetch().then(() => {
    updateCartQuantity();
    renderTracking();
});
