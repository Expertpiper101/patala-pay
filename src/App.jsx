import { useEffect, useState } from "react";

const ORDER_KEY = "simplePosStoreOrders";
const SESSION_KEY = "simplePosAuthSession";
const USERS_KEY = "simplePosRegisteredUsers";

const demoUsers = [
  { email: "admin@simplepos.local", password: "admin123", name: "Store Admin", role: "admin" },
  { email: "sales@simplepos.local", password: "sales123", name: "Sales User", role: "user" },
];

const plans = {
  starter: { name: "Starter", monthly: 299, annual: 2990, machineLimit: 1 },
  growth: { name: "Growth", monthly: 599, annual: 5990, machineLimit: 3 },
  multi: { name: "Multi-Store", monthly: 999, annual: 9990, machineLimit: 10 },
};

const hardwareProducts = {
  printer: { name: "Thermal Receipt Printer", price: 1899 },
  touchscreen: { name: "Touchscreen Monitor", price: 3499 },
  drawer: { name: "Cash Drawer", price: 1299 },
  desktop: { name: "POS Desktop Computer", price: 5999 },
};

const bundles = {
  counter: ["printer", "touchscreen", "drawer"],
  complete: ["printer", "touchscreen", "drawer", "desktop"],
};

function money(value) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 2 })
    .format(Number(value || 0))
    .replace("ZAR", "R")
    .trim();
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function customerCode(value) {
  return String(value || "CLIENT").toUpperCase().replace(/[^A-Z0-9]+/g, "").slice(0, 6).padEnd(4, "X");
}

function createLicenseKey(plan, business, machines) {
  const serial = Math.floor(100000 + Math.random() * 900000);
  return `SPP-${plan.name.toUpperCase()}-${customerCode(business)}-${String(machines).padStart(4, "0")}-${serial}`;
}

function copyText(value) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(value);
    return;
  }
  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.left = "-9999px";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
}

function BrandNav({ view, setView, session, logout }) {
  return (
    <header className="topbar">
      <button className="brand brand-button" onClick={() => setView("licenses")} type="button">
        <img src="/assets/business-logo.png" alt="" />
        <span>Patala Pay</span>
      </button>
      <nav aria-label="Primary">
        <button type="button" onClick={() => setView("licenses")}>Licenses</button>
        <button type="button" onClick={() => setView("hardware")}>Hardware</button>
        <button type="button" onClick={() => setView("admin")}>Admin</button>
        {!session ? <button type="button" onClick={() => setView("login")}>Login</button> : null}
        {session ? <span className="account-pill">{session.name} | {session.role}</span> : null}
        {session ? <button className="logout-button" type="button" onClick={logout}>Logout</button> : null}
      </nav>
    </header>
  );
}

function LoginView({ setView, setSession }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", businessName: "", email: "admin@simplepos.local", password: "admin123" });
  const [error, setError] = useState("");
  const users = () => [...demoUsers, ...readJson(USERS_KEY, [])];

  const submit = (event) => {
    event.preventDefault();
    setError("");
    const email = form.email.trim().toLowerCase();
    if (mode === "signup") {
      if (users().some((user) => user.email === email)) {
        setError("An account with this email already exists.");
        return;
      }
      const user = { email, password: form.password, name: form.name, businessName: form.businessName, role: "user", verified: false };
      const registered = readJson(USERS_KEY, []);
      localStorage.setItem(USERS_KEY, JSON.stringify([...registered, user]));
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
      setSession(user);
      setView("licenses");
      return;
    }
    const user = users().find((candidate) => candidate.email === email && candidate.password === form.password);
    if (!user) {
      setError("Invalid email or password.");
      return;
    }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    setSession(user);
    setView(user.role === "admin" ? "admin" : "licenses");
  };

  return (
    <main className="login-shell">
      <section className="login-panel">
        <button className="brand login-brand brand-button" type="button" onClick={() => setView("licenses")}>
          <img src="/assets/business-logo.png" alt="" />
          <span>Patala Pay</span>
        </button>
        <div>
          <p className="eyebrow">Secure access</p>
          <h1>Sign in or create an account.</h1>
          <p className="lede">Browse freely, then sign in when you are ready to place a license or hardware order.</p>
        </div>
        <div className="auth-tabs">
          <button className={`auth-tab ${mode === "login" ? "is-active" : ""}`} type="button" onClick={() => setMode("login")}>Sign In</button>
          <button className={`auth-tab ${mode === "signup" ? "is-active" : ""}`} type="button" onClick={() => setMode("signup")}>Create Account</button>
        </div>
        <form className="login-form auth-panel is-active" onSubmit={submit}>
          {mode === "signup" ? (
            <>
              <label>Full name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
              <label>Business name<input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} /></label>
            </>
          ) : null}
          <label>Email address<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label>Password<input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
          <button className="primary-action" type="submit">{mode === "signup" ? "Create Account" : "Sign In"}</button>
          <p className="login-error">{error}</p>
        </form>
        <div className="demo-accounts">
          <strong>Demo accounts</strong>
          <span>Admin: admin@simplepos.local / admin123</span>
          <span>User: sales@simplepos.local / sales123</span>
          <span>New signups are active immediately and do not require verification yet.</span>
        </div>
      </section>
    </main>
  );
}

