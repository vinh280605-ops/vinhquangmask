

function toggleSearch() {
    const overlay = document.getElementById("search-overlay");
    const input = document.getElementById("search-input");

    // Toggle active class
    if (overlay.classList.contains("active")) {
        overlay.classList.remove("active");
    } else {
        overlay.classList.add("active");
        setTimeout(() => input.focus(), 100);
    }
}

function handleSearch(event) {
    if (event.key === "Enter") {
        alert(`Searching for: ${event.target.value}`);
        toggleSearch();
    }
}

let cart = [];

// --- 1. Filter Logic ---
const checkboxes = document.querySelectorAll(".filter-checkbox");
const productCards = document.querySelectorAll(".product-card");

checkboxes.forEach((box) => {
    box.addEventListener("change", filterProducts);
});

function filterProducts() {
    const selectedCategories = Array.from(
        document.querySelectorAll(
            "#cat-adult:checked, #cat-kids:checked"
        )
    ).map((cb) => cb.value);
    const selectedTypes = Array.from(
        document.querySelectorAll('input[id^="type-"]:checked')
    ).map((cb) => cb.value);

    productCards.forEach((card) => {
        const cardCats = card
            .getAttribute("data-category")
            .split(" ");
        const cardType = card.getAttribute("data-type");
        const matchCategory =
            selectedCategories.length === 0 ||
            selectedCategories.some((cat) =>
                cardCats.includes(cat)
            );
        const matchType =
            selectedTypes.length === 0 ||
            selectedTypes.includes(cardType);
        card.style.display =
            matchCategory && matchType ? "flex" : "none";
    });
}

function resetFilters() {
    checkboxes.forEach((cb) => (cb.checked = false));
    filterProducts();
}

// --- 2. Modal Logic ---
const modal = document.getElementById("product-modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalPrice = document.getElementById("modal-price");
const modalDesc = document.getElementById("modal-desc");
let currentQty = 1;
let currentProductData = {};

const defaultDesc =
    "Experience premium protection with our VQ masks. Designed for all-day comfort, these masks feature a patented ear-loop design that prevents pain even after hours of wear.";

function openProductModal(title, price, imgSrc, specificDesc) {
    modalTitle.innerText = title;
    modalPrice.innerText = "$" + price.toFixed(2);
    modalImg.src = imgSrc;
    modalDesc.innerText = specificDesc || defaultDesc;

    currentProductData = { title, price, imgSrc };
    currentQty = 1;
    document.getElementById("modal-qty").innerText = currentQty;
    modal.classList.add("active");
}

function closeModal() {
    modal.classList.remove("active");
}

function updateQty(change) {
    currentQty += change;
    if (currentQty < 1) currentQty = 1;
    document.getElementById("modal-qty").innerText = currentQty;
}

function addToCartFromModal() {
    closeModal();
    addToCart(
        currentProductData.title,
        currentProductData.price,
        currentProductData.imgSrc,
        currentQty
    );
}

// --- 3. CART LOGIC ---
const cartSidebar = document.getElementById("cart-sidebar");
const cartOverlay = document.getElementById("cart-overlay");
const cartItemsContainer = document.getElementById(
    "cart-items-container"
);
const cartSubtotalEl = document.getElementById("cart-subtotal");
const cartCountEl = document.getElementById("cart-count");
const cartTotalCountEl =
    document.getElementById("cart-total-count");
const btnCheckout = document.getElementById("btn-checkout");

const viewItems = document.getElementById("cart-view-items");
const viewCheckout = document.getElementById("cart-view-checkout");
const viewSuccess = document.getElementById("cart-view-success");

function toggleCart() {
    if (cartSidebar.classList.contains("open")) {
        cartSidebar.classList.remove("open");
        cartOverlay.classList.remove("active");
    } else {
        cartSidebar.classList.add("open");
        cartOverlay.classList.add("active");
        showCartItemsView();
    }
}

function addToCart(title, price, img, qty = 1) {
    const existingItem = cart.find((item) => item.title === title);
    if (existingItem) {
        existingItem.qty += qty;
    } else {
        cart.push({ title, price, img, qty });
    }
    updateCartUI();
    showToast();
}

function removeFromCart(title) {
    cart = cart.filter((item) => item.title !== title);
    updateCartUI();
}

function changeCartQty(title, change) {
    const item = cart.find((item) => item.title === title);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) {
            removeFromCart(title);
        } else {
            updateCartUI();
        }
    }
}

