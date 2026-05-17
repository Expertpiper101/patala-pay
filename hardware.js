const products = {
  printer: { name: "Thermal Receipt Printer", price: 1899 },
  touchscreen: { name: "Touchscreen Monitor", price: 3499 },
  drawer: { name: "Cash Drawer", price: 1299 },
  desktop: { name: "POS Desktop Computer", price: 5999 },
};

const bundles = {
  counter: ["printer", "touchscreen", "drawer"],
  complete: ["printer", "touchscreen", "drawer", "desktop"],
};

const hardwareCart = {};
const vatRateHardware = 0.15;
const cartNode = document.querySelector("#hardwareCart");
const statusNode = document.querySelector("#hardwareStatus");
let hardwareOrderNumber = 2001;

const hardwareMoney = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 2,
});

function formatHardwareMoney(amount) {
  return hardwareMoney.format(amount).replace("ZAR", "R").trim();
}

function addProduct(productKey) {
  hardwareCart[productKey] = (hardwareCart[productKey] || 0) + 1;
  renderHardwareCart();
}

function cartSubtotal() {
  return Object.entries(hardwareCart).reduce((total, [key, qty]) => total + products[key].price * qty, 0);
}

function renderHardwareCart() {
  const entries = Object.entries(hardwareCart).filter(([, qty]) => qty > 0);
  cartNode.innerHTML = "";

  if (entries.length === 0) {
    cartNode.innerHTML = '<p class="empty-cart">No hardware selected yet.</p>';
  } else {
    entries.forEach(([key, qty]) => {
      const item = products[key];
      const row = document.createElement("div");
      row.className = "hardware-cart-row";
      row.innerHTML = `
        <span>${item.name}</span>
        <div>
          <button type="button" data-remove-product="${key}" aria-label="Remove ${item.name}">-</button>
          <strong>${qty}</strong>
          <button type="button" data-add-product="${key}" aria-label="Add ${item.name}">+</button>
        </div>
        <b>${formatHardwareMoney(item.price * qty)}</b>
      `;
      cartNode.appendChild(row);
    });
  }

  const subtotal = cartSubtotal();
  const vat = subtotal * vatRateHardware;
  document.querySelector("#hardwareSubtotal").textContent = formatHardwareMoney(subtotal);
  document.querySelector("#hardwareVat").textContent = formatHardwareMoney(vat);
  document.querySelector("#hardwareTotal").textContent = formatHardwareMoney(subtotal + vat);
}

function readStoreOrders() {
  try {
    return JSON.parse(localStorage.getItem("simplePosStoreOrders") || "[]");
  } catch {
    return [];
  }
}

function saveStoreOrder(order) {
  const orders = readStoreOrders();
  orders.unshift(order);
  localStorage.setItem("simplePosStoreOrders", JSON.stringify(orders.slice(0, 100)));
}

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-product]");
  if (addButton) {
    addProduct(addButton.dataset.addProduct);
    return;
  }

  const removeButton = event.target.closest("[data-remove-product]");
  if (removeButton) {
    const key = removeButton.dataset.removeProduct;
    hardwareCart[key] = Math.max(0, (hardwareCart[key] || 0) - 1);
    renderHardwareCart();
    return;
  }

  const bundleButton = event.target.closest("[data-bundle]");
  if (bundleButton) {
    bundles[bundleButton.dataset.bundle].forEach(addProduct);
  }
});

document.querySelector("#hardwareForm").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!window.simplePosAuth?.requireLoginForPurchase()) {
    return;
  }
  const subtotal = cartSubtotal();
  if (subtotal <= 0) {
    statusNode.textContent = "Add at least one hardware item before preparing a quote";
    return;
  }
  const business = event.currentTarget.elements.businessName.value.trim() || "Unnamed Customer";
  const total = subtotal * (1 + vatRateHardware);
  const selectedItems = Object.entries(hardwareCart)
    .filter(([, qty]) => qty > 0)
    .map(([key, qty]) => `${qty} x ${products[key].name}`)
    .join(", ");
  const orderId = `HW-${hardwareOrderNumber++}`;

  saveStoreOrder({
    id: orderId,
    type: "Hardware",
    customer: business,
    item: selectedItems,
    total,
    status: "Quote",
    createdAt: new Date().toISOString(),
  });
  statusNode.textContent = `Hardware quote ${orderId} ready: ${formatHardwareMoney(total)}`;
  window.simplePosPayFast.submitPayment({
    id: orderId,
    type: "Hardware",
    customer: business,
    item: selectedItems,
    total,
  });
});

renderHardwareCart();