function LicenseView({ session, requireLogin, addOrder }) {
  const [selectedPlan, setSelectedPlan] = useState("starter");
  const [term, setTerm] = useState("monthly");
  const [form, setForm] = useState({ businessName: "Demo Retail Store", contactName: "Store Owner", email: "owner@example.com", phone: "+27 82 000 0000", machines: 1, paymentMethod: "payfast", notes: "" });
  const plan = plans[selectedPlan];
  const machines = Math.max(1, Number(form.machines || 1));
  const extraMachines = Math.max(0, machines - plan.machineLimit);
  const subtotal = plan[term] + extraMachines * (term === "annual" ? 1490 : 149);
  const vat = subtotal * 0.15;
  const total = subtotal + vat;

  const submit = (event) => {
    event.preventDefault();
    if (!requireLogin()) return;
    const order = {
      id: `SPP-${Date.now()}`,
      type: "License",
      customer: form.businessName,
      item: `${plan.name} ${term}`,
      total,
      status: form.paymentMethod === "eft" ? "Invoice" : "Payment link",
      paymentStatus: "Pending",
      licenseKey: createLicenseKey(plan, form.businessName, machines),
      licenseReleased: false,
      createdAt: new Date().toISOString(),
    };
    addOrder(order);
    if (form.paymentMethod === "payfast") {
      window.simplePosPayFast?.submitPayment(order);
    }
  };

  return (
    <main>
      <section className="purchase-shell">
        <div className="selector-panel">
          <div className="trial-alert"><strong>Trial expired?</strong> Choose a subscription below, complete payment, and use the issued license key to unlock the desktop POS.</div>
          <div className="panel-heading">
            <p className="eyebrow">License checkout</p>
            <h1>Purchase a Patala Pay license key.</h1>
            <p className="lede">Choose a plan, capture the business details, and prepare the subscription order for payment processing.</p>
          </div>
          <div className="billing-toggle">
            {["monthly", "annual"].map((value) => <button key={value} className={`term-button ${term === value ? "is-active" : ""}`} type="button" onClick={() => setTerm(value)}>{value === "monthly" ? "Monthly" : "Annual"}</button>)}
          </div>
          <div className="plans-grid">
            {Object.entries(plans).map(([key, value]) => (
              <button key={key} className={`plan-card ${selectedPlan === key ? "is-selected" : ""}`} type="button" onClick={() => setSelectedPlan(key)}>
                <span className="plan-name">{value.name}</span>
                <span className="plan-price">{money(value[term])}{term === "annual" ? "/yr" : "/mo"}</span>
                <span className="plan-note">{value.machineLimit} till{value.machineLimit > 1 ? "s" : ""}, support included</span>
              </button>
            ))}
          </div>
          <form className="checkout-form" onSubmit={submit}>
            {["businessName", "contactName", "email", "phone"].map((field) => (
              <label key={field}>{field.replace(/([A-Z])/g, " $1")}<input required={field !== "phone"} type={field === "email" ? "email" : "text"} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} /></label>
            ))}
            <label>Number of POS machines<input type="number" min="1" max="50" value={form.machines} onChange={(e) => setForm({ ...form, machines: e.target.value })} /></label>
            <label>Preferred payment method<select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}><option value="payfast">PayFast online payment</option><option value="eft">Manual EFT invoice</option><option value="card">Card payment link</option></select></label>
            <label className="wide-field">Notes<textarea rows="3" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
            <button className="primary-action" type="submit">{session ? "Create Purchase Order" : "Login To Purchase"}</button>
          </form>
        </div>
        <aside className="summary-panel">
          <div><p className="eyebrow">Order summary</p><h2>Ready to issue</h2></div>
          <dl className="summary-list">
            <div><dt>Plan</dt><dd>{plan.name}</dd></div>
            <div><dt>Billing</dt><dd>{term === "annual" ? "Annual" : "Monthly"}</dd></div>
            <div><dt>Machines</dt><dd>{machines}</dd></div>
            <div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
            <div><dt>VAT estimate</dt><dd>{money(vat)}</dd></div>
            <div className="total-row"><dt>Total due</dt><dd>{money(total)}</dd></div>
          </dl>
          <div className="license-preview"><span>License key</span><strong>Locked until payment succeeds</strong></div>
          <p className="unlock-note">After payment is confirmed, the license key will be released for the desktop POS.</p>
        </aside>
      </section>
    </main>
  );
}

