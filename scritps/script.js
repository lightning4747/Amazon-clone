import { cart, addToCart } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatcurrency } from "./utils/money.js";


const output = document.querySelector(".products-grid");
const cquantity = document.querySelector(".js-quantity");

let items = ""
products.forEach(product => {
    items += `
    <div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="images/ratings/rating-${product.rating.stars * 10}.png">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            $${formatcurrency(product.priceCents)}

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

          <div class="product-spacer"></div>

          <div class="added-to-cart">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <div class="added-${product.id}" style ="display: none;">
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

function updateCartQuantity(productID,quantity) {
    let total = 0;
  cart.forEach((item)=> {
    total += item.quantity;
  });

  cquantity.innerHTML = total;
  console.log(quantity,cart);
}

function addmsg(added) {
      setTimeout(() => {
      added.style.display = "inline";
    
      setTimeout(() => {
        added.style.display = "none";
      }, 1000);
    
    }, 1000);
}

document.querySelectorAll(".add-to-cart")
.forEach((button)=> {

  button.addEventListener("click",()=> {

    const productID = button.dataset.productId;
    const selectquantity = document.querySelector(`.selectquantity-${productID}`);
    const quantity = Number(selectquantity.value);
    const added = document.querySelector(`.added-${productID}`);

    addmsg(added);
    addToCart(productID, quantity);
    updateCartQuantity(productID, quantity);

  });
});
