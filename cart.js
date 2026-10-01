const CART_STORAGE_KEY = 'gge-eletronicnet-cart';

function readCart() {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    return [];
  }
}

function writeCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function updateCartCount(cart) {
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll('.header-icons a[href="cart.html"]').forEach((cartLink) => {
    cartLink.textContent = `Basket (${itemCount})`;
  });
}

function addToCart(product, quantity) {
  const cart = readCart();
  const existingItem = cart.find((item) => item.name === product.name);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }

  writeCart(cart);
  updateCartCount(cart);
}

function productFromButton(button) {
  const card = button.closest('.product-card');
  if (card) {
    const priceElement = card.querySelector('.price-new');
    return {
      name: card.querySelector('.product-name').textContent.trim(),
      price: Number(priceElement.textContent.replace(/[^0-9.]/g, ''))
    };
  }

  const detail = button.closest('.product-info');
  return {
    name: detail.querySelector('h1').textContent.trim(),
    price: Number(detail.querySelector('.product-detail-price').textContent.replace(/[^0-9.]/g, ''))
  };
}

function readQuantity(input) {
  const quantity = Math.floor(Number(input?.value || 1));
  return Number.isFinite(quantity) && quantity >= 1 ? quantity : 1;
}

function addCardQuantityInputs() {
  document.querySelectorAll('.product-card .add-btn').forEach((button) => {
    const quantityLabel = document.createElement('label');
    quantityLabel.className = 'card-qty';
    quantityLabel.innerHTML = 'Qty <input type="number" min="1" value="1">';
    button.before(quantityLabel);
  });
}

function bindAddButtons() {
  document.querySelectorAll('.add-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const quantityInput = button.closest('.purchase-row, .product-card')?.querySelector('input[type="number"]');
      const quantity = readQuantity(quantityInput);
      if (quantityInput) quantityInput.value = quantity;
      addToCart(productFromButton(button), quantity);
      const originalText = button.textContent;
      button.textContent = 'Added to basket';
      setTimeout(() => { button.textContent = originalText; }, 1200);
    });
  });
}

function renderCart() {
  const tableBody = document.querySelector('.cart-table tbody');
  if (!tableBody) return;

  const cart = readCart();
  tableBody.replaceChildren();

  if (cart.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = '<td colspan="4">Your basket is empty.</td>';
    tableBody.appendChild(emptyRow);
  } else {
    cart.forEach((item, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${formatPrice(item.price)}</td>
        <td><input class="cart-qty" type="number" min="1" value="${item.quantity}" data-cart-index="${index}" aria-label="Quantity for ${item.name}"></td>
        <td><button class="remove-btn" type="button" data-cart-index="${index}">Remove</button></td>
      `;
      tableBody.appendChild(row);
    });
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelector('.cart-total strong').textContent = formatPrice(total);
  document.querySelector('.category-header span').textContent = `${itemCount} item${itemCount === 1 ? '' : 's'}`;
  updateCartCount(cart);

  tableBody.querySelectorAll('.remove-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const updatedCart = readCart();
      updatedCart.splice(Number(button.dataset.cartIndex), 1);
      writeCart(updatedCart);
      renderCart();
    });
  });

  tableBody.querySelectorAll('.cart-qty').forEach((input) => {
    input.addEventListener('change', () => {
      const updatedCart = readCart();
      updatedCart[Number(input.dataset.cartIndex)].quantity = readQuantity(input);
      writeCart(updatedCart);
      renderCart();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const cart = readCart();
  updateCartCount(cart);
  addCardQuantityInputs();
  bindAddButtons();
  renderCart();
});
