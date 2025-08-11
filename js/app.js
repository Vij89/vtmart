// Helper functions for local storage
function loadStorage(key, defaultValue) {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
}

function saveStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Load product catalog from data file (available globally when script included)
function getProducts() {
  return products;
}

// Render product list on home page
function renderProductList(containerId) {
  const container = document.getElementById(containerId);
  const products = getProducts();
  container.innerHTML = '';
  products.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <p>HSN: ${p.hsnCode}</p>
      <p class="price">₹${p.price.toLocaleString()}</p>
      <button class="btn" onclick="addToCart('${p.id}')">Add to Cart</button>
      <a class="btn" href="product.html?id=${p.id}" style="margin-left:0.5rem;">View</a>
    `;
    container.appendChild(card);
  });
}

// Render product detail page
function renderProductDetail(productId, containerId) {
  const product = getProducts().find((p) => p.id === productId);
  const container = document.getElementById(containerId);
  if (!product) {
    container.innerHTML = '<p>Product not found.</p>';
    return;
  }
  container.innerHTML = `
    <div class="card" style="display:flex; gap:1rem;">
      <img src="${product.image}" alt="${product.name}" style="width: 40%; height: 200px; object-fit: cover;" />
      <div>
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p>HSN Code: ${product.hsnCode}</p>
        <p class="price">₹${product.price.toLocaleString()}</p>
        <button class="btn" onclick="addToCart('${product.id}')">Add to Cart</button>
      </div>
    </div>
  `;
}

// Cart operations
function getCart() {
  return loadStorage('cart', []);
}

function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  saveStorage('cart', cart);
  alert('Added to cart');
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== productId);
  saveStorage('cart', cart);
  renderCart('cart-container');
}

function clearCart() {
  saveStorage('cart', []);
}

// Invoice generation
function generateInvoiceNumber() {
  const sequence = loadStorage('invoiceSequence', 1);
  const year = new Date().getFullYear();
  const seqStr = String(sequence).padStart(6, '0');
  saveStorage('invoiceSequence', sequence + 1);
  return `VT/${year}/${seqStr}`;
}

// E‑way bill generation: returns a bill number if total > 50k
function generateEwayBill(total) {
  if (total > 50000) {
    const num = Math.floor(Math.random() * 1_000_000)
      .toString()
      .padStart(6, '0');
    return 'EWB' + num;
  }
  return null;
}

// Place order: generate invoice and eway bill, save order, clear cart
function placeOrder() {
  const cart = getCart();
  if (cart.length === 0) return;
  const products = getProducts();
  const total = cart.reduce((sum, item) => {
    const p = products.find((prod) => prod.id === item.id);
    return sum + (p ? p.price * item.quantity : 0);
  }, 0);
  const invoice = generateInvoiceNumber();
  const eway = generateEwayBill(total);
  const orderId = 'order-' + Date.now();
  const orders = loadStorage('orders', []);
  orders.push({ id: orderId, invoice, total, eway });
  saveStorage('orders', orders);
  clearCart();
  // Show confirmation
  const conf = document.getElementById('order-confirmation');
  if (conf) {
    conf.innerHTML = `
      <h3>Order Confirmed!</h3>
      <p>Order ID: ${orderId}</p>
      <p>Invoice Number: ${invoice}</p>
      <p>Total Paid: ₹${total.toLocaleString()}</p>
      ${eway ? `<p>E‑way Bill Number: ${eway}</p>` : '<p>No E‑way bill needed.</p>'}
    `;
    conf.style.display = 'block';
  }
  renderCart('cart-container');
}

// Render cart page
function renderCart(containerId) {
  const container = document.getElementById(containerId);
  const cart = getCart();
  const products = getProducts();
  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }
  let html = '<table><thead><tr><th>Product</th><th>HSN</th><th>Qty</th><th>Price</th><th>Remove</th></tr></thead><tbody>';
  let total = 0;
  cart.forEach((item) => {
    const p = products.find((prod) => prod.id === item.id);
    if (!p) return;
    const price = p.price * item.quantity;
    total += price;
    html += `<tr>
      <td>${p.name}</td>
      <td>${p.hsnCode}</td>
      <td>${item.quantity}</td>
      <td>₹${price.toLocaleString()}</td>
      <td><button class="btn" onclick="removeFromCart('${p.id}')">Remove</button></td>
    </tr>`;
  });
  html += `</tbody></table><p><strong>Total: ₹${total.toLocaleString()}</strong></p>
    <button class="btn" onclick="placeOrder()">Place Order</button>
    <div id="order-confirmation" style="display:none; margin-top:1rem;"></div>
  `;
  container.innerHTML = html;
}

// Admin functions
function renderOrders(containerId) {
  const container = document.getElementById(containerId);
  const orders = loadStorage('orders', []);
  if (orders.length === 0) {
    container.innerHTML = '<p>No orders yet.</p>';
    return;
  }
  let html = '<table><thead><tr><th>Order ID</th><th>Invoice #</th><th>Total</th><th>E‑way Bill</th></tr></thead><tbody>';
  orders.forEach((o) => {
    html += `<tr><td>${o.id}</td><td>${o.invoice}</td><td>₹${o.total.toLocaleString()}</td><td>${o.eway || '-'}</td></tr>`;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
}

function renderAdminProducts(containerId) {
  const container = document.getElementById(containerId);
  const products = getProducts();
  let html = '<table><thead><tr><th>Name</th><th>Price</th><th>HSN</th></tr></thead><tbody>';
  products.forEach((p) => {
    html += `<tr><td>${p.name}</td><td>₹${p.price.toLocaleString()}</td><td>${p.hsnCode}</td></tr>`;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
}

// Render KYC form (no server side).  Simply show alert on submit.
function handleKycSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  const pan = data.get('pan');
  alert('KYC submitted for PAN ' + pan + '.');
  form.reset();
}

// Utility to parse query parameters
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}
