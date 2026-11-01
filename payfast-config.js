import {POS_PATH} from './src/routes.js';
window.simplePosPayFastConfig = {
  sandbox: true,
  merchantId: "10000100",
  merchantKey: "46f0cd694581a",
  passphrase: "",
  useSignature: false,
  siteBaseUrl: `${window.location.origin}${POS_PATH}`,
};
