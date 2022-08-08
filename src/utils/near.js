import environment from "./config";
import {
  connect,
  Contract,
  keyStores,
  WalletConnection,
  utils,
} from "near-api-js";

const nearEnv = environment("testnet");

export async function initializeContract() {
  const near = await connect(
    Object.assign(
      { deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } },
      nearEnv
    )
  );
  window.walletConnection = new WalletConnection(near);
  window.accountId = window.walletConnection.getAccountId();
  window.contract = new Contract(
    window.walletConnection.account(),
    nearEnv.contractName,
    {
      viewMethods: ["getFundraise", "getFundraises"],
      changeMethods: ["makeDonation", "upvote", "setFundraise"],
    }
  );
}

export async function accountBalance() {
  return utils.format.formatNearAmount(
    (await window.walletConnection.account().getAccountBalance()).total,
    2
  );
}

export async function getAccountId() {
  return window.walletConnection.getAccountId();
}

export function login() {
  window.walletConnection.requestSignIn(nearEnv.contractName);
}

export function logout() {
  window.walletConnection.signOut(nearEnv.contractName);
  window.location.reload();
}
