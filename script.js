// Fetch cart data from the API
async function fetchCartData() {
    try {
        const response = await fetch("https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889"); // Replace "API_CART_URL" with the actual API endpoint.
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching cart data:", error);
    }
}

// Format prices as INR currency
function formatPrice(price) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    }).format(price / 100); // Convert to rupees (assuming API sends prices in paise).
}

// Update the total and subtotal dynamically
function updateTotals(cartItems) {
    let subtotal = 0;

    cartItems.forEach(item => {
        subtotal += item.quantity * item.price;
    });

    const total = subtotal; // Include other charges here if applicable.
    document.querySelector(".subtotal h4:last-child").textContent = formatPrice(subtotal);
    document.querySelector(".total h4:last-child").textContent = formatPrice(total);
}

// Render cart items dynamically
function renderCartItems(cartItems) {
    const leftCart = document.querySelector(".leftcart-details");
    leftCart.innerHTML = ""; // Clear any existing items

    cartItems.forEach((item, index) => {
        const itemRow = document.createElement("div");
        itemRow.className = "leftcart-item";
        itemRow.innerHTML = `
            <div class="item-details">
                <img src="${item.image}" width= "108px" height = "105px" alt="${item.title}" class="item-image" />
                <div class="item-info">
                    <h4>${item.title}</h4>
                </div>
            </div>
            <h4 class="price">${formatPrice(item.price)}</h4>
            <input type="number" class="quantity" min="1" value="${item.quantity}" data-index="${index}" />
            <h4 class="subtotal">${formatPrice(item.quantity * item.price)}</h4>
            <img src="./assets/trash-icon.png" width= '30px' alt="Remove" class="remove-item" data-index="${index}" />
        
        
        `;
        leftCart.appendChild(itemRow);
    });
}

// Handle quantity changes
function handleQuantityChange(cartItems) {
    const quantityInputs = document.querySelectorAll(".quantity");
    quantityInputs.forEach(input => {
        input.addEventListener("change", event => {
            const index = event.target.dataset.index;
            const newQuantity = parseInt(event.target.value);
            cartItems[index].quantity = newQuantity;
            renderCartItems(cartItems);
            updateTotals(cartItems);
        });
    });
}

// Handle item removal
function handleItemRemoval(cartItems) {
    const removeButtons = document.querySelectorAll(".remove-item");
    removeButtons.forEach(button => {
        button.addEventListener("click", event => {
            const index = event.target.dataset.index;
            cartItems.splice(index, 1); // Remove the item from the cart array
            renderCartItems(cartItems);
            updateTotals(cartItems);
        });
    });
}

// Initialize cart functionality
async function initializeCart() {
    const cartData = await fetchCartData();
    let cartItems = cartData.items;

    renderCartItems(cartItems);
    updateTotals(cartItems);

    // Attach event handlers for quantity changes and item removal
    handleQuantityChange(cartItems);
    handleItemRemoval(cartItems);

    // Handle checkout button
    document.querySelector(".btn").addEventListener("click", () => {
        alert("Checkout functionality to be implemented!");
    });
}

// Run the cart initialization
initializeCart();
