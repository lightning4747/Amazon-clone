import { cart } from "../data/cart.js";
import { products, LoadProductsFetch } from "../data/products.js";
import { formatcurrency } from "./utils/money.js";

LoadProductsFetch().then(() => {
  renderProductsGrid();
})

function renderProductsGrid() {

  const output = document.querySelector(".products-grid");
  const cquantity = document.querySelector(".js-quantity");

  let items = ""
  products.forEach(product => {
    items += `
    <div class="product-container">
          <a href="product.html?productId=${product.id}" class="product-link">
            <div class="product-image-container">
              <img class="product-image"
                src="${product.image}">
            </div>

            <div class="product-name limit-text-to-2-lines">
              ${product.name}
            </div>
          </a>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="${product.getStarsUrl()}">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            ${product.getPrice()}
          </div>

          <div class="product-quantity-container">
            <select class = "selectquantity-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          ${product.extraInfo()}

          <div class="product-spacer"></div>

          <div class="added-to-cart js-added-msg-${product.id}">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button 
          button-primary add-to-cart"
          data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>
    `
  });

  output.innerHTML = items;

  function updateCartQuantity(productId, quantity) {
    let total = 0;
    cart.cartItems.forEach((item) => {
      total += item.quantity;
    });

    cquantity.innerHTML = total;
    console.log(quantity, cart.cartItems);
  }

  const addedMessageTimeouts = {};

  function addmsg(productId) {
    const addedMessage = document.querySelector(`.js-added-msg-${productId}`);
    addedMessage.classList.add('is-visible');

    const previousTimeoutId = addedMessageTimeouts[productId];
    if (previousTimeoutId) {
      clearTimeout(previousTimeoutId);
    }

    const timeoutId = setTimeout(() => {
      addedMessage.classList.remove('is-visible');
    }, 2000);

    addedMessageTimeouts[productId] = timeoutId;
  }

  document.querySelectorAll(".add-to-cart")
    .forEach((button) => {

      button.addEventListener("click", () => {

        const productId = button.dataset.productId;
        const selectquantity = document.querySelector(`.selectquantity-${productId}`);
        const quantity = Number(selectquantity.value);

        addmsg(productId);
        cart.addToCart(productId, quantity);
        updateCartQuantity(productId, quantity);

      });
    });
}