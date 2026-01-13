import { orders, removeProductFromOrder } from '../data/orders.js';
import { products, LoadProductsFetch } from '../data/products.js';
import { getDeliveryOption } from '../data/deliveryoptions.js';
import { formatcurrency } from './utils/money.js';
import { cart } from '../data/cart.js';
import { updateAuthHeader } from '../data/auth.js';

// Update auth header
updateAuthHeader();

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

// Calculate delivery date from order time and delivery option
function getDeliveryDate(orderTime, deliveryDays) {
    const deliveryDate = new Date(orderTime);
    deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
    return deliveryDate;
}

// Format date for display
function formatDate(date) {
    const options = { month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Check if product is delivered (delivery date has passed)
function isDelivered(orderTime, deliveryDays) {
    const deliveryDate = getDeliveryDate(orderTime, deliveryDays);
    return new Date() >= deliveryDate;
}

// Get product details by ID
function getProductById(productId) {
    return products.find(p => p.id === productId);
}

// Render orders separated by delivery status
function renderOrders() {
    const ordersGrid = document.querySelector('.js-orders-grid');

    if (orders.length === 0) {
        ordersGrid.innerHTML = `
      <div class="empty-orders">
        <p>You have no orders yet.</p>
        <a href="index.html" class="link-primary">Continue shopping</a>
      </div>
    `;
        return;
    }

    // Separate orders into current and delivered
    const currentOrders = [];
    const deliveredOrders = [];

    orders.forEach(order => {
        // Check each product in the order
        const orderProducts = order.products || [];
        let hasCurrentItems = false;
        let hasDeliveredItems = false;

        orderProducts.forEach(orderProduct => {
            const deliveryOption = getDeliveryOption(orderProduct.deliveryOptionId);
            if (isDelivered(order.orderTime, deliveryOption.deliverytime)) {
                hasDeliveredItems = true;
            } else {
                hasCurrentItems = true;
            }
        });

        // Add order to appropriate lists (can appear in both if mixed)
        if (hasCurrentItems) currentOrders.push({ ...order, filterType: 'current' });
        if (hasDeliveredItems) deliveredOrders.push({ ...order, filterType: 'delivered' });
    });

    let html = '';

    // Current Orders Section
    if (currentOrders.length > 0) {
        html += `<div class="orders-section">
      <h2 class="orders-section-title">Current Orders</h2>
      ${renderOrdersList(currentOrders, 'current')}
    </div>`;
    }

    // Delivered Orders Section
    if (deliveredOrders.length > 0) {
        html += `<div class="orders-section">
      <h2 class="orders-section-title">Delivered</h2>
      ${renderOrdersList(deliveredOrders, 'delivered')}
    </div>`;
    }

    ordersGrid.innerHTML = html;
}

// Render a list of orders
function renderOrdersList(ordersList, filterType) {
    let html = '';

    ordersList.forEach(order => {
        const orderDate = new Date(order.orderTime);
        const formattedOrderDate = formatDate(orderDate);

        // Calculate total
        let totalCents = 0;
        const orderProducts = order.products || [];
        orderProducts.forEach(orderProduct => {
            const product = getProductById(orderProduct.productId);
            if (product) {
                totalCents += product.priceCents * orderProduct.quantity;
            }
            const deliveryOption = getDeliveryOption(orderProduct.deliveryOptionId);
            totalCents += deliveryOption.priceCents;
        });

        html += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${formattedOrderDate}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatcurrency(totalCents)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>

        <div class="order-details-grid">
          ${renderOrderProducts(order, filterType)}
        </div>
      </div>
    `;
    });

    return html;
}

// Render products within an order
function renderOrderProducts(order, filterType) {
    let html = '';
    const orderProducts = order.products || [];

    orderProducts.forEach(orderProduct => {
        const product = getProductById(orderProduct.productId);
        if (!product) return;

        const deliveryOption = getDeliveryOption(orderProduct.deliveryOptionId);
        const deliveryDate = getDeliveryDate(order.orderTime, deliveryOption.deliverytime);
        const isItemDelivered = isDelivered(order.orderTime, deliveryOption.deliverytime);

        // Filter based on section
        if (filterType === 'current' && isItemDelivered) return;
        if (filterType === 'delivered' && !isItemDelivered) return;

        const deliveryText = isItemDelivered
            ? `Delivered on: ${formatDate(deliveryDate)}`
            : `Arriving on: ${formatDate(deliveryDate)}`;

        const trackButtonText = isItemDelivered ? 'View order' : 'Track package';

        html += `
      <div class="product-image-container">
        <img src="${product.image}">
      </div>

      <div class="product-details">
        <div class="product-name">
          ${product.name}
        </div>
        <div class="product-delivery-date ${isItemDelivered ? 'delivered' : ''}">
          ${deliveryText}
        </div>
        <div class="product-quantity">
          Quantity: ${orderProduct.quantity}
        </div>
        <button class="buy-again-button button-primary js-buy-again" data-product-id="${product.id}">
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        </button>
      </div>

      <div class="product-actions">
        <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
          <button class="track-package-button button-secondary">
            ${trackButtonText}
          </button>
        </a>
        ${filterType === 'current' ? `
          <button class="cancel-order-button button-secondary js-cancel-order" 
            data-order-id="${order.id}" 
            data-product-id="${product.id}">
            Cancel Order
          </button>
        ` : ''}
      </div>
    `;
    });

    return html;
}

// Setup Buy Again functionality
function setupBuyAgain() {
    document.querySelectorAll('.js-buy-again').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            cart.addToCart(productId, 1);
            updateCartQuantity();

            // Show feedback
            button.innerHTML = `
        <img class="buy-again-icon" src="images/icons/checkmark.png">
        <span class="buy-again-message">Added!</span>
      `;

            setTimeout(() => {
                button.innerHTML = `
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        `;
            }, 1500);
        });
    });
}

// Setup Cancel Order functionality
function setupCancelOrder() {
    document.querySelectorAll('.js-cancel-order').forEach(button => {
        button.addEventListener('click', () => {
            const orderId = button.dataset.orderId;
            const productId = button.dataset.productId;

            if (confirm('Are you sure you want to cancel this item?')) {
                removeProductFromOrder(orderId, productId);
                // Re-render the orders page
                renderOrders();
                setupBuyAgain();
                setupCancelOrder();
            }
        });
    });
}

// Initialize page
LoadProductsFetch().then(() => {
    updateCartQuantity();
    renderOrders();
    setupBuyAgain();
    setupCancelOrder();
});
