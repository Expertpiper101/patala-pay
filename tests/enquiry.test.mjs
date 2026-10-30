import test from "node:test";
import assert from "node:assert/strict";
import handler from "../api/enquiry.js";

const valid = { name: "Test Customer", email: "customer@example.com", phone: "072 000 0000", topic: "Founders Package", message: "Please tell me about the Founders Package." };
async function request(body, method = "POST") {
  const result = { headers: {}, setHeader(key, value) { this.headers[key] = value; }, status(code) { this.code = code; return this; }, json(data) { this.data = data; } };
  await handler({ method, body }, result);
  return result;
}
test("enquiry validation, delivery and failure handling", async () => {
  const originalKey = process.env.RESEND_API_KEY;
  const originalFetch = globalThis.fetch;
  try {
    delete process.env.RESEND_API_KEY;
    assert.equal((await request(valid, "GET")).code, 405);
    for (const body of [null, "{", { ...valid, email: "invalid" }, { ...valid, message: "short" }, { ...valid, website: "spam.example" }, { ...valid, topic: "unexpected" }]) {
      assert.equal((await request(body)).code, 400);
    }
    assert.equal((await request(valid)).code, 503);
    process.env.RESEND_API_KEY = "test-key";
    globalThis.fetch = async (url, options) => {
      assert.equal(url, "https://api.resend.com/emails");
      const sent = JSON.parse(options.body);
      assert.deepEqual(sent.to, ["info@primon.co.za"]);
      assert.equal(sent.reply_to, valid.email);
      assert.ok(sent.text.includes(valid.message));
      assert.equal(sent.html, undefined);
      return { ok: true, json: async () => ({ id: "test-email-id" }) };
    };
    assert.equal((await request(valid)).code, 200);
    globalThis.fetch = async () => ({ ok: false });
    assert.equal((await request(valid)).code, 502);
    globalThis.fetch = async () => { throw new Error("Network unavailable"); };
    assert.equal((await request(valid)).code, 502);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = originalKey;
  }
});
