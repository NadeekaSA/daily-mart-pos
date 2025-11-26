// Default product list
let products = [
    { id: 1, name: "Rice", price: 250 },
    { id: 2, name: "Milk 1L", price: 380 },
    { id: 3, name: "Sugar 1kg", price: 290 },
    { id: 4, name: "Bread", price: 160 },
];

// Load products from localStorage if exist
if (localStorage.getItem("products")) {
    products = JSON.parse(localStorage.getItem("products"));
}

// Cart
let cart = [];

// Orders storage
let orders = JSON.parse(localStorage.getItem("orders")) || [];

// Load & Display Products
function loadProducts() {
    const list = document.getElementById("productList");
    list.innerHTML = "";

    products.forEach(p => {
        list.innerHTML += `
            <div class="product-card">
                <h4>${p.name}</h4>
                <p>Rs. ${p.price}</p>
                <button onclick="addToCart(${p.id})">Add</button>
            </div>
        `;
    });

    loadCRUDList();
}

// Add to Cart
function addToCart(id) {
    const item = products.find(p => p.id === id);

    const exists = cart.find(c => c.id === id);
    if (exists) {
        exists.qty++;
    } else {
        cart.push({ ...item, qty: 1 });
    }

    updateCart();
}

// Update Cart Table
function updateCart() {
    const cartTable = document.getElementById("cartItems");
    cartTable.innerHTML = "";

    let subtotal = 0;

    cart.forEach((item, index) => {
        const total = item.price * item.qty;
        subtotal += total;

        cartTable.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.qty}</td>
                <td>${item.price}</td>
                <td>${total}</td>
                <td><button onclick="removeItem(${index})">X</button></td>
            </tr>
        `;
    });

    let tax = subtotal * 0.05;
    let grand = subtotal + tax;

    document.getElementById("subtotal").innerText = subtotal.toFixed(2);
    document.getElementById("tax").innerText = tax.toFixed(2);
    document.getElementById("total").innerText = grand.toFixed(2);
}

// Remove item from cart
function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

// ADD PRODUCT (CRUD)
function addProduct() {
    let name = document.getElementById("pname").value;
    let price = Number(document.getElementById("pprice").value);

    if (!name || !price) {
        alert("Please fill all fields.");
        return;
    }

    const newP = {
        id: Date.now(),
        name,
        price
    };

    products.push(newP);
    localStorage.setItem("products", JSON.stringify(products));

    loadProducts();
}

// CRUD LIST
function loadCRUDList() {
    const ul = document.getElementById("productCRUD");
    ul.innerHTML = "";

    products.forEach((p, index) => {
        ul.innerHTML += `
            <li>${p.name} - Rs ${p.price}
                <button onclick="deleteProduct(${index})">Delete</button>
            </li>
        `;
    });
}

// DELETE PRODUCT
function deleteProduct(i) {
    products.splice(i, 1);
    localStorage.setItem("products", JSON.stringify(products));
    loadProducts();
}

// ✅ CHECKOUT FUNCTION (FULL)
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // Calculate totals
    let subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    let tax = subtotal * 0.05;
    let total = subtotal + tax;

    // Create order object
    const order = {
        id: Date.now(),
        items: cart,
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        date: new Date().toLocaleString()
    };

    // Save order list
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Receipt popup
    let receipt = "🧾 DailyMart Receipt\n\n";
    cart.forEach(item => {
        receipt += `${item.name} (x${item.qty}) - Rs. ${item.price * item.qty}\n`;
    });
    receipt += `\nSubtotal: Rs. ${subtotal.toFixed(2)}`;
    receipt += `\nTax (5%): Rs. ${tax.toFixed(2)}`;
    receipt += `\nTotal: Rs. ${total.toFixed(2)}\n`;
    receipt += "\nThank you for shopping with DailyMart!";

    alert(receipt);

    // Clear cart
    cart = [];
    updateCart();
}

// Attach checkout button
document.getElementById("checkoutBtn").onclick = checkout;

// Load on start
loadProducts();
