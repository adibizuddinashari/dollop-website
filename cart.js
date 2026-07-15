// ─── DOLLOP CART ────────────────────────────────────────────────────────────
// Shared multi-flavour cart, persisted in localStorage so it survives
// switching flavours / navigating between pages.
const CART_KEY = 'dollop_cart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCartBadge();
}

function cartCount() {
  return getCart().reduce(function (sum, item) { return sum + item.qty; }, 0);
}

function cartTotal() {
  return getCart().reduce(function (sum, item) { return sum + item.price * item.qty; }, 0);
}

// Merges into an existing line if the same flavour + size is already in the cart.
function addToCart(item) {
  var cart = getCart();
  var existing = cart.find(function (l) { return l.flavourSlug === item.flavourSlug && l.sizeKey === item.sizeKey; });
  if (existing) { existing.qty += item.qty; }
  else { cart.push(item); }
  saveCart(cart);
}

function updateCartQty(index, delta) {
  var cart = getCart();
  if (!cart[index]) return;
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart(cart);
}

function removeFromCart(index) {
  var cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
}

function clearCart() { saveCart([]); }

function renderCartBadge() {
  var count = cartCount();
  document.querySelectorAll('.cart-badge').forEach(function (el) {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
  // Optional "View Order" link some pages show near the Add to Order button.
  var link = document.getElementById('viewOrderLink');
  if (link) {
    if (count > 0) {
      link.style.display = 'block';
      link.textContent = '🛒 View Order (' + count + ') · RM ' + cartTotal().toFixed(2) + ' →';
    } else {
      link.style.display = 'none';
    }
  }
}

document.addEventListener('DOMContentLoaded', renderCartBadge);