function HardwareView({ session, requireLogin, addOrder }) {
  const [cart, setCart] = useState({});
  const [form, setForm] = useState({ businessName: "", deliveryArea: "", installPreference: "delivery" });
  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);
  const subtotal = entries.reduce((sum, [key, qty]) => sum + hardwareProducts[key].price * qty, 0);
  const total = subtotal * 1.15;
  const add = (key) => setCart((current) => ({ ...current, [key]: (current[key] || 0) + 1 }));
  const remove = (key) => setCart((current) => ({ ...current, [key]: Math.max(0, (current[key] || 0) - 1) }));
  const submit = (event) => {
    event.preventDefault();
    if (!requireLogin()) return;
    if (!entries.length) return;
    const item = entries.map(([key, qty]) => `${qty} x ${hardwareProducts[key].name}`).join(", ");
    const order = { id: `HW-${Date.now()}`, type: "Hardware", customer: form.businessName || "Unnamed Customer", item, total, status: "Quote", createdAt: new Date().toISOString() };
    addOrder(order);
    window.simplePosPayFast?.submitPayment(order);
  };

  return (
    <main>
      <section className="hardware-shell">
        <div className="hardware-main">
          <div className="panel-heading hardware-heading"><p className="eyebrow">POS hardware store</p><h1>Build the full checkout counter.</h1><p className="lede">Add the printer, touchscreen, cash drawer, and desktop computer your client needs for a complete Patala Pay POS setup.</p></div>
          <section className="hardware-section">
            <div className="section-title-row"><div><p className="eyebrow">Equipment</p><h2>Core POS hardware</h2></div></div>
            <div className="hardware-grid">
              {Object.entries(hardwareProducts).map(([key, product]) => (
                <article className="hardware-card" key={key}>
                  <div className={`product-visual ${key === "printer" ? "printer-visual" : key === "touchscreen" ? "screen-visual" : key === "drawer" ? "drawer-visual" : "desktop-visual"}`}><span /></div>
                  <div className="hardware-copy"><h3>{product.name}</h3><p>Professional POS-ready hardware for Patala Pay installations.</p><ul><li>Configured for counter use</li><li>Supplier quote ready</li><li>Installation option available</li></ul></div>
                  <div className="hardware-buy"><strong>{money(product.price)}</strong><button type="button" onClick={() => add(key)}>Add</button></div>
                </article>
              ))}
            </div>
          </section>
          <section className="hardware-section">
            <div className="section-title-row"><div><p className="eyebrow">Bundles</p><h2>Ready-made POS kits</h2></div></div>
            <div className="bundle-grid">
              <button className="bundle-card" type="button" onClick={() => bundles.counter.forEach(add)}><span>Counter Kit</span><strong>R6,397</strong><small>Printer, touchscreen, cash drawer</small></button>
              <button className="bundle-card" type="button" onClick={() => bundles.complete.forEach(add)}><span>Complete POS Kit</span><strong>R12,396</strong><small>Printer, touchscreen, cash drawer, desktop</small></button>
            </div>
          </section>
        </div>
        <aside className="hardware-summary">
          <div><p className="eyebrow">Hardware order</p><h2>Selected items</h2></div>
          <div className="hardware-cart">
            {!entries.length ? <p className="empty-cart">No hardware selected yet.</p> : entries.map(([key, qty]) => <div className="hardware-cart-row" key={key}><span>{hardwareProducts[key].name}</span><div><button type="button" onClick={() => remove(key)}>-</button><strong>{qty}</strong><button type="button" onClick={() => add(key)}>+</button></div><b>{money(hardwareProducts[key].price * qty)}</b></div>)}
          </div>
          <dl className="summary-list"><div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div><div><dt>VAT estimate</dt><dd>{money(subtotal * 0.15)}</dd></div><div className="total-row"><dt>Total</dt><dd>{money(total)}</dd></div></dl>
          <form className="hardware-form" onSubmit={submit}>
            <label>Business name<input required value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} /></label>
            <label>Delivery area<input value={form.deliveryArea} onChange={(e) => setForm({ ...form, deliveryArea: e.target.value })} /></label>
            <label>Installation preference<select value={form.installPreference} onChange={(e) => setForm({ ...form, installPreference: e.target.value })}><option value="delivery">Delivery only</option><option value="remote">Remote setup support</option><option value="onsite">On-site installation quote</option></select></label>
            <button className="primary-action" type="submit">{session ? "Pay With PayFast" : "Login To Order"}</button>
          </form>
        </aside>
      </section>
    </main>
  );
}

