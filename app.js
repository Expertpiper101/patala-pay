const plans = {
  starter: {
    name: "Starter",
    monthly: 299,
    annual: 2990,
    machineLimit: 1,
  },
  growth: {
    name: "Growth",
    monthly: 599,
    annual: 5990,
    machineLimit: 3,
  },
  multi: {
    name: "Multi-Store",
    monthly: 999,
    annual: 9990,
    machineLimit: 10,
  },
};

const vatRate = 0.15;
let selectedPlan = "starter";
let selectedTerm = "monthly";
let orderNumber = 1002;

const formatter = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 2,
});

const form = document.querySelector("#licenseForm");
const planButtons = document.querySelectorAll(".plan-card");
const termButtons = document.querySelectorAll(".term-button");
const ordersBody = document.querySelector("#ordersBody");

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

function money(amount) {
  return formatter.format(amount).replace("ZAR", "R").trim();
}

function customerCode(value) {
  return String(value || "CLIENT")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "")
    .slice(0, 6)
    .padEnd(4, "X");
}

function currentMachines() {
  const machines = Number(form.elements.machines.value || 1);
  return Math.max(1, Math.min(50, machines));
}

function calculateTotals() {
  const plan = plans[selectedPlan];
  const machines = currentMachines();
  const included = plan.machineLimit;
  const extraMachines = Math.max(0, machines - included);
  const base = plan[selectedTerm];
  const extraRate = selectedTerm === "annual" ? 1490 : 149;
  const subtotal = base + extraMachines * extraRate;
  const vat = subtotal * vatRate;
  return {
    subtotal,
    vat,
    total: subtotal + vat,
    machines,
  };
}

function refreshPrices() {
  Object.entries(plans).forEach(([key, plan]) => {
    const priceNode = document.querySelector(`[data-price-for="${key}"]`);
    const suffix = selectedTerm === "annual" ? "/yr" : "/mo";
    priceNode.textContent = `${money(plan[selectedTerm])}${suffix}`;
  });
}

function refreshSummary() {
  const plan = plans[selectedPlan];
  const totals = calculateTotals();

  document.querySelector("#summaryPlan").textContent = plan.name;
  document.querySelector("#summaryTerm").textContent = selectedTerm === "annual" ? "Annual" : "Monthly";
  document.querySelector("#summaryMachines").textContent = totals.machines;
  document.querySelector("#summarySubtotal").textContent = money(totals.subtotal);
  document.querySelector("#summaryVat").textContent = money(totals.vat);
  document.querySelector("#summaryTotal").textContent = money(totals.total);
  document.querySelector("#licenseKey").textContent = "Locked until payment succeeds";
}

function createLicenseKey(plan, business, machines) {
  const serial = Math.floor(100000 + Math.random() * 900000);
  return `SPP-${plan.name.toUpperCase()}-${customerCode(business)}-${String(machines).padStart(4, "0")}-${serial}`;
}

function selectPlan(planKey) {
  selectedPlan = planKey;
  planButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.plan === planKey);
  });
  refreshSummary();
}

function selectTerm(term) {
  selectedTerm = term;
  termButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.term === term);
  });
  refreshPrices();
  refreshSummary();
}

planButtons.forEach((button) => {
  button.addEventListener("click", () => selectPlan(button.dataset.plan));
});

termButtons.forEach((button) => {
  button.addEventListener("click", () => selectTerm(button.dataset.term));
});

form.addEventListener("input", refreshSummary);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!window.simplePosAuth?.requireLoginForPurchase()) {
    return;
  }
  const totals = calculateTotals();
  const plan = plans[selectedPlan];
  const business = form.elements.businessName.value.trim() || "Unnamed Customer";
  const status = form.elements.paymentMethod.value === "eft" ? "Invoice" : "Payment link";
  const orderId = `SPP-${orderNumber++}`;
  const licenseKey = createLicenseKey(plan, business, totals.machines);
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${orderId}</td>
    <td>${business}</td>
    <td>${plan.name} ${selectedTerm}</td>
    <td>${money(totals.total)}</td>
    <td><span class="status-pill">${status}</span></td>
  `;
  ordersBody.prepend(row);
  saveStoreOrder({
    id: orderId,
    type: "License",
    customer: business,
    item: `${plan.name} ${selectedTerm}`,
    total: totals.total,
    status,
    paymentStatus: "Pending",
    licenseKey,
    licenseReleased: false,
    createdAt: new Date().toISOString(),
  });
  document.querySelector("#paymentStatus").textContent =
    status === "Invoice" ? "EFT invoice ready to send" : "Payment link ready to generate";
  if (form.elements.paymentMethod.value === "payfast") {
    window.simplePosPayFast.submitPayment({
      id: orderId,
      type: "License",
      customer: business,
      item: `${plan.name} ${selectedTerm}`,
      total: totals.total,
    });
  }
});

refreshPrices();
refreshSummary();
