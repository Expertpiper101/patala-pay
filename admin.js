const sampleOrders = [
  {
    id: "SPP-1001",
    type: "License",
    customer: "Demo Retail Store",
    item: "Starter monthly",
    total: 343.85,
    status: "Draft",
    paymentStatus: "Pending",
    licenseKey: "SPP-STARTER-DEMOXX-0001-483920",
    licenseReleased: false,
    createdAt: "2026-05-17T09:15:00",
  },
  {
    id: "SPP-1002",
    type: "License",
    customer: "Corner Market",
    item: "Growth annual",
    total: 6888.5,
    status: "Payment link",
    paymentStatus: "Pending",
    licenseKey: "SPP-GROWTH-CORNER-0003-719245",
    licenseReleased: false,
    createdAt: "2026-05-17T10:20:00",
  },
  {
    id: "HW-2001",
    type: "Hardware",
    customer: "Corner Market",
    item: "Printer, touchscreen, cash drawer",
    total: 7356.55,
    status: "Quote",
    createdAt: "2026-05-17T10:42:00",
  },
];

const adminMoney = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 2,
});

function formatAdminMoney(amount) {
  return adminMoney.format(amount).replace("ZAR", "R").trim();
}

function readOrders() {
  try {
    return JSON.parse(localStorage.getItem("simplePosStoreOrders") || "[]");
  } catch {
    return [];
  }
}

function writeOrders(orders) {
  localStorage.setItem("simplePosStoreOrders", JSON.stringify(orders));
}

function displayDate(value) {
  return new Date(value).toLocaleString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function filteredOrders() {
  const type = document.querySelector("#typeFilter").value;
  const search = document.querySelector("#adminSearch").value.trim().toLowerCase();
  return readOrders().filter((order) => {
    const matchesType = type === "All" || order.type === type;
    const matchesSearch = !search || `${order.id} ${order.customer} ${order.item}`.toLowerCase().includes(search);
    return matchesType && matchesSearch;
  });
}

function renderAdmin() {
  const orders = filteredOrders();
  const allOrders = readOrders();
  const body = document.querySelector("#adminOrdersBody");
  body.innerHTML = "";

  if (orders.length === 0) {
    body.innerHTML = '<tr><td colspan="9">No orders match the current filters.</td></tr>';
  } else {
    orders.forEach((order) => {
      const row = document.createElement("tr");
      const licenseKey = order.type === "License" && order.licenseReleased ? order.licenseKey : "Hidden";
      const action =
        order.type === "License" && !order.licenseReleased
          ? `<button class="table-action" type="button" data-mark-paid="${order.id}">Mark Paid</button>`
          : "";
      row.innerHTML = `
        <td>${order.id}</td>
        <td>${displayDate(order.createdAt)}</td>
        <td>${order.type}</td>
        <td>${order.customer}</td>
        <td>${order.item}</td>
        <td>${formatAdminMoney(Number(order.total || 0))}</td>
        <td><span class="status-pill">${order.status}</span></td>
        <td>${licenseKey}</td>
        <td>${action}</td>
      `;
      body.appendChild(row);
    });
  }

  const salesTotal = allOrders.reduce((total, order) => total + Number(order.total || 0), 0);
  document.querySelector("#metricSales").textContent = formatAdminMoney(salesTotal);
  document.querySelector("#metricOrders").textContent = allOrders.length;
  document.querySelector("#metricLicenses").textContent = allOrders.filter((order) => order.type === "License").length;
  document.querySelector("#metricHardware").textContent = allOrders.filter((order) => order.type === "Hardware").length;
}

document.querySelector("#typeFilter").addEventListener("change", renderAdmin);
document.querySelector("#adminSearch").addEventListener("input", renderAdmin);
document.querySelector("#seedOrders").addEventListener("click", () => {
  const existing = readOrders();
  const ids = new Set(existing.map((order) => order.id));
  writeOrders([...sampleOrders.filter((order) => !ids.has(order.id)), ...existing]);
  renderAdmin();
});

document.querySelector("#adminOrdersBody").addEventListener("click", (event) => {
  const button = event.target.closest("[data-mark-paid]");
  if (!button) {
    return;
  }
  const orders = readOrders().map((order) => {
    if (order.id !== button.dataset.markPaid) {
      return order;
    }
    return {
      ...order,
      status: "Paid",
      paymentStatus: "Paid",
      licenseReleased: true,
    };
  });
  writeOrders(orders);
  renderAdmin();
});

if (readOrders().length === 0) {
  writeOrders(sampleOrders);
}

renderAdmin();
