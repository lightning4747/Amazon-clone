import { orderSummary } from '../../scritps/checkout/ordersummary.js';
import { cart } from '../../data/cart.js';

describe('test suit: renderOrderSummary', () => {

    const productId = '3ebe75dc-64d2-4137-8860-1f5a963e534b';

    beforeEach(() => {
        document.querySelector('.js-test-container').innerHTML = `
            <div class="order-summary"></div>
            <div class="js-update-count"></div>
            <div class="js-payment-summary"></div>
        `;

        spyOn(Storage.prototype, 'getItem').and.callFake(() => {
            return JSON.stringify([{
                productId: productId,
                quantity: 1,
                deliveryOptionId: '1'
            }]);
        });

        cart.loadFromStorage();
        orderSummary();
    });

    afterEach(() => {
        document.querySelector('.js-test-container').innerHTML = '';
    });

    it('display the cart', () => {

        expect(
            document.querySelectorAll('.js-cart-item-container').length
        ).toEqual(1);

        expect(document.querySelector(`.js-product-quantity-${productId}`).innerText).toContain('Quantity: 1');

    });

    it('removes a product', () => {

        document.querySelector(`.js-delete-link-${productId}`).click();
        expect(
            document.querySelectorAll('.js-cart-item-container').length
        ).toEqual(0);

        expect(cart.cartItems.length).toEqual(0);

    });
});