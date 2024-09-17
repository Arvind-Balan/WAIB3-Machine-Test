// Variables
let shoppingBag = JSON.parse(localStorage.getItem('shoppingBag')) || [];
let itemCount = document.getElementById('item-count');
let totalPrice = document.getElementById('total-price');

// Load shopping bag from localStorage
document.addEventListener('DOMContentLoaded', updateBagDisplay);

// Add to Bag
const addToBagButtons = document.querySelectorAll('.add-to-bag');
addToBagButtons.forEach(button => {
  button.addEventListener('click', function () {
    const product = this.closest('.product');
    const id = product.getAttribute('data-id');
    const name = product.getAttribute('data-name');
    const price = parseFloat(product.getAttribute('data-price'));

    addToBag({ id, name, price });
  });
});

function addToBag(product) {
  const existingProduct = shoppingBag.find(item => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    shoppingBag.push({ ...product, quantity: 1 });
  }

  updateBagDisplay();
  saveToLocalStorage();
}

// Update Bag Display
function updateBagDisplay() {
  const bagItems = document.getElementById('bag-items');
  bagItems.innerHTML = '';
  let total = 0;
  let count = 0;

  shoppingBag.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `${item.name} - $${item.price} x <input type="number" value="${item.quantity}" min="1"> 
      <button class="remove-item" data-id="${item.id}">Remove</button>`;
    bagItems.appendChild(li);

    total += item.price * item.quantity;
    count += item.quantity;
  });

  totalPrice.textContent = total.toFixed(2);
  itemCount.textContent = count;

  // Update quantity in the bag
  const quantityInputs = document.querySelectorAll('#bag-items input[type="number"]');
  quantityInputs.forEach(input => {
    input.addEventListener('change', function () {
      const productId = input.closest('li').querySelector('.remove-item').getAttribute('data-id');
      updateQuantity(productId, parseInt(input.value));
    });
  });

  // Remove item
  const removeButtons = document.querySelectorAll('.remove-item');
  removeButtons.forEach(button => {
    button.addEventListener('click', function () {
      const productId = this.getAttribute('data-id');
      removeFromBag(productId);
    });
  });
}

function updateQuantity(id, newQuantity) {
  const product = shoppingBag.find(item => item.id === id);
  if (product && newQuantity > 0) {
    product.quantity = newQuantity;
    updateBagDisplay();
    saveToLocalStorage();
  }
}

function removeFromBag(id) {
  shoppingBag = shoppingBag.filter(item => item.id !== id);
  updateBagDisplay();
  saveToLocalStorage();
}

// Save bag to localStorage
function saveToLocalStorage() {
  localStorage.setItem('shoppingBag', JSON.stringify(shoppingBag));
}

// View Bag Modal
const viewBagButton = document.getElementById('view-bag');
const bagModal = document.getElementById('shopping-bag-modal');
const closeBagButton = document.getElementById('close-bag');

viewBagButton.addEventListener('click', function () {
  bagModal.style.display = 'block';
});

closeBagButton.addEventListener('click', function () {
  bagModal.style.display = 'none';
});

window.addEventListener('click', function (event) {
  if (event.target === bagModal) {
    bagModal.style.display = 'none';
  }
});