function AdminView({ session, orders, setOrders, setView, setSession }) {
  const [type, setType] = useState("All");
  const [search, setSearch] = useState("");
  if (!session || session.role !== "admin") {
    return <LoginView setView={setView} setSession={setSession} />;
  }
  const filtered = orders.filter((order) => (type === "All" || order.type === type) && `${order.id} ${order.customer} ${order.item}`.toLowerCase().includes(search.toLowerCase()));
  const markPaid = (id) => {
    const next = orders.map((order) => order.id === id ? { ...order, status: "Paid", paymentStatus: "Paid", licenseReleased: true } : order);
    setOrders(next);
    localStorage.setItem(ORDER_KEY, JSON.stringify(next));
  };

  return (
    <main>
      <section className="admin-shell">
        <div className="admin-heading"><p className="eyebrow">Patala Pay admin</p><h1>Orders and sales dashboard.</h1><p className="lede">Review license purchases, hardware quotes, order status, and storefront sales totals.</p></div>
        <section className="metric-grid"><article className="metric-card"><span>Total sales</span><strong>{money(orders.reduce((sum, order) => sum + Number(order.total || 0), 0))}</strong></article><article className="metric-card"><span>Orders</span><strong>{orders.length}</strong></article><article className="metric-card"><span>License orders</span><strong>{orders.filter((order) => order.type === "License").length}</strong></article><article className="metric-card"><span>Hardware orders</span><strong>{orders.filter((order) => order.type === "Hardware").length}</strong></article></section>
        <section className="admin-panel">
          <div className="admin-toolbar"><div><p className="eyebrow">Orders</p><h2>Store order list</h2></div><div className="admin-filters"><label>Type<select value={type} onChange={(e) => setType(e.target.value)}><option>All</option><option>License</option><option>Hardware</option></select></label><label>Search<input value={search} onChange={(e) => setSearch(e.target.value)} /></label></div></div>
          <div className="orders-table-wrap"><table><thead><tr><th>Order</th><th>Date</th><th>Type</th><th>Customer</th><th>Item</th><th>Total</th><th>Status</th><th>License Key</th><th>Action</th></tr></thead><tbody>{filtered.map((order) => <tr key={order.id}><td>{order.id}</td><td>{new Date(order.createdAt).toLocaleString("en-ZA")}</td><td>{order.type}</td><td>{order.customer}</td><td>{order.item}</td><td>{money(order.total)}</td><td><span className="status-pill">{order.status}</span></td><td>{order.type === "License" && order.licenseReleased ? order.licenseKey : "Hidden"}</td><td>{order.type === "License" && !order.licenseReleased ? <button className="table-action" type="button" onClick={() => markPaid(order.id)}>Mark Paid</button> : ""}</td></tr>)}</tbody></table></div>
        </section>
      </section>
    </main>
  );
}

