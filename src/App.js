import React, { useEffect, useCallback, useState } from "react";
import { Button, Container, Nav } from "react-bootstrap";
import { Toaster } from "react-hot-toast";
import { login, logout as destroy, accountBalance } from "./utils/near";
import Wallet from "./components/Wallet";
import Fundraises from "./components/forum/Fundraises";
import "./App.css";

const App = function AppWrapper() {
  const account = window.walletConnection.account();
  const [balance, setBalance] = useState("0");

  const getBalance = useCallback(async () => {
    if (account.accountId) {
      setBalance(await accountBalance());
    }
  });

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  return (
    <>
      <Container fluid='md'>
        <Nav className='justify-content-end pt-3 pb-5'>
          <Nav.Item>
            {account.accountId ? (
              <Wallet
                address={account.accountId}
                amount={balance}
                symbol='NEAR'
                destroy={destroy}
              />
            ) : (
              <Button onClick={login} variant='dark' className='px-3 mt-3'>
                Connect Wallet
              </Button>
            )}
          </Nav.Item>
        </Nav>
        <main>
          <Fundraises account={account.accountId} />
        </main>
      </Container>
      <Toaster />
    </>
  );
};

export default App;
