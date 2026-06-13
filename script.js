function previewOwnerImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Render target image source dynamically instantly
            document.getElementById('owner-profile-img').src = e.target.result;
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}

// ================= SYSTEM PRICING SWITCHERS =================

// Dynamic configuration for Plate-based items (Half / Full)
function updatePlatePricing(selectElement, halfPrice, fullPrice) {
    const cardBody = selectElement.closest('.product-card-body');
    const priceDisplay = cardBody.querySelector('.dynamic-render-price');
    const selectedValue = selectElement.value;
    
    if (selectedValue === "half") {
        priceDisplay.textContent = "₦" + halfPrice.toLocaleString();
    } else {
        priceDisplay.textContent = "₦" + fullPrice.toLocaleString();
    }
}

// Dynamic configuration matrix for Sweet Weights
function updateSweetPricing(selectElement, p250, p500, p1k) {
    const cardBody = selectElement.closest('.product-card-body');
    const priceDisplay = cardBody.querySelector('.dynamic-render-price');
    const weight = selectElement.value;
    
    if (weight === "250") {
        priceDisplay.textContent = "₦" + p250.toLocaleString();
    } else if (weight === "500") {
        priceDisplay.textContent = "₦" + p500.toLocaleString();
    } else if (weight === "1000") {
        priceDisplay.textContent = "₦" + p1k.toLocaleString();
    }
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

// ================= MODAL AND WIZARD CONTROLS =================
function openBooking() {
    document.getElementById('bookingModal').style.display = 'flex';
    clearWizardForm();
}

function closeBooking() {
    document.getElementById('bookingModal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target == modal) { modal.style.display = "none"; }
}

function nextStep(targetPanel) {
    document.querySelectorAll('.wizard-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById('step' + targetPanel).classList.add('active');
    updateWizardNodes(targetPanel);
}

function prevStep(targetPanel) {
    document.querySelectorAll('.wizard-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById('step' + targetPanel).classList.add('active');
    updateWizardNodes(targetPanel);
}

function updateWizardNodes(panelNumber) {
    const nodes = document.querySelectorAll('.wizard-node');
    nodes.forEach((node, index) => {
        if (index < panelNumber) { node.classList.add('active'); } 
        else { node.classList.remove('active'); }
    });
}

function confirmReservation() {
    document.querySelector('.modal-wizard-header').style.display = 'none';
    document.querySelectorAll('.wizard-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById('step-success').classList.add('active');
}

function clearWizardForm() {
    document.querySelector('.modal-wizard-header').style.display = 'flex';
    nextStep(1);
}
