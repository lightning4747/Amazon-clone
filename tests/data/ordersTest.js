// Note: orders module needs to be tested with a fresh import each time
// because it reads from localStorage on module load

describe('test suite: Orders Module', () => {

    beforeEach(() => {
        spyOn(Storage.prototype, 'setItem');
    });

    describe('addOrder', () => {
        it('adds an order to the beginning of the orders array', async () => {
            spyOn(Storage.prototype, 'getItem').and.callFake((key) => {
                if (key === 'orders') {
                    return JSON.stringify([
                        { id: 'existing-order', products: [] }
                    ]);
                }
                return null;
            });

            // Dynamic import to get fresh module state
            const { orders, addOrder } = await import('../../data/orders.js?' + Date.now());

            const newOrder = {
                id: 'new-order-123',
                orderTime: new Date().toISOString(),
                products: [{ productId: 'prod-1', quantity: 2, deliveryOptionId: '1' }]
            };

            addOrder(newOrder);

            expect(orders[0].id).toBe('new-order-123');
            expect(Storage.prototype.setItem).toHaveBeenCalledWith('orders', jasmine.any(String));
        });
    });

    describe('removeProductFromOrder', () => {
        it('removes a product from an order', async () => {
            spyOn(Storage.prototype, 'getItem').and.callFake((key) => {
                if (key === 'orders') {
                    return JSON.stringify([
                        {
                            id: 'order-1',
                            products: [
                                { productId: 'prod-1', quantity: 1, deliveryOptionId: '1' },
                                { productId: 'prod-2', quantity: 2, deliveryOptionId: '2' }
                            ]
                        }
                    ]);
                }
                return null;
            });

            const { orders, removeProductFromOrder } = await import('../../data/orders.js?' + Date.now());

            const result = removeProductFromOrder('order-1', 'prod-1');

            expect(result).toBe(true);
            expect(orders[0].products.length).toBe(1);
            expect(orders[0].products[0].productId).toBe('prod-2');
            expect(Storage.prototype.setItem).toHaveBeenCalled();
        });

        it('removes entire order when last product is removed', async () => {
            spyOn(Storage.prototype, 'getItem').and.callFake((key) => {
                if (key === 'orders') {
                    return JSON.stringify([
                        {
                            id: 'order-1',
                            products: [
                                { productId: 'prod-1', quantity: 1, deliveryOptionId: '1' }
                            ]
                        }
                    ]);
                }
                return null;
            });

            const { orders, removeProductFromOrder } = await import('../../data/orders.js?' + Date.now());

            removeProductFromOrder('order-1', 'prod-1');

            expect(orders.length).toBe(0);
        });

        it('returns false for non-existent order', async () => {
            spyOn(Storage.prototype, 'getItem').and.callFake((key) => {
                if (key === 'orders') {
                    return JSON.stringify([]);
                }
                return null;
            });

            const { removeProductFromOrder } = await import('../../data/orders.js?' + Date.now());

            const result = removeProductFromOrder('non-existent', 'prod-1');

            expect(result).toBe(false);
        });
    });
});
