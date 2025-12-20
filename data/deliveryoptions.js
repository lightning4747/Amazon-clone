 export const deliveryoptions = [{
    id:'1',
    deliverytime: 7,
    priceCents: 0
}, 
{
    id:'2',
    deliverytime: 3,
    priceCents: 499
},
{
    id:'3',
    deliverytime: 1,
    priceCents: 999
}];

export function getDeliveryOption(deliveryOptionId) {
  const deliveryOption = deliveryoptions.find(
    option => option.id === deliveryOptionId
  );

  return deliveryOption || deliveryoptions[0];
}