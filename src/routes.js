export const COMPANY_PATH = '/patala-pay';
export const POS_PATH = '/patala-pay/PointofSale';
export function isPointOfSalePath(pathname) {
  return /^\/(?:patala-pay\/)?pointofsale(?:\/|$)/i.test(pathname);
}