function updateCartUI() {
    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    cartCountEl.innerText = totalQty;
    cartTotalCountEl.innerText = `(${totalQty} items)`;
    cartCountEl.classList.add("pop");
    setTimeout(() => cartCountEl.classList.remove("pop"), 200);

    cartItemsContainer.innerHTML = "";
    let subtotal = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
                    <div class="empty-cart">
                        <i class="ph ph-shopping-cart"></i>
                        <p>Your cart is empty.</p>
                        <button onclick="toggleCart()" style="margin-top:1rem; color:var(--brand-600); font-weight:600; text-decoration:underline;">Start Shopping</button>
                    </div>`;
        btnCheckout.disabled = true;
        cartSubtotalEl.innerText = "$0.00";
    } else {
        btnCheckout.disabled = false;
        cart.forEach((item) => {
            subtotal += item.price * item.qty;
            const itemHTML = `
                        <div class="cart-item">
                            <div class="cart-item-img">
                                <img src="${item.img}">
                            </div>
                            <div class="cart-item-details">
                                <div class="cart-item-header">
                                    <h4 class="cart-item-title">${item.title
                }</h4>
                                    <button onclick="removeFromCart('${item.title
                }')" class="remove-btn"><i class="ph ph-trash"></i></button>
                                </div>
                                <div class="cart-item-price">$${item.price.toFixed(
                    2
                )}</div>
                                <div class="qty-selector" style="width:fit-content; height:32px;">
                                    <button class="qty-btn" onclick="changeCartQty('${item.title
                }', -1)"><i class="ph ph-minus" style="font-size:0.75rem;"></i></button>
                                    <span class="qty-val" style="font-size:0.8rem;">${item.qty
                }</span>
                                    <button class="qty-btn" onclick="changeCartQty('${item.title
                }', 1)"><i class="ph ph-plus" style="font-size:0.75rem;"></i></button>
                                </div>
                            </div>
                        </div>
                    `;
            cartItemsContainer.innerHTML += itemHTML;
        });
        const totalString = "$" + subtotal.toFixed(2);
        cartSubtotalEl.innerText = totalString;
        document.getElementById("checkout-total").innerText =
            totalString;
        document.getElementById(
            "btn-pay"
        ).innerText = `Pay Now ${totalString}`;
    }
}

function showCartItemsView() {
    viewItems.style.display = "flex";
    viewCheckout.classList.remove("active");
    viewSuccess.classList.remove("active");
}

function showCheckout() {
    viewItems.style.display = "none";
    viewCheckout.classList.add("active");
}

function hideCheckout() {
    viewItems.style.display = "flex";
    viewCheckout.classList.remove("active");
}

function processPayment(e) {
    e.preventDefault();
    const btn = document.getElementById("btn-pay");
    const originalText = btn.innerText;
    btn.innerHTML =
        '<i class="ph ph-spinner animate-spin" style="margin-right:0.5rem"></i> Processing...';
    btn.disabled = true;

    setTimeout(() => {
        viewCheckout.classList.remove("active");
        viewSuccess.classList.add("active");
        cart = [];
        updateCartUI();
    }, 2000);
}

function resetCartAndClose() {
    toggleCart();
    setTimeout(() => {
        showCartItemsView();
    }, 300);
}

const toast = document.getElementById("toast");
function showToast() {
    toast.classList.add("show");
    setTimeout(function () {
        toast.classList.remove("show");
    }, 3000);
}