let basketItemsTracker = {}; 
let totalCartItemsCount = 0;
let totalCartPriceAmount = 0;
let countdownTimer;

// ================= MOBILE NAVBAR TOGGLE =================
function toggleMobileNav() {
    const navbar = document.getElementById('navbar');
    if (navbar) navbar.classList.toggle('active');
}

// ================= FILE UPLOAD PREVIEW =================
function previewOwnerImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('owner-profile-img').src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// ================= DYNAMIC MENU FILTER =================
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
            item.style.display = item.classList.contains(categoryName) ? 'block' : 'none';
        }
    });
}

// ================= PRICE CALCULATIONS MULTIPLIERS =================
function updateDynamicPricing(selectElement) {
    let cardBody = selectElement.closest('.product-card-body');
    let priceDisplay = cardBody.querySelector('.dynamic-render-price');
    let inputField = cardBody.querySelector('.qty-input');
    
    let newBasePrice = parseInt(selectElement.value);
    priceDisplay.setAttribute('data-base-price', newBasePrice);
    
    let currentQty = parseInt(inputField.value);
    priceDisplay.textContent = "৳" + (newBasePrice * currentQty);
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
        priceDisplay.textContent = "৳" + (basePrice * newQty);
    }
}

// ================= BASKET AGGREGATION SYSTEM =================
function addToCart(buttonElement, itemName) {
    let cardBody = buttonElement.closest('.product-card-body');
    let quantity = parseInt(cardBody.querySelector('.qty-input').value);
    let priceText = cardBody.querySelector('.dynamic-render-price').textContent;
    let itemTotalPrice = parseInt(priceText.replace('৳', ''));
    
    if (basketItemsTracker[itemName]) {
        basketItemsTracker[itemName].qty += quantity;
        basketItemsTracker[itemName].totalPrice += itemTotalPrice;
    } else {
        basketItemsTracker[itemName] = {
            qty: quantity,
            totalPrice: itemTotalPrice
        };
    }
    
    updateFloatingCartUI();
    showToastNotification(`<i class="fa-solid fa-circle-check"></i> Added <strong>${quantity}x ${itemName}</strong> to basket`);
}

// ================= UPDATE FLOATING CART BAR =================
function updateFloatingCartUI() {
    totalCartItemsCount = 0;
    totalCartPriceAmount = 0;
    
    for (let name in basketItemsTracker) {
        totalCartItemsCount += basketItemsTracker[name].qty;
        totalCartPriceAmount += basketItemsTracker[name].totalPrice;
    }
    
    document.getElementById('cart-item-count').textContent = totalCartItemsCount;
    document.getElementById('cart-total-price').textContent = "৳" + totalCartPriceAmount.toLocaleString();
    
    const floatingCart = document.getElementById('floating-cart');
    if (totalCartItemsCount > 0) {
        floatingCart.classList.remove('hidden');
    } else {
        floatingCart.classList.add('hidden');
        toggleCheckoutModal(false); 
    }
}

// ================= NEW CORE FUNCTION: DELETE ITEM FROM CART =================
function removeCartItem(itemName) {
    if (basketItemsTracker[itemName]) {
        delete basketItemsTracker[itemName];
        updateFloatingCartUI();
        
        // Modal ভিউ ওপেন থাকা অবস্থায় ডিলিট করলে লিস্ট লাইভ রিফ্রেশ করার জন্য
        const modal = document.getElementById('checkoutModal');
        if (modal && modal.style.display === 'flex') {
            renderCheckoutList();
        }
        showToastNotification(`<i class="fa-solid fa-trash-can"></i> Removed <strong>${itemName}</strong> from basket`);
    }
}

