function payFastEndpoint() {
  return window.simplePosPayFastConfig.sandbox
    ? "https://sandbox.payfast.co.za/eng/process"
    : "https://www.payfast.co.za/eng/process";
}

function payFastReturnUrl(page) {
  const configuredBase = String(window.simplePosPayFastConfig.siteBaseUrl || "").replace(/\/$/, "");
  return `${configuredBase}/${page}`;
}

function payFastEncode(value) {
  return encodeURIComponent(String(value).trim()).replace(/%20/g, "+");
}

function md5(input) {
  function rotateLeft(value, amount) {
    return (value << amount) | (value >>> (32 - amount));
  }
  function addUnsigned(a, b) {
    const a4 = a & 0x40000000;
    const b4 = b & 0x40000000;
    const a8 = a & 0x80000000;
    const b8 = b & 0x80000000;
    const result = (a & 0x3fffffff) + (b & 0x3fffffff);
    if (a4 & b4) return result ^ 0x80000000 ^ a8 ^ b8;
    if (a4 | b4) return result & 0x40000000 ? result ^ 0xc0000000 ^ a8 ^ b8 : result ^ 0x40000000 ^ a8 ^ b8;
    return result ^ a8 ^ b8;
  }
  function f(x, y, z) { return (x & y) | (~x & z); }
  function g(x, y, z) { return (x & z) | (y & ~z); }
  function h(x, y, z) { return x ^ y ^ z; }
  function i(x, y, z) { return y ^ (x | ~z); }
  function transform(fn, a, b, c, d, x, s, ac) {
    return addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, fn(b, c, d)), addUnsigned(x, ac)), s), b);
  }
  function utf8(value) {
    return unescape(encodeURIComponent(value));
  }
  function words(value) {
    const length = value.length;
    const wordCount = (((length + 8) - ((length + 8) % 64)) / 64 + 1) * 16;
    const output = Array(wordCount - 1).fill(0);
    for (let index = 0; index < length; index += 1) {
      output[index >> 2] |= value.charCodeAt(index) << ((index % 4) * 8);
    }
    output[length >> 2] |= 0x80 << ((length % 4) * 8);
    output[wordCount - 2] = length << 3;
    output[wordCount - 1] = length >>> 29;
    return output;
  }
  function hex(value) {
    let output = "";
    for (let index = 0; index <= 3; index += 1) {
      output += (`0${((value >>> (index * 8)) & 255).toString(16)}`).slice(-2);
    }
    return output;
  }

  const x = words(utf8(input));
  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  for (let k = 0; k < x.length; k += 16) {
    const aa = a;
    const bb = b;
    const cc = c;
    const dd = d;
    a = transform(f, a, b, c, d, x[k], 7, 0xd76aa478);
    d = transform(f, d, a, b, c, x[k + 1], 12, 0xe8c7b756);
    c = transform(f, c, d, a, b, x[k + 2], 17, 0x242070db);
    b = transform(f, b, c, d, a, x[k + 3], 22, 0xc1bdceee);
    a = transform(f, a, b, c, d, x[k + 4], 7, 0xf57c0faf);
    d = transform(f, d, a, b, c, x[k + 5], 12, 0x4787c62a);
    c = transform(f, c, d, a, b, x[k + 6], 17, 0xa8304613);
    b = transform(f, b, c, d, a, x[k + 7], 22, 0xfd469501);
    a = transform(f, a, b, c, d, x[k + 8], 7, 0x698098d8);
    d = transform(f, d, a, b, c, x[k + 9], 12, 0x8b44f7af);
    c = transform(f, c, d, a, b, x[k + 10], 17, 0xffff5bb1);
    b = transform(f, b, c, d, a, x[k + 11], 22, 0x895cd7be);
    a = transform(f, a, b, c, d, x[k + 12], 7, 0x6b901122);
    d = transform(f, d, a, b, c, x[k + 13], 12, 0xfd987193);
    c = transform(f, c, d, a, b, x[k + 14], 17, 0xa679438e);
    b = transform(f, b, c, d, a, x[k + 15], 22, 0x49b40821);
    a = transform(g, a, b, c, d, x[k + 1], 5, 0xf61e2562);
    d = transform(g, d, a, b, c, x[k + 6], 9, 0xc040b340);
    c = transform(g, c, d, a, b, x[k + 11], 14, 0x265e5a51);
    b = transform(g, b, c, d, a, x[k], 20, 0xe9b6c7aa);
    a = transform(g, a, b, c, d, x[k + 5], 5, 0xd62f105d);
    d = transform(g, d, a, b, c, x[k + 10], 9, 0x02441453);
    c = transform(g, c, d, a, b, x[k + 15], 14, 0xd8a1e681);
    b = transform(g, b, c, d, a, x[k + 4], 20, 0xe7d3fbc8);
    a = transform(g, a, b, c, d, x[k + 9], 5, 0x21e1cde6);
    d = transform(g, d, a, b, c, x[k + 14], 9, 0xc33707d6);
    c = transform(g, c, d, a, b, x[k + 3], 14, 0xf4d50d87);
    b = transform(g, b, c, d, a, x[k + 8], 20, 0x455a14ed);
    a = transform(g, a, b, c, d, x[k + 13], 5, 0xa9e3e905);
    d = transform(g, d, a, b, c, x[k + 2], 9, 0xfcefa3f8);
    c = transform(g, c, d, a, b, x[k + 7], 14, 0x676f02d9);
    b = transform(g, b, c, d, a, x[k + 12], 20, 0x8d2a4c8a);
    a = transform(h, a, b, c, d, x[k + 5], 4, 0xfffa3942);
    d = transform(h, d, a, b, c, x[k + 8], 11, 0x8771f681);
    c = transform(h, c, d, a, b, x[k + 11], 16, 0x6d9d6122);
    b = transform(h, b, c, d, a, x[k + 14], 23, 0xfde5380c);
    a = transform(h, a, b, c, d, x[k + 1], 4, 0xa4beea44);
    d = transform(h, d, a, b, c, x[k + 4], 11, 0x4bdecfa9);
    c = transform(h, c, d, a, b, x[k + 7], 16, 0xf6bb4b60);
    b = transform(h, b, c, d, a, x[k + 10], 23, 0xbebfbc70);
    a = transform(h, a, b, c, d, x[k + 13], 4, 0x289b7ec6);
    d = transform(h, d, a, b, c, x[k], 11, 0xeaa127fa);
    c = transform(h, c, d, a, b, x[k + 3], 16, 0xd4ef3085);
    b = transform(h, b, c, d, a, x[k + 6], 23, 0x04881d05);
    a = transform(h, a, b, c, d, x[k + 9], 4, 0xd9d4d039);
    d = transform(h, d, a, b, c, x[k + 12], 11, 0xe6db99e5);
    c = transform(h, c, d, a, b, x[k + 15], 16, 0x1fa27cf8);
    b = transform(h, b, c, d, a, x[k + 2], 23, 0xc4ac5665);
    a = transform(i, a, b, c, d, x[k], 6, 0xf4292244);
    d = transform(i, d, a, b, c, x[k + 7], 10, 0x432aff97);
    c = transform(i, c, d, a, b, x[k + 14], 15, 0xab9423a7);
    b = transform(i, b, c, d, a, x[k + 5], 21, 0xfc93a039);
    a = transform(i, a, b, c, d, x[k + 12], 6, 0x655b59c3);
    d = transform(i, d, a, b, c, x[k + 3], 10, 0x8f0ccc92);
    c = transform(i, c, d, a, b, x[k + 10], 15, 0xffeff47d);
    b = transform(i, b, c, d, a, x[k + 1], 21, 0x85845dd1);
    a = transform(i, a, b, c, d, x[k + 8], 6, 0x6fa87e4f);
    d = transform(i, d, a, b, c, x[k + 15], 10, 0xfe2ce6e0);
    c = transform(i, c, d, a, b, x[k + 6], 15, 0xa3014314);
    b = transform(i, b, c, d, a, x[k + 13], 21, 0x4e0811a1);
    a = transform(i, a, b, c, d, x[k + 4], 6, 0xf7537e82);
    d = transform(i, d, a, b, c, x[k + 11], 10, 0xbd3af235);
    c = transform(i, c, d, a, b, x[k + 2], 15, 0x2ad7d2bb);
    b = transform(i, b, c, d, a, x[k + 9], 21, 0xeb86d391);
    a = addUnsigned(a, aa);
    b = addUnsigned(b, bb);
    c = addUnsigned(c, cc);
    d = addUnsigned(d, dd);
  }
  return `${hex(a)}${hex(b)}${hex(c)}${hex(d)}`.toLowerCase();
}

