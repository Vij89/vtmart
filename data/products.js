// Product catalog for VT Mart.  Each item includes an HSN code
// required for GST invoicing.

const products = [
  {
    id: 'p1',
    name: 'Smartphone X10',
    description: 'High‑performance smartphone with 128 GB storage and 8 GB RAM.',
    price: 17999,
    rating: 4.5,
    hsnCode: '85171200',
    image: 'https://picsum.photos/seed/p1/400/300',
  },
  {
    id: 'p2',
    name: 'Laptop Pro 14',
    description: '14‑inch laptop with Intel i7 processor and 16 GB RAM.',
    price: 64999,
    rating: 4.7,
    hsnCode: '84713010',
    image: 'https://picsum.photos/seed/p2/400/300',
  },
  {
    id: 'p3',
    name: 'Wireless Earbuds',
    description: 'Noise‑cancelling earbuds with 24‑hour battery life.',
    price: 2999,
    rating: 4.3,
    hsnCode: '85183000',
    image: 'https://picsum.photos/seed/p3/400/300',
  },
  {
    id: 'p4',
    name: 'Smartwatch S2',
    description: 'Fitness‑focused smartwatch with heart‑rate and GPS tracking.',
    price: 4999,
    rating: 4.2,
    hsnCode: '91021100',
    image: 'https://picsum.photos/seed/p4/400/300',
  },
];

// Export for scripts to import
if (typeof module !== 'undefined') {
  module.exports = { products };
}
