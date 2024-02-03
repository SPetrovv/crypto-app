import React, { useState, useEffect } from 'react';
import './App.css'; // Import your CSS file if you have one

function App() {
  const [connected, setConnected] = useState(false);
  const [metamaskAddress, setMetamaskAddress] = useState('');

  const connectToMetamask = async () => {
    try {
      // Check if Metamask is installed and isMetaMask is true
      if (window.ethereum && window.ethereum.isMetaMask) {
        // Request account access if needed using ethereum.enable()
        const accounts = await window.ethereum.enable();
        const address = accounts[0];
        console.log('Connected to Metamask! Address:', address);
        setMetamaskAddress(address);
        setConnected(true);
      } else {
        console.error('Metamask not found.');
      }
    } catch (error) {
      console.error('Error connecting to Metamask:', error);
      setConnected(false);
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

  return (
    <div style={{ backgroundColor: 'black', height: '100vh', color: 'white', position: 'relative' }}>
      {connected ? (
        <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center' }}>
          <p style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'green', marginRight: '10px' }}>
            Account: {`${metamaskAddress.slice(0, 4)}...${metamaskAddress.slice(-4)}`}
          </p>
          <button
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '16px',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              marginLeft: '10px', // Add marginLeft to align the Disconnect button
            }}
            onClick={disconnectFromMetamask}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '16px',
          }}
          onClick={connectToMetamask}
        >
          Connect
        </button>
      )}
      {/* Your content goes here */}
    </div>
  );
}

export default App;
