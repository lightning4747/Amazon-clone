class Product {
  constructor(id, image, name, stars, count, pricecents, ...keywords) {
    this.id = id;
    this.image = image;
    this.name = name;
    this.rating = new Rating(stars, count);
    this.pricecents = pricecents;
    this.keyword = keywords;
  }
}

class Rating {
  constructor(stars, count) {
    this.stars = stars;
    this.count = count;
  }
}

// Initialize products array with sample data
let products = [
  new Product(
    'prod_001',
    'images/products/athletic-cotton-socks-6-pairs.jpg',
    'Black and Gray Athletic Cotton Socks - 6 Pairs',
    4.5,
    87,
    1090,
    'socks', 'sports', 'athletic'
  ),
  new Product(
    'prod_002',
    'images/products/intermediate-composite-basketball.jpg',
    'Intermediate Size Basketball',
    4,
    127,
    2095,
    'sports', 'basketball', 'outdoors'
  ),
  new Product(
    'prod_003',
    'images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg',
    'Adults Plain Cotton T-Shirt - 2 Pack',
    4.5,
    56,
    799,
    'apparel', 'shirts', 'clothing'
  )
];

// Load saved products from localStorage if available
const savedProducts = localStorage.getItem('products');
if (savedProducts) {
  try {
    const productsData = JSON.parse(savedProducts);
    products = productsData.map(p => new Product(
      p.id,
      p.image,
      p.name,
      p.rating.stars,
      p.rating.count,
      p.pricecents,
      ...(p.keyword || [])
    ));
  } catch (e) {
    console.error('Error loading saved products:', e);
  }
}
