document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Menu Tab Filtering ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const target = btn.getAttribute('data-target');

            menuCards.forEach(card => {
                if (target === 'all' || card.getAttribute('data-category') === target) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- 2. Menu Card Price Calculation ---
    menuCards.forEach(card => {
        const minusBtn = card.querySelector('.qty-minus');
        const plusBtn = card.querySelector('.qty-plus');
        const qtyInput = card.querySelector('.qty-input');
        const priceDisplay = card.querySelector('.total-price');
        const portionRadios = card.querySelectorAll('input[type="radio"]');

        function updateCardTotal() {
            const selectedRadio = card.querySelector('input[type="radio"]:checked');
            const basePrice = parseInt(selectedRadio.getAttribute('data-price'));
            const quantity = parseInt(qtyInput.value);
            const total = basePrice * quantity;
            priceDisplay.textContent = `Tk ${total}`;
        }

        // Listen for portion change
        portionRadios.forEach(radio => {
            radio.addEventListener('change', updateCardTotal);
        });

        // Listen for quantity buttons
        plusBtn.addEventListener('click', () => {
            qtyInput.value = parseInt(qtyInput.value) + 1;
            updateCardTotal();
        });

        minusBtn.addEventListener('click', () => {
            if (parseInt(qtyInput.value) > 1) {
                qtyInput.value = parseInt(qtyInput.value) - 1;
                updateCardTotal();
            }
        });
    });

    // --- 3. Shopping Cart System ---
    let basket = [];
    const cartBtn = document.getElementById('cartBtn');
    const cartBadge = document.getElementById('cartBadge');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCartBtn = document.getElementById('closeCart');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalDisplay = document.getElementById('cartTotalDisplay');
    const addButtons = document.querySelectorAll('.btn-add-basket');

    // Open & Close Cart
    function openCart() {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    }
    function closeCart() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    }

    cartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Render Cart UI
    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let grandTotal = 0;
        let totalItems = 0;

        if (basket.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your basket is empty.</p>';
        } else {
            basket.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                grandTotal += itemTotal;
                totalItems += item.quantity;

                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                cartItemElement.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.portion} (Tk ${item.price} x ${item.quantity})</p>
                    </div>
                    <div style="display:flex; align-items:center;">
                        <span class="cart-item-price">Tk ${itemTotal}</span>
                        <button class="btn-remove" data-index="${index}"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            });
        }

        cartBadge.textContent = totalItems;
        cartTotalDisplay.textContent = `Tk ${grandTotal}`;

        // Add event listeners to newly created remove buttons
        const removeBtns = document.querySelectorAll('.btn-remove');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemIndex = e.currentTarget.getAttribute('data-index');
                basket.splice(itemIndex, 1); // Remove item from array
                updateCartUI(); // Re-render
            });
        });
    }

    // Add to Cart Logic
    addButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.menu-card');
            const itemName = card.querySelector('.item-name').textContent;
            const selectedRadio = card.querySelector('input[type="radio"]:checked');
            const itemPortion = selectedRadio.value;
            const itemPrice = parseInt(selectedRadio.getAttribute('data-price'));
            const itemQty = parseInt(card.querySelector('.qty-input').value);

            // Check if item with same portion already exists in basket
            const existingItem = basket.find(item => item.name === itemName && item.portion === itemPortion);

            if (existingItem) {
                existingItem.quantity += itemQty; // Increase quantity
            } else {
                basket.push({
                    name: itemName,
                    portion: itemPortion,
                    price: itemPrice,
                    quantity: itemQty
                }); // Add new item
            }

            // Reset quantity input on card back to 1
            card.querySelector('.qty-input').value = 1;
            
            // Trigger price update manually to reset display
            const event = new Event('change');
            selectedRadio.dispatchEvent(event);

            updateCartUI();
            openCart(); // Automatically open cart to show user it was added
        });
    });

    // --- 4. Reservation Form Handling ---
    const resForm = document.getElementById('resForm');
    if(resForm) {
        resForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you! Your table reservation has been received.');
            resForm.reset();
        });
    }
});
