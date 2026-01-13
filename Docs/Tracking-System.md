# Tracking System

The tracking system provides real-time (simulated) delivery status for products within an order.

## Tracking URL Structure

The tracking page (`tracking.html`) expects two query parameters:
- `orderId`: The unique ID of the order.
- `productId`: The unique ID of the product within that order.

Example: `tracking.html?orderId=123&productId=456`

## Delivery Status Logic

The status is calculated dynamically based on the `orderTime` and the selected `deliveryOption`:

1.  **Status Calculation**:
    - **Preparing**: Progress 0% - 49%
    - **Shipped**: Progress 50% - 99%
    - **Delivered**: Progress 100%
2.  **Progress Calculation**:
    - `totalDuration = deliveryTime - orderTime`
    - `elapsed = currentTime - orderTime`
    - `progress = (elapsed / totalDuration) * 100`

## Components

### tracking.js
- **Initialization**: Loads product data, updates the auth header, and renders the tracking info.
- **Rendering**: 
    - Finds the order and product.
    - Calculates the current status and progress.
    - Dynamically updates the DOM with product image, name, quantity, and a progress bar.

### UX Features
- **Dynamic Progress Bar**: Visual representation of the shipping status.
- **Status Labels**: Highlights the current stage (Preparing, Shipped, or Delivered).
- **Empty/Error States**: Gracefully handles invalid or missing order/product IDs.
