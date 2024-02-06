import React, { useState, useEffect } from 'react';
import './App.css'; // Import your CSS file if you have one
import Web3 from 'web3';
import axios from 'axios';

function App() {
  const [connected, setConnected] = useState(false);
  const [metamaskAddress, setMetamaskAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [tokenBalances, setTokenBalances] = useState([]);
  const [latestTransactions, setLatestTransactions] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [darkTheme, setDarkTheme] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('EN'); 

  const connectToMetamask = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.enable();
        const web3Instance = new Web3(window.ethereum);
        const accounts = await web3Instance.eth.getAccounts();
        setMetamaskAddress(accounts[0]);

        // Get the balance
        const weiBalance = await web3Instance.eth.getBalance(accounts[0]);
        const etherBalance = web3Instance.utils.fromWei(weiBalance, 'ether');
        setBalance(etherBalance);

        // Get token balances
        const tokenBalancesData = await getTokenBalances(web3Instance, accounts[0]);
        setTokenBalances(tokenBalancesData);

        // Get latest transactions
        getLatestTransactions(web3Instance, accounts[0]);

        setWeb3(web3Instance);
        setConnected(true);
      } else {
        console.error('Metamask not detected!');
      }
    } catch (error) {
      console.error('Error connecting to Metamask:', error);
    }
  };

  const getTokenBalances = async (web3, address) => {
    try {
      // Fetch token balances from Etherscan API
      const response = await axios.get(
        `https://api.etherscan.io/api?module=account&action=tokenlist&address=${address}&tag=latest&apikey=IZF6N6FF264DP4IY16IZ8V75ARFJRZFEIS`
      );

      if (response.data.status === '1') {
        const tokens = response.data.result;
        const tokenBalancesData = await Promise.all(tokens.map(async (token) => {
          const tokenBalanceResponse = await axios.get(
            `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${token.contractAddress}&address=${address}&tag=latest&apikey=IZF6N6FF264DP4IY16IZ8V75ARFJRZFEIS`
          );
          return {
            name: token.name,
            symbol: token.symbol,
            balance: tokenBalanceResponse.data.result,
          };
        }));
        return tokenBalancesData;
      } else {
        console.error('Error fetching token balances:', response.data.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching token balances:', error);
      return [];
    }
  };

  const getLatestTransactions = async (web3, address) => {
    try {
      // Fetch latest transactions from Etherscan API
      const response = await axios.get(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&sort=desc&apikey=IZF6N6FF264DP4IY16IZ8V75ARFJRZFEIS`
      );
  
      if (response.data.status === '1') {
        const transactions = response.data.result;
        setLatestTransactions(transactions);
      } else {
        console.error('Error fetching latest transactions:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching latest transactions:', error);
    }
  };

  const disconnectFromMetamask = async () => {
    try {
      // Disconnect from Metamask
      await window.ethereum.request({ method: 'eth_accounts' });
      console.log('Disconnected from Metamask!');
      setMetamaskAddress('');
      setConnected(false);
    } catch (error) {
      console.error('Error disconnecting from Metamask:', error);
    }
  };

  useEffect(() => {
    // Check if Metamask is connected on page load
    if (window.ethereum && window.ethereum.selectedAddress) {
      setMetamaskAddress(window.ethereum.selectedAddress);
      setConnected(true);
    }
  }, []);


  // const windowStyle = {
  //   width: '70vw', // 50% of the viewport width
  //   height: '20vw', // Adjust the height to maintain the square aspect ratio (half of the width)
  //   backgroundColor: 'white', // Set to black
  //   borderRadius: '10px', // Adjust the radius as needed
  //   position: 'absolute',
  //   top: '50%',
  //   left: '50%',
  //   transform: 'translate(-50%, -50%)',
  //   padding: '20px', // Add padding for better spacing
  //   textAlign: 'center', // Center-align text
  // };
  const windowStyle = {
    width: '70vw',
    height: '20vw',
    borderRadius: '10px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    textAlign: 'center',

    backgroundColor: darkTheme ? 'black' : 'white',
    color: darkTheme ? 'white' : 'black',
  };


  const toggleTheme = () => {
    setDarkTheme((prevTheme) => !prevTheme);
  };


  const changeLanguage = () => {
    setCurrentLanguage((prevLanguage) => (prevLanguage === 'EN' ? 'ES' : 'EN'));
  };

  return (
    <div className="app-container">

      <button className={`theme-button ${darkTheme ? 'dark-theme' : 'light-theme'}`} onClick={toggleTheme}>
        {darkTheme ? '🌙' : '☀️'}
      </button>
      <button className={`language-button ${darkTheme ? 'dark-theme' : ''}`} onClick={changeLanguage}>
        {currentLanguage}
      </button>
      {connected ? (
        <div className="connected-container">
          <div className="metamask-info">
            <p>
              Account: {`${metamaskAddress.slice(0, 4)}...${metamaskAddress.slice(-4)}`}
            </p>
          </div>
          <div className="disconnect-container">
            <button
              className="disconnect-button"
              onClick={disconnectFromMetamask}
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <div className="connect-container">
          <button
            className="connect-button"
            onClick={connectToMetamask}
          >
            Connect
          </button>
        </div>
      )}
      {/* <div className="window">
  
      </div> */}
      <div style={windowStyle}>
      <div className="balances-container">
        <div className="token-balances">
        <h2>
          {currentLanguage === 'EN' ? 'Token Balances' : 'Saldos de tokens'}
        </h2>
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Symbol</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ETH</td>
                <td>ETH</td>
                <td>{balance} ETH</td>
              </tr>
              {tokenBalances.map((token, index) => (
                <tr key={index}>
                  <td>{token.name}</td>
                  <td>{token.symbol}</td>
                  <td>{token.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="latest-transactions-container">
          <div className={`latest-transactions-header ${darkTheme ? 'dark-theme' : 'light-theme'}`}>
          
          <h2>
          {currentLanguage === 'EN' ? 'Latest Transactions' : 'Últimas transacciones'}
        </h2>
        </div>
          <div className="latest-transactions-list">
            <ul>
              {latestTransactions.map((transaction, index) => (
                <li key={index}>
                  <p>Hash: {transaction.hash}</p>
                  <p>From: {transaction.from}</p>
                  <p>To: {transaction.to}</p>
                  <p>Value: {web3 ? web3.utils.fromWei(transaction.value, 'ether') : ''} ETH</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default App;
