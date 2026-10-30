const topics = new Set(["Packages and pricing", "Founders Package", "Hardware", "Setup and support", "Other"]);

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }
  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: "Invalid enquiry." });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return res.status(400).json({ error: "Invalid enquiry." });
  if (body.website) return res.status(400).json({ error: "Unable to accept this enquiry." });
  const { name, email, phone = "", topic, message } = body;
  if (typeof name !== "string" || !name.trim() || name.length > 100 || /[\r\n]/.test(name) ||
      typeof email !== "string" || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof phone !== "string" || phone.length > 40 || !topics.has(topic) ||
      typeof message !== "string" || message.trim().length < 10 || message.length > 5000) {
    return res.status(400).json({ error: "Please check your name, email address and message." });
  }
  if (!process.env.RESEND_API_KEY) {
    return res.status(503).json({ error: "Online enquiries are not available yet. Please email info@primon.co.za or call 072 775 2083." });
  }
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: AbortSignal.timeout(10000),
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.ENQUIRY_FROM_EMAIL || "Patala Pay <info@primon.co.za>",
        to: ["info@primon.co.za"],
        reply_to: email.trim(),
        subject: `Patala Pay enquiry: ${topic}`,
        text: `New Patala Pay enquiry\n\nName: ${name.trim()}\nEmail: ${email.trim()}\nCell: ${phone.trim() || "Not provided"}\nTopic: ${topic}\n\n${message.trim()}`,
      }),
    });
    if (!response.ok) return res.status(502).json({ error: "Your enquiry could not be sent. Please email info@primon.co.za or call 072 775 2083." });
    const result = await response.json();
    if (!result.id) throw new Error("Email was not accepted");
    return res.status(200).json({ success: true });
  } catch {
    return res.status(502).json({ error: "Your enquiry could not be sent. Please try again or contact info@primon.co.za." });
  }
}
