import { v4 as uuid4 } from "uuid";
import { utils } from "near-api-js";

const GAS = 100000000000000;

export function createProduct(product) {
  product.id = uuid4();
  product.price = utils.format.parseNearAmount(product.price + "");
  return window.contract.setProduct({ product });
}

export function getProducts() {
  return window.contract.getProducts();
}

export async function buyProduct({ id, price }) {
  await window.contract.buyProduct({ productId: id }, GAS, price);
}