function payFastSignature(fields) {
  const signatureParts = Object.entries(fields)
    .filter(([key, value]) => key !== "signature" && value !== undefined && value !== null && String(value).trim() !== "")
    .map(([key, value]) => `${key}=${payFastEncode(value)}`);

  if (window.simplePosPayFastConfig.passphrase) {
    signatureParts.push(`passphrase=${payFastEncode(window.simplePosPayFastConfig.passphrase)}`);
  }
  return md5(signatureParts.join("&"));
}

function submitPayFastPayment(order) {
  const config = window.simplePosPayFastConfig;
  const fields = {
    merchant_id: config.merchantId,
    merchant_key: config.merchantKey,
    return_url: payFastReturnUrl(`payment-success.html?order=${encodeURIComponent(order.id)}`),
    cancel_url: payFastReturnUrl(`payment-cancelled.html?order=${encodeURIComponent(order.id)}`),
    notify_url: payFastReturnUrl("payfast-notify"),
    m_payment_id: order.id,
    amount: Number(order.total || 0).toFixed(2),
    item_name: order.type === "License" ? `Simple Python POS ${order.item}` : `POS Hardware ${order.id}`,
    item_description: order.item,
    custom_str1: order.type,
    custom_str2: order.customer,
  };
  fields.signature = payFastSignature(fields);

  const form = document.createElement("form");
  form.method = "post";
  form.action = payFastEndpoint();
  form.hidden = true;

  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}

window.simplePosPayFast = {
  submitPayment: submitPayFastPayment,
};
