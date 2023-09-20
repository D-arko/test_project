import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';

function HomePage() {
  // declare variables
  const [symbols, setSymbols] = useState([]);
  const [lastPrice, setLastPrice] = useState([]);
  const [dailyHigh, setDailyHigh] = useState([]);
  const [dailyLow, setDailyLow] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [favoriteSymbols, setFavoriteSymbols] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    // get first 5 symbols
    async function fetchSymbols() {
      try {
        const response = await axios.get('/v1/symbols');
        const symbolsData = response.data.slice(0, 5);
        setSymbols(symbolsData);
        fetchData(symbolsData);
      } catch (error) {
        console.log(error);
      }
    }

    // fetch data for symbols
    async function fetchData(symbolsData) {
      try {
        const lastPrices = [];
        const highs = [];
        const lows = [];
    
        for (const symbol of symbolsData) {
          const response = await axios.get(`/v1/pubticker/${symbol}`);
          const { last_price, high, low } = response.data;
    
          lastPrices.push(last_price);
          highs.push(high);
          lows.push(low);
        }
    
        setLastPrice(lastPrices);
        setDailyHigh(highs);
        setDailyLow(lows);
      } catch (error) {
        console.log(error);
      }
    }
    
    fetchSymbols();
  }, []);

  const handleSymbolClick = (symbol) => {
    setSelectedSymbol(symbol);
  };

  const addToFavorites = (symbol) => {
    if (!favoriteSymbols.includes(symbol)) {
      setFavoriteSymbols([...favoriteSymbols, symbol]);
    }
  };
  
  const removeFromFavorites = (symbol) => {
    const updatedFavorites = favoriteSymbols.filter((favSymbol) => favSymbol !== symbol);
    setFavoriteSymbols(updatedFavorites);
  };
  
  const handleLoginClick = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <div>
      <h1>Trading Pairs Data</h1>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Last Price</th>
            <th>Daily High</th>
            <th>Daily Low</th>
          </tr>
        </thead>
        <tbody>
          {symbols.map((symbol, index) => (
            <tr key={symbol}>
              <td>
                <a onClick={() => handleSymbolClick(symbol)}>{symbol}</a>
              </td>
              <td>{lastPrice[index]}</td>
              <td>{dailyHigh[index]}</td>
              <td>{dailyLow[index]}</td>
            </tr>
          ))}
        </tbody>
      </table>
          
      {selectedSymbol && (
        <table>
          <caption style={{'fontSize': '1.5rem', 'color': 'lightcoral'}}>Details</caption>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Last Price</th>
              <th>Daily High</th>
              <th>Daily Low</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{selectedSymbol}</td>
              <td>{lastPrice[symbols.indexOf(selectedSymbol)]}</td>
              <td>{dailyHigh[symbols.indexOf(selectedSymbol)]}</td>
              <td>{dailyLow[symbols.indexOf(selectedSymbol)]}</td>
              <td>
                {favoriteSymbols.includes(selectedSymbol) ? (
                  <button onClick={() => removeFromFavorites(selectedSymbol)}>Remove from favorites</button>
                ) : (
                  <button onClick={() => addToFavorites(selectedSymbol)}>Add to favorites</button>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    {!isLoggedIn ? (
        <button onClick={handleLoginClick}>Login</button>
      ) : (
        <div>
           <table>
           <caption style={{'fontSize': '1.5rem', 'color': 'lightcoral'}}>Favorites</caption>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Last Price</th>
                <th>Daily High</th>
                <th>Daily Low</th>
              </tr>
            </thead>
            <tbody>
              {favoriteSymbols.map((symbol) => (
                <tr key={symbol}>
                  <td>{symbol}</td>
                  <td>{lastPrice[symbols.indexOf(symbol)]}</td>
                  <td>{dailyHigh[symbols.indexOf(symbol)]}</td>
                  <td>{dailyLow[symbols.indexOf(symbol)]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HomePage;
