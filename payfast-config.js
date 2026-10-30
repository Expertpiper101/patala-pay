window.simplePosPayFastConfig = {
  sandbox: true,
  merchantId: "10000100",
  merchantKey: "46f0cd694581a",
  passphrase: "",
  useSignature: false,
  siteBaseUrl: `${window.location.origin}${/^\/patala-pay(?:\/|$)/.test(window.location.pathname) ? "/patala-pay" : ""}`,
};
