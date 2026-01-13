export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order) {
    orders.unshift(order);
    saveToStorage();
}

// Remove a specific product from an order
export function removeProductFromOrder(orderId, productId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return false;

    // Filter out the product
    order.products = order.products.filter(p => p.productId !== productId);

    // If no products left, remove the entire order
    if (order.products.length === 0) {
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            orders.splice(orderIndex, 1);
        }
    }

    saveToStorage();
    return true;
}

function saveToStorage() {
    localStorage.setItem('orders', JSON.stringify(orders));
}
