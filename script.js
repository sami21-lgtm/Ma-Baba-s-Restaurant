function previewOwnerImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('owner-profile-img').src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// ================= DYNAMIC PRICING ENGINE (FOODPANDA LOGIC) =================

// When Dropdown (Half/Full or Weight) is changed
function updateDynamicPricing(selectElement) {
    let cardBody = selectElement.closest('.product-card-body');
    let priceDisplay = cardBody.querySelector('.dynamic-render-price');
    let inputField = cardBody.querySelector('.qty-input');
    
    // Get new base price from select value
    let newBasePrice = parseInt(selectElement.value);
    
    // Store it in the data attribute
    priceDisplay.setAttribute('data-base-price', newBasePrice);
    
    // Multiply by current quantity
    let currentQty = parseInt(inputField.value);
    let totalValue = newBasePrice * currentQty;
    
    // Show updated Taka amount
    priceDisplay.textContent = "৳" + totalValue.toLocaleString();
}

// When + or - Button is clicked
function updateQty(buttonElement, change) {
    let cardBody = buttonElement.closest('.product-card-body');
    let inputField = cardBody.querySelector('.qty-input');
    let priceDisplay = cardBody.querySelector('.dynamic-render-price');
    
    let currentQty = parseInt(inputField.value);
    let newQty = currentQty + change;
    
    // Ensure minimum quantity is 1
    if (newQty >= 1) {
        inputField.value = newQty;
        
        // Calculate dynamic total price based on base price
        let basePrice = parseInt(priceDisplay.getAttribute('data-base-price'));
        let totalValue = basePrice * newQty;
        
        // Update display text
        priceDisplay.textContent = "৳" + totalValue.toLocaleString();
    }
}

// ================= ADD TO CART NOTIFICATION =================
function addToCart(buttonElement, itemName) {
    let cardBody = buttonElement.closest('.product-card-body');
    let quantity = cardBody.querySelector('.qty-input').value;
    let totalPrice = cardBody.querySelector('.dynamic-render-price').textContent;
    
    const toast = document.getElementById("toast-notification");
    toast.innerHTML = `<i class="fa-solid fa-cart-arrow-down"></i> Added <strong>${quantity}x ${itemName}</strong> | Total: ${totalPrice}`;
    toast.className = "show";
    
    // Hide toast after 3 seconds
    setTimeout(function(){ 
        toast.className = toast.className.replace("show", ""); 
    }, 3000);
}

// ================= MENU CATEGORY FILTERS =================
function filterMenu(categoryName) {
    const items = document.querySelectorAll('.product-item-card');
    const tabs = document.querySelectorAll('.filter-tab-btn');

    tabs.forEach(tab => tab.classList.remove('active'));
    if(event) { event.target.classList.add('active'); }

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

// ================= BOOKING MODAL CONTROLS =================
function openBooking() {
    document.getElementById('bookingModal').style.display = 'flex';
}

function closeBooking() {
    document.getElementById('bookingModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
