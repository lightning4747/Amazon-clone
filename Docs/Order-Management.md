# Order Management Module

This module handles order placement, storage, and status categorization into "Current Orders" and "Delivered" sections.

## Order Structure

Orders are stored in `localStorage` under the key `orders`. Each order object follows this structure:

```json
{
  "id": "27cba69d-4c3d-4098-b42d-ac7fa62b7664",
  "orderTime": "2024-08-12T10:00:00.000Z",
  "totalCostCents": 3506,
  "products": [
    {
      "productId": "3ebe75dc-64d2-4137-8860-1f5a963e534b",
      "quantity": 1,
      "deliveryOptionId": "1",
      "estimatedDeliveryTime": "2024-08-15T10:00:00.000Z"
    }
  ]
}
```

## Functions

### addOrder(order)
Adds a new order to the beginning of the `orders` list and saves it to `localStorage`.

### removeProductFromOrder(orderId, productId)
Removes a specific product from an order. 
- If the order has other products, only the specified product is removed.
- If it's the last product in the order, the entire order is deleted.

## Page Logic (orders.js)

The `orders.js` script handles the dynamic rendering of the `orders.html` page:

1.  **Section Categorization**:
    - **Current Orders**: Products whose estimated delivery date is in the future.
    - **Delivered**: Products whose estimated delivery date has passed.
2.  **Buy It Again**: Adds the product back to the cart with a quantity of 1.
3.  **Cancel Order**: Allows users to cancel items in the "Current Orders" section. This action triggers `removeProductFromOrder()` and refreshes the UI.
4.  **Track Package**: Links to the tracking page for the specific order and product.
