// Initialize cart from localStorage or create an empty cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(item) {
  const existingItem = cart.find((cartItem) => cartItem.id === item.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    console.log(item);
    
    cart.push({ ...item, quantity: 1 });
  }
  saveCart();
  updateCartUI();
  showNotification(`${item.name} agregado al carrito`);
}

function removeFromCart(itemId) {
  cart = cart.filter((item) => item.id !== itemId);
  saveCart();
  updateCartUI();
}

function updateQuantity(itemId, newQuantity) {
  const item = cart.find((cartItem) => cartItem.id === itemId);
  if (item) {
    item.quantity = newQuantity;
    if (item.quantity <= 0) {
      removeFromCart(itemId);
    } else {
      saveCart();
      updateCartUI();
    }
  }
}

function calculateTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function updateCartUI() {
  const cartItemsElement = document.getElementById('cart-items');
  const cartCountElement = document.getElementById('cart-count');
  const totalPriceElement = document.getElementById('total-price');
  const cartEmptyElement = document.getElementById('cart-empty');
  const cartTotalElement = document.getElementById('cart-total');
  const placeOrderButton = document.getElementById('continue-order');

  cartItemsElement.innerHTML = '';
  cart.forEach((item) => {
    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    itemElement.innerHTML = `
      <article class="media">
        <figure class="media-left">
          <p class="image is-64x64">
            <img src="/images/${
              item.image
            }" alt="${item.name}" class="cart-item-image">
          </p>
        </figure>
        <div class="media-content">
          <div class="content">
            <p>
              <strong>${item.name}</strong>
              <br>
              <small>$${item.price.toFixed(2)} c/u</small>
            </p>
          </div>
        </div>
        <div class="media-right">
          <div class="cart-item-actions">
            <div class="quantity-control">
              <button class="button is-small" onclick="updateQuantity('${
                item.id
              }', ${item.quantity - 1})">-</button>
              <span class="mx-2">${item.quantity}</span>
              <button class="button is-small" onclick="updateQuantity('${
                item.id
              }', ${item.quantity + 1})">+</button>
            </div>
          </div>
          <p class="has-text-right mt-2">
            <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
          </p>
        </div>
      </article>
    `;
    cartItemsElement.appendChild(itemElement);
  });

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCountElement.textContent = totalItems;
  totalPriceElement.textContent = calculateTotal().toFixed(2);

  // Show/hide elements based on cart contents
  if (cart.length === 0) {
    cartEmptyElement.classList.remove('is-hidden');
    cartTotalElement.classList.add('is-hidden');
    placeOrderButton.classList.add('is-hidden');
  } else {
    cartEmptyElement.classList.add('is-hidden');
    cartTotalElement.classList.remove('is-hidden');
    placeOrderButton.classList.remove('is-hidden');
  }
}

function showNotification(message) {
  const notificationContainer = document.getElementById(
    'notification-container'
  );
  const notification = document.createElement('div');
  notification.className = 'notification is-primary';
  notification.innerHTML = `
    <button class="delete"></button>
    ${message}
  `;
  notificationContainer.appendChild(notification);
  notification.classList.add('fadeInOut');

  // Remove notification after animation
  setTimeout(() => {
    notification.remove();
  }, 3000);

  // Close notification when clicking the delete button
  const deleteButton = notification.querySelector('.delete');
  deleteButton.addEventListener('click', () => {
    notification.remove();
  });
}

// Add event listeners to "Add to Cart" buttons
document.addEventListener('DOMContentLoaded', () => {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const item = {
        id: button.dataset.id,
        name: button.dataset.name,
        price: parseFloat(button.dataset.price),
        image: button.dataset.image
      };
      addToCart(item);
    });
  });

  // Toggle cart visibility
  const cartButton = document.getElementById('cart-button');
  const shoppingCart = document.getElementById('shopping-cart');
  cartButton.addEventListener('click', () => {
    shoppingCart.classList.toggle('is-active');
  });

  // Initial cart UI update
  updateCartUI();
});

// Make functions available globally
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
