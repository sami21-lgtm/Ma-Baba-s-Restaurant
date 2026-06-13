let basketItemsTracker = {};
let totalCartItemsCount = 0;
let totalCartPriceAmount = 0;

// ================= DYNAMIC CATEGORY SWAP FILTER =================
function filterMenu(categoryName) {
    const items = document.querySelectorAll('.product-item-card');
    const tabs = document.querySelectorAll('.filter-tab-btn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }

    items.forEach(item => {
        if (categoryName === 'all') {
            item.style.display = 'block';
        } else {
            if (item.classList.contains(categoryName)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        }
    });
}

// ================= CARD CALCULATION MULTIPLIERS =================
function updateDynamicPricing(selectElement) {
    let cardBody = selectElement.closest('.product-card-body');
    let priceDisplay = cardBody.querySelector('.dynamic-render-price');
    let inputField = cardBody.querySelector('.qty-input');
    
    let newBasePrice = parseInt(selectElement.value);
    priceDisplay.setAttribute('data-base-price', newBasePrice);
    
    let currentQty = parseInt(inputField.value);
    let totalValue = newBasePrice * currentQty;
    priceDisplay.textContent = " ৳ " + totalValue;
}

function updateQty(buttonElement, change) {
    let cardBody = buttonElement.closest('.product-card-body');
    let inputField = cardBody.querySelector('.qty-input');
    let priceDisplay = cardBody.querySelector('.dynamic-render-price');
    
    let currentQty = parseInt(inputField.value);
    let newQty = currentQty + change;
    
    if (newQty >= 1) {
        inputField.value = newQty;
        let basePrice = parseInt(priceDisplay.getAttribute('data-base-price'));
        priceDisplay.textContent = " ৳ " + (basePrice * newQty);
    }
}

// ================= BASKET OPERATIONS ENGINE =================
function addToCart(buttonElement, productName) {
    let cardBody = buttonElement.closest('.product-card-body');
    let variantSelect = cardBody.querySelector('.variant-select');
    let qtyInput = cardBody.querySelector('.qty-input');
    
    let selectedOptionText = variantSelect.options[variantSelect.selectedIndex].text;
    let selectedPrice = parseInt(variantSelect.value);
    let addedQty = parseInt(qtyInput.value);
    let calculatedTotalPrice = selectedPrice * addedQty;
    
    // Create unique key to differentiate variants in the basket tracker array
    let uniqueItemKey = `${productName} (${selectedOptionText.split(' (')[0]})`;
    
    if (basketItemsTracker[uniqueItemKey]) {
        basketItemsTracker[uniqueItemKey].qty += addedQty;
        basketItemsTracker[uniqueItemKey].totalPrice += calculatedTotalPrice;
    } else {
        basketItemsTracker[uniqueItemKey] = {
            baseName: productName,
            qty: addedQty,
            totalPrice: calculatedTotalPrice
        };
    }
    
    totalCartItemsCount += addedQty;
    totalCartPriceAmount += calculatedTotalPrice;
    
    updateFloatingCartUI();
    triggerAlertToast(`${addedQty}x ${productName} added to basket successfully!`);
    
    // Reset quantity input view back to 1
    qtyInput.value = 1;
    let originalBasePrice = parseInt(variantSelect.value);
    cardBody.querySelector('.dynamic-render-price').textContent = " ৳ " + originalBasePrice;
}

function removeCartItem(itemKey) {
    if (basketItemsTracker[itemKey]) {
        totalCartItemsCount -= basketItemsTracker[itemKey].qty;
        totalCartPriceAmount -= basketItemsTracker[itemKey].totalPrice;
        
        delete basketItemsTracker[itemKey];
        
        updateFloatingCartUI();
        renderCheckoutListOnly(); 
        
        if (totalCartItemsCount === 0) {
            toggleCheckoutModal(false);
        }
    }
}

function updateFloatingCartUI() {
    const floatingBar = document.getElementById('floating-cart');
    if (totalCartItemsCount > 0) {
        floatingBar.classList.remove('hidden');
        document.getElementById('cart-item-count').textContent = totalCartItemsCount;
        document.getElementById('cart-total-price').textContent = " ৳ " + totalCartPriceAmount.toLocaleString();
    } else {
        floatingBar.classList.add('hidden');
    }
}

// ================= MODAL FRAMEWORK FLOW CONTROL INTERFACES =================
function toggleCheckoutModal(showState) {
    const modal = document.getElementById('checkoutModal');
    if (showState && totalCartItemsCount > 0) {
        renderCheckoutListOnly();
        modal.style.display = 'flex';
    } else {
        modal.style.display = 'none';
    }
}

// Separate function to update checkout UI inside the modal safely without changing open states
function renderCheckoutListOnly() {
    const itemsListContainer = document.getElementById('checkout-items-list');
    itemsListContainer.innerHTML = ''; 
    
    // Precise mappings corresponding exactly to card file structure for layout rendering
    const itemImageMap = {
        'Soft Ruti / Paratha': 'images (12).jpg',
        'Special Bhuna Daal': 'images (13).jpg',
        'Farm Fresh Egg': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=400',
        'Beef Bhuna Khichuri': 'e338491b-063e-4228-ac0e-3ca9c73536a8.png',
        'Premium Mutton Kacchi': 'images (14).jpg',
        'Chittagong Kala Bhuna': '4a1cb3da-4300-4954-b526-8ac5f40146f1.png',
        'Old Dhaka Beef Tehari': 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=400',
        'Premium Golap Jam': '0ddd6c12-16ec-45c4-b487-b80951e661d3.png',
        'Traditional Kalo Jam': '5c9a67e3-cf74-4c1d-8284-d8286d70bffe.png',
        'Spongy Roshogolla': '32592ad6-fe80-41e8-a7a3-872e94c0bc1c.png',
        'Premium Sondesh': '74221d1f-efce-452f-8731-e368a05f2e5b.png',
        'Dark Chocolate Cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400',
        'Premium Sponge Cake': '0f144ebe-252c-474d-b4fd-5b2fb102b76b.png',
        'Vanilla Bean Cake': 'efbacffe-7036-4fd0-beb4-43eafe0c7e00.png',
        'Traditional Borhani': 'images (11).jpg',
        'Coca-Cola': 'coca-cola.jpg',
        '7up': '7up.jpg',
        'Mojo': 'mojo.jpg'
    };

    for (let itemKey in basketItemsTracker) {
        let record = basketItemsTracker[itemKey];
        let row = document.createElement('div');
        row.className = 'summary-item-row';
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.justifyContent = 'space-between';
        row.style.marginBottom = '12px';
        
        let imageUrl = itemImageMap[record.baseName] || 'https://via.placeholder.com/40';

        row.innerHTML = `
            <div class="cart-item-info" style="display: flex; align-items: center; gap: 10px;">
                <img src="${imageUrl}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 6px; border: 1px solid #ddd;" onerror="this.src='https://via.placeholder.com/40'">
                <span style="font-weight:600; font-size:13px;">${itemKey} <strong>(x${record.qty})</strong></span>
            </div>
            <div class="cart-item-actions" style="display: flex; align-items: center; gap: 15px;">
                <span class="cart-item-price" style="font-weight: 700;"> ৳ ${record.totalPrice}</span>
                <button type="button" class="btn-delete-cart-item" onclick="removeCartItem('${itemKey}')" title="Delete Item" style="background:none; border:none; color:#e74c3c; cursor:pointer;">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
        itemsListContainer.appendChild(row);
    }
    document.getElementById('summary-total-val').textContent = " ৳ " + totalCartPriceAmount.toLocaleString();
}

function handleOrderSubmission(event) {
    event.preventDefault();
    
    const clientName = document.getElementById('custName').value;
    const clientPhone = document.getElementById('custPhone').value;
    
    alert(`Success! Thank you ${clientName}.\nYour order value worth ৳ ${totalCartPriceAmount.toLocaleString()} is recorded. We are dispatching confirmation shortly to ${clientPhone}.`);
    
    // Clear State Memory Trackers completely
    basketItemsTracker = {};
    totalCartItemsCount = 0;
    totalCartPriceAmount = 0;
    
    updateFloatingCartUI();
    document.getElementById('orderCheckoutForm').reset();
    toggleCheckoutModal(false);
}

// ================= BOOKING MODALS TRIGGERS =================
function openBooking() { 
    document.getElementById('bookingModal').style.display = 'flex'; 
}
function closeBooking() { 
    document.getElementById('bookingModal').style.display = 'none'; 
}

window.onclick = function(event) {
    const bModal = document.getElementById('bookingModal');
    const cModal = document.getElementById('checkoutModal');
    if (event.target == bModal) bModal.style.display = "none";
    if (event.target == cModal) cModal.style.display = "none";
}

// ================= TOAST ALERTS ENGINES =================
function triggerAlertToast(alertMessage) {
    const toast = document.getElementById('toast-notification');
    toast.textContent = alertMessage;
    toast.className = "show-alert";
    
    setTimeout(function() { 
        toast.className = toast.className.replace("show-alert", ""); 
    }, 2800);
}
