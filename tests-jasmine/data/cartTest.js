import { addToCart, cart, loadFromStorage } from  '../../data/cart.js';

describe('test suit: addToCart ', ()=>{
    it('adds an existing product to the cart', ()=> {
        spyOn(Storage.prototype, 'setItem');

        spyOn(Storage.prototype, 'getItem').and.callFake(()=> {
            return JSON.stringify({
                productId: '3ebe75dc-64d2-4137-8860-1f5a963e534b',
                quantity : 1,
                deliveryOptionId: '1'
            });
        });
        loadFromStorage();

         addToCart('3ebe75dc-64d2-4137-8860-1f5a963e534b');
        expect(cart.length).toEqual(1);
        expect(Storage.prototype.setItem).toHaveBeenCalledTimes(1);
        expect(cart[0].productId).toEqual('3ebe75dc-64d2-4137-8860-1f5a963e534b');
    });

    it('adds a new product to the cart', ()=> {

        spyOn(Storage.prototype, 'setItem');

        spyOn(Storage.prototype, 'getItem').and.callFake(()=> {
            return JSON.stringify([]);
        });
        loadFromStorage();

        addToCart('3ebe75dc-64d2-4137-8860-1f5a963e534b');
        expect(cart.length).toEqual(1);
        expect(Storage.prototype.setItem).toHaveBeenCalledTimes(1);
        expect(cart[0].productId).toEqual('3ebe75dc-64d2-4137-8860-1f5a963e534b');
        
    });
}); 