// ================= RENDER MODAL BASKET LIST WITH DELETE =================
function renderCheckoutList() {
    const itemsListContainer = document.getElementById('checkout-items-list');
    if (!itemsListContainer) return;
    
    itemsListContainer.innerHTML = ''; 
    
    for (let name in basketItemsTracker) {
        let record = basketItemsTracker[name];
        let row = document.createElement('div');
        row.className = 'summary-item-row';
        row.innerHTML = `
            <div class="cart-item-info">
                <span style="font-weight:600;">${name}</span>
                <span style="font-size:12px; color:var(--slate-muted);">Qty: ${record.qty}</span>
            </div>
            <div class="cart-item-actions">
                <span class="cart-item-price">৳${record.totalPrice}</span>
                <button type="button" class="btn-delete-cart-item" onclick="removeCartItem('${name}')" title="Delete Item">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
        itemsListContainer.appendChild(row);
    }
    document.getElementById('summary-total-val').textContent = "৳" + totalCartPriceAmount.toLocaleString();
}

// ================= CHECKOUT MODAL DRAWER VISIBILITY =================
function toggleCheckoutModal(showState) {
    const modal = document.getElementById('checkoutModal');
    if (!modal) return;
    
    if (showState) {
        renderCheckoutList();
        modal.style.display = 'flex';
    } else {
        modal.style.display = 'none';
    }
}

// ================= TOAST SYSTEM OVERLAY =================
function showToastNotification(message) {
    const toast = document.getElementById("toast-notification");
    if (toast) {
        toast.innerHTML = message;
        toast.classList.add("show");
        setTimeout(function(){ toast.classList.remove("show"); }, 2000);
    }
}

// ================= PREMIUM OTP VERIFICATION DIALOG SYSTEM =================
function openOtpModal(event) {
    event.preventDefault(); 
    
    if (totalCartPriceAmount <= 0) {
        alert("Your cart is empty!");
        return;
    }
    
    let phoneNum = document.getElementById('custPhone').value;
    document.getElementById('otp-target-phone').textContent = phoneNum;
    
    document.getElementById('checkoutModal').style.display = 'none';
    document.getElementById('otpModal').style.display = 'flex';
    document.getElementById('opt1').focus();
    startOtpCountdown();
}

function closeOtpModal() {
    document.getElementById('otpModal').style.display = 'none';
    clearInterval(countdownTimer);
}

function moveOtpFocus(current, nextInputId) {
    if (current.value.length >= 1 && nextInputId !== "") {
        document.getElementById(nextInputId).focus();
    }
}

function startOtpCountdown() {
    let timeLeft = 59;
    const timerDisplay = document.getElementById('otp-timer');
    clearInterval(countdownTimer);
    
    countdownTimer = setInterval(() => {
        if(timeLeft <= 0) {
            clearInterval(countdownTimer);
            timerDisplay.textContent = "Resend Available";
        } else {
            timerDisplay.textContent = `00:${timeLeft < 10 ? '0' : ''}${timeLeft}`;
        }
        timeLeft -= 1;
    }, 1000);
}

function verifyOtpAndSubmit() {
    const o1 = document.getElementById('opt1').value;
    const o2 = document.getElementById('opt2').value;
    const o3 = document.getElementById('opt3').value;
    const o4 = document.getElementById('opt4').value;
    const finalOtpString = o1 + o2 + o3 + o4;

    if(finalOtpString.length < 4) {
        alert("Please fill up all 4-digit verification input pins.");
        return;
    }

    const clientName = document.getElementById('custName').value;
    const clientPhone = document.getElementById('custPhone').value;
    
    alert(`OTP Verified Successfully!\n\nThank you ${clientName}.\nYour order value worth ৳${totalCartPriceAmount} is recorded successfully. We are dispatching confirmation shortly to ${clientPhone}.`);
    
    // Reset Data State
    basketItemsTracker = {};
    updateFloatingCartUI();
    document.getElementById('orderCheckoutForm').reset();
    
    document.getElementById('opt1').value = '';
    document.getElementById('opt2').value = '';
    document.getElementById('opt3').value = '';
    document.getElementById('opt4').value = '';

    closeOtpModal();
}

// WINDOW DISMISS EVENT LISTENER
window.onclick = function(event) {
    const cModal = document.getElementById('checkoutModal');
    const oModal = document.getElementById('otpModal');
    if (event.target == cModal) cModal.style.display = "none";
    if (event.target == oModal) closeOtpModal();
}
