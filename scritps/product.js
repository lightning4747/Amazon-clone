import { cart } from "../data/cart.js";
import { products, LoadProductsFetch } from "../data/products.js";
import { getReviewsForProduct, getAverageRating } from "../data/reviews.js";
import { updateAuthHeader } from "../data/auth.js";

// Update auth header on page load
updateAuthHeader();

// Get product ID from URL
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('productId');
}

// Find product by ID
function findProduct(productId) {
    return products.find(product => product.id === productId);
}

// Update cart quantity display
function updateCartQuantity() {
    let total = 0;
    cart.cartItems.forEach((item) => {
        total += item.quantity;
    });
    document.querySelector(".js-quantity").innerHTML = total;
}

// Render product details
function renderProductDetails(product) {
    // Update page title
    document.title = `${product.name} - Amazon`;

    // Update breadcrumb category
    const category = product.keywords ? product.keywords[0] : 'Product';
    document.querySelector('.js-product-category').textContent =
        category.charAt(0).toUpperCase() + category.slice(1);

    // Update product image
    document.querySelector('.js-product-image').src = product.image;
    document.querySelector('.js-product-image').alt = product.name;

    // Update product name
    document.querySelector('.js-product-name').textContent = product.name;

    // Update rating
    document.querySelector('.js-product-stars').src = product.getStarsUrl();
    document.querySelector('.js-product-rating-text').textContent = `${product.rating.stars} out of 5`;
    document.querySelector('.js-reviews-count').textContent = `${product.rating.count} ratings`;

    // Update price
    document.querySelector('.js-product-price').textContent = product.getPrice();

    // Update extra info (like size chart for clothing)
    document.querySelector('.js-extra-info').innerHTML = product.extraInfo();
}

// Render reviews section
function renderReviews(productId) {
    const reviews = getReviewsForProduct(productId);
    const averageRating = getAverageRating(productId);

    // Update summary
    document.querySelector('.js-average-rating').textContent = averageRating;
    document.querySelector('.js-total-reviews').textContent = `${reviews.length} customer reviews`;

    // Render review items
    let reviewsHTML = '';
    reviews.forEach(review => {
        const starsUrl = `images/ratings/rating-${review.rating * 10}.png`;
        const formattedDate = new Date(review.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        reviewsHTML += `
      <div class="review-item">
        <div class="review-header">
          <span class="review-author">${review.author}</span>
          <span class="review-date">${formattedDate}</span>
        </div>
        <div class="review-rating">
          <img class="review-stars" src="${starsUrl}" alt="${review.rating} stars">
          <span class="review-title">${review.title}</span>
        </div>
        <p class="review-text">${review.text}</p>
      </div>
    `;
    });

    document.querySelector('.js-reviews-list').innerHTML = reviewsHTML;
}

// Render other products section
function renderOtherProducts(currentProductId) {
    // Get random products excluding the current one
    const otherProducts = products
        .filter(p => p.id !== currentProductId)
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);

    let productsHTML = '';
    otherProducts.forEach(product => {
        productsHTML += `
      <a href="product.html?productId=${product.id}" class="other-product-card">
        <div class="other-product-image-container">
          <img class="other-product-image" src="${product.image}" alt="${product.name}">
        </div>
        <div class="other-product-name">${product.name}</div>
        <div class="other-product-rating">
          <img class="other-product-stars" src="${product.getStarsUrl()}" alt="${product.rating.stars} stars">
          <span class="other-product-rating-count">${product.rating.count}</span>
        </div>
        <div class="other-product-price">${product.getPrice()}</div>
      </a>
    `;
    });

    document.querySelector('.js-other-products').innerHTML = productsHTML;
}

// Setup Add to Cart functionality
function setupAddToCart(product) {
    const addToCartBtn = document.querySelector('.js-add-to-cart');
    const addedMessage = document.querySelector('.js-added-message');
    let addedTimeout;

    addToCartBtn.addEventListener('click', () => {
        const quantity = Number(document.querySelector('.js-quantity-selector').value);

        cart.addToCart(product.id, quantity);
        updateCartQuantity();

        // Show added message
        addedMessage.classList.add('is-visible');

        if (addedTimeout) {
            clearTimeout(addedTimeout);
        }

        addedTimeout = setTimeout(() => {
            addedMessage.classList.remove('is-visible');
        }, 2000);
    });
}

// Initialize page
LoadProductsFetch().then(() => {
    const productId = getProductIdFromUrl();

    if (!productId) {
        window.location.href = 'amazon.html';
        return;
    }

    const product = findProduct(productId);

    if (!product) {
        document.querySelector('.js-product-name').textContent = 'Product not found';
        return;
    }

    // Update cart quantity on load
    updateCartQuantity();

    // Render all sections
    renderProductDetails(product);
    renderReviews(productId);
    renderOtherProducts(productId);
    setupAddToCart(product);
});
