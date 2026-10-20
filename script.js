
/* =====================================
   PWP WASHING POWDER WEBSITE
   Quantity, Cart & WhatsApp Checkout
===================================== */

// Product information
const PRODUCTS = {
  "500g": {
    name: "PWP Washing Powder - 500 g",
    price: 200,
    quantity: 0
  },

  "1kg": {
    name: "PWP Washing Powder - 1 kg",
    price: 400,
    quantity: 0
  }
};

// WhatsApp number in international format
const WHATSAPP_NUMBER = "923332496641";

// Format amounts in Pakistani Rupees
function formatPrice(amount) {
  return "Rs. " + amount.toLocaleString("en-PK");
}

// Calculate total packs in the cart
function getTotalPacks() {
  return Object.values(PRODUCTS).reduce(
    (total, product) => total + product.quantity,
    0
  );
}

// Calculate the full order price
function getGrandTotal() {
  return Object.values(PRODUCTS).reduce(
    (total, product) => total + product.quantity * product.price,
    0
  );
}

// Update all quantities and totals on the page
function updateCart() {
  const packCount = getTotalPacks();
  const grandTotal = getGrandTotal();

  // Product quantities
  document.getElementById("qty-500g").textContent =
    PRODUCTS["500g"].quantity;

  document.getElementById("qty-1kg").textContent =
    PRODUCTS["1kg"].quantity;

  // 500 g order summary
  document.getElementById("summary-500g-qty").textContent =
    PRODUCTS["500g"].quantity;

  document.getElementById("summary-500g-total").textContent =
    formatPrice(
      PRODUCTS["500g"].quantity * PRODUCTS["500g"].price
    );

  // 1 kg order summary
  document.getElementById("summary-1kg-qty").textContent =
    PRODUCTS["1kg"].quantity;

  document.getElementById("summary-1kg-total").textContent =
    formatPrice(
      PRODUCTS["1kg"].quantity * PRODUCTS["1kg"].price
    );

  // Grand total and cart counter
  document.getElementById("grand-total").textContent =
    formatPrice(grandTotal);

  document.getElementById("cart-count").textContent =
    packCount;

  // Update the cart message
  const cartMessage = document.getElementById("cart-message");

  if (packCount === 0) {
    cartMessage.textContent =
      "Your cart is empty. Add a product to get started.";
  } else {
    cartMessage.textContent =
      packCount + (packCount === 1 ? " pack selected." : " packs selected.") +
      " Your current total is " + formatPrice(grandTotal) + ".";
  }
}

// Handle plus, minus and add-to-order buttons
document.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-action]");

  if (!button) return;

  const action = button.dataset.action;
  const productId = button.dataset.id;
  const product = PRODUCTS[productId];

  if (!product) return;

  if (action === "plus" || action === "add") {
    product.quantity += 1;
  } else if (action === "minus") {
    product.quantity = Math.max(0, product.quantity - 1);
  } else {
    return;
  }

  updateCart();
});

// Display validation messages
function showFormError(message) {
  document.getElementById("form-error").textContent = message;
}

// Create the WhatsApp order message
function createOrderMessage(customer) {
  const lines = [];

  lines.push("Hello PWP! I want to place an order.");
  lines.push("");
  lines.push("CUSTOMER DETAILS");
  lines.push("Name: " + customer.name);
  lines.push("Phone: " + customer.phone);
  lines.push("Address: " + customer.address);
  lines.push("");
  lines.push("ORDER DETAILS");

  Object.values(PRODUCTS).forEach(function (product) {
    if (product.quantity > 0) {
      const lineTotal = product.quantity * product.price;

      lines.push(product.name);
      lines.push(
        "Quantity: " + product.quantity +
        " x " + formatPrice(product.price)
      );
      lines.push("Subtotal: " + formatPrice(lineTotal));
      lines.push("");
    }
  });

  lines.push("TOTAL: " + formatPrice(getGrandTotal()));
  lines.push("");
  lines.push("Please confirm product availability, delivery charges,");
  lines.push("and payment arrangements. Thank you!");

  return lines.join("\n");
}

// Handle checkout
document.getElementById("checkout-form").addEventListener(
  "submit",
  function (event) {
    event.preventDefault();

    showFormError("");

    const name = document
      .getElementById("customer-name")
      .value.trim();

    const phone = document
      .getElementById("customer-phone")
      .value.trim();

    const address = document
      .getElementById("customer-address")
      .value.trim();

    // Make sure at least one product is selected
    if (getTotalPacks() === 0) {
      showFormError(
        "Please add at least one product to your order."
      );

      document.getElementById("products").scrollIntoView({
        behavior: "smooth"
      });

      return;
    }

    // Validate customer details
    if (!name || !phone || !address) {
      showFormError(
        "Please enter your name, phone number and full address."
      );
      return;
    }

    // Validate phone number
    const phoneDigits = phone.replace(/\D/g, "");

    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      showFormError(
        "Please enter a valid phone number."
      );
      return;
    }

    // Build the complete order
    const customer = {
      name: name,
      phone: phone,
      address: address
    };

    const message = createOrderMessage(customer);

    const whatsappURL =
      "https://wa.me/" +
      WHATSAPP_NUMBER +
      "?text=" +
      encodeURIComponent(message);

    // Open WhatsApp with the order pre-filled
    window.location.href = whatsappURL;
  }
);

// Set the footer year
document.getElementById("current-year").textContent =
  new Date().getFullYear();

// Initialize the cart when the page loads
updateCart();
