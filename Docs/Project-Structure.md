# Project Structure

Overview of the major files and directories in the Amazon Clone project.

## Directories

- `data/`: Core business logic and data persistence (Cart, Products, Auth, Orders).
- `scritps/`: DOM manipulation and page-specific logic.
    - `checkout/`: Logic specific to the checkout workflow.
    - `utils/`: Shared utility functions (e.g., money formatting).
- `styles/`: CSS styles organized by page and shared components.
- `images/`: Product images, icons, and UI assets.
- `tests/`: Jasmine test suites and configuration.
- `Docs/`: Project documentation.

## Core Files

- `index.html`: Home page displaying the product grid.
- `product.html`: Detailed view of a single product.
- `checkout.html`: Shopping cart and order placement page.
- `orders.html`: History of placed orders separated by delivery status.
- `tracking.html`: Simulated tracking page for order items.
- `login.html` / `signup.html`: User authentication pages.

## Key Modules

| Module | Description |
| --- | --- |
| `cart.js` | Manages the shopping cart using OOP. |
| `auth.js` | Handles client-side user registration and sessions. |
| `orders.js` | Manages order storage and cancellation. |
| `products.js` | Fetches and provides product information. |