export default function App() {
  const [view, setView] = useState("licenses");
  const [session, setSession] = useState(() => readJson(SESSION_KEY, null));
  const [orders, setOrders] = useState(() => readJson(ORDER_KEY, []));
  const [paymentNotice, setPaymentNotice] = useState("");
  const [releasedLicense, setReleasedLicense] = useState(null);
  const [copyNotice, setCopyNotice] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    const orderId = params.get("order");
    if (!payment || !orderId) return;

    const savedOrders = readJson(ORDER_KEY, []);
    const returnedOrder = savedOrders.find((order) => order.id === orderId);
    if (payment === "success" && returnedOrder) {
      const next = savedOrders.map((order) => order.id === orderId ? {
        ...order,
        status: "Paid",
        paymentStatus: "Paid",
        licenseReleased: order.type === "License" ? true : order.licenseReleased,
        paidAt: new Date().toISOString(),
      } : order);
      setOrders(next);
      localStorage.setItem(ORDER_KEY, JSON.stringify(next));
      const paidOrder = next.find((order) => order.id === orderId);
      if (paidOrder?.type === "License" && paidOrder.licenseKey) {
        setReleasedLicense(paidOrder);
        setPaymentNotice(`Payment successful. Your license key is ready.`);
      } else {
        setPaymentNotice(`Payment successful. Order ${orderId} is now marked Paid.`);
      }
      if (session?.role === "admin") setView("admin");
    } else if (payment === "cancelled" && returnedOrder) {
      const next = savedOrders.map((order) => order.id === orderId ? { ...order, status: "Payment cancelled", paymentStatus: "Cancelled" } : order);
      setOrders(next);
      localStorage.setItem(ORDER_KEY, JSON.stringify(next));
      setPaymentNotice(`Payment was cancelled for order ${orderId}.`);
    } else {
      setPaymentNotice(`Payment returned for order ${orderId}, but that order was not found in this browser.`);
    }

    window.history.replaceState({}, document.title, window.location.pathname);
  }, []);

  const addOrder = (order) => {
    const next = [order, ...orders].slice(0, 100);
    setOrders(next);
    localStorage.setItem(ORDER_KEY, JSON.stringify(next));
  };
  const requireLogin = () => {
    if (session) return true;
    setView("login");
    return false;
  };
  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
    setView("licenses");
  };
  return (
    <>
      {view !== "login" ? <BrandNav view={view} setView={setView} session={session} logout={logout} /> : null}
      {paymentNotice ? <div className="payment-status global-payment-status">{paymentNotice}</div> : null}
      {releasedLicense ? (
        <section className="license-release-panel" aria-live="polite">
          <div>
            <p className="eyebrow">License ready</p>
            <h2>{releasedLicense.item}</h2>
            <p>Copy this key and paste it into the expired Patala Pay desktop app to unlock the POS.</p>
          </div>
          <div className="released-license-key">
            <code>{releasedLicense.licenseKey}</code>
            <button
              type="button"
              onClick={() => {
                copyText(releasedLicense.licenseKey);
                setCopyNotice("Copied");
              }}
            >
              Copy Key
            </button>
          </div>
          {copyNotice ? <span className="copy-notice">{copyNotice}</span> : null}
        </section>
      ) : null}
      {view === "login" ? <LoginView setView={setView} setSession={setSession} /> : null}
      {view === "licenses" ? <LicenseView session={session} requireLogin={requireLogin} addOrder={addOrder} /> : null}
      {view === "hardware" ? <HardwareView session={session} requireLogin={requireLogin} addOrder={addOrder} /> : null}
      {view === "admin" ? <AdminView session={session} orders={orders} setOrders={setOrders} setView={setView} setSession={setSession} /> : null}
    </>
  );
}
