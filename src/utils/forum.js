import { v4 as uuid4 } from "uuid";
import { utils } from "near-api-js";

const GAS = 100000000000000;

export function createFundraise(fundraise) {
  fundraise.id = uuid4();
  return window.contract.setFundraise({ fundraise });
}

export function getFundraises() {
  return window.contract.getFundraises();
}

export async function makeDonation({ id, account, amount }) {
  const donation = {
    wallet: account,
    amount,
  };
  await window.contract.makeDonation(
    { fundraiserId: id, donation },
    GAS,
    utils.format.parseNearAmount(amount)
  );
}

export async function doUpvote({ id, account }) {
  await window.contract.upvote({ fundraiserId: id, wallet: account }, GAS);
}
