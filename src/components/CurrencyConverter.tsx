import React, { useState, useEffect, ChangeEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './CurrencyConverter.css';

// Define interface for history entries
interface ConversionHistoryEntry {
  id: string;
  realRate: string;
  usedRate: string;
  inputAmount: string;
  inputCurrency: string;
  outputAmount: string;
  outputCurrency: string;
  timestamp: string;
}

const CurrencyConverter: React.FC = () => {
  // State variables with type definitions
  const [exchangeRate, setExchangeRate] = useState<number>(1.1);
  const [inputValue, setInputValue] = useState<string>('');
  const [outputValue, setOutputValue] = useState<string>('');
  const [isEuroToDollar, setIsEuroToDollar] = useState<boolean>(true);
  const [manualRate, setManualRate] = useState<string>('');
  const [isManualRateActive, setIsManualRateActive] = useState<boolean>(false);
  const [conversionHistory, setConversionHistory] = useState<ConversionHistoryEntry[]>([]);
  const [warningMessage, setWarningMessage] = useState<string>('');

  // Function to update the exchange rate randomly every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Generate random value between -0.05 and 0.05
      const randomChange = (Math.random() * 0.1) - 0.05;
      const newRate = parseFloat((exchangeRate + randomChange).toFixed(4));
      setExchangeRate(newRate);
      
      // Check if manual rate should be deactivated (difference > 2%)
      if (isManualRateActive && manualRate) {
        const manualRateValue = parseFloat(manualRate);
        const percentageDifference = Math.abs((newRate - manualRateValue) / manualRateValue * 100);
        
        if (percentageDifference > 2) {
          setIsManualRateActive(false);
          setWarningMessage('Manual rate was deactivated due to a 2% difference with real rate');
          setTimeout(() => setWarningMessage(''), 5000);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [exchangeRate, isManualRateActive, manualRate]);

  // Effect to update conversion when any relevant values change
  useEffect(() => {
    updateConversion();
  }, [exchangeRate, inputValue, isEuroToDollar, isManualRateActive]);

  // Function to handle currency type toggle
  const handleToggle = (): void => {
    // Save current output value
    const previousOutput = outputValue;
    
    // Switch conversion direction
    setIsEuroToDollar(!isEuroToDollar);
    
    // Set input to previous output (keeping value continuity)
    if (previousOutput) {
      setInputValue(previousOutput);
    }
  };

  // Function to handle manual rate changes
  const handleManualRateChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setManualRate(e.target.value);
  };

  // Function to apply manual rate
  const applyManualRate = (): void => {
    if (manualRate && !isNaN(parseFloat(manualRate)) && parseFloat(manualRate) > 0) {
      setIsManualRateActive(true);
      updateConversion();
    }
  };

  // Function to handle input value changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  // Main function to update the conversion
  const updateConversion = (): void => {
    if (!inputValue || isNaN(parseFloat(inputValue))) {
      setOutputValue('');
      return;
    }

    const input = parseFloat(inputValue);
    const rate = isManualRateActive && manualRate ? parseFloat(manualRate) : exchangeRate;
    let result: string;

    if (isEuroToDollar) {
      // EUR to USD
      result = (input * rate).toFixed(2);
    } else {
      // USD to EUR
      result = (input / rate).toFixed(2);
    }

    setOutputValue(result);

    // Only add to history when we have a valid conversion with non-empty input
    if (input > 0 && result) {
      addToHistory(input, parseFloat(result), rate);
    }
  };

  // Function to add a conversion to history
  const addToHistory = (inputAmount: number, outputAmount: number, usedRate: number): void => {
    const newEntry: ConversionHistoryEntry = {
      id: uuidv4(),
      realRate: exchangeRate.toFixed(4),
      usedRate: usedRate.toFixed(4),
      inputAmount: inputAmount.toFixed(2),
      inputCurrency: isEuroToDollar ? 'EUR' : 'USD',
      outputAmount: outputAmount.toFixed(2),
      outputCurrency: isEuroToDollar ? 'USD' : 'EUR',
      timestamp: new Date().toLocaleTimeString()
    };

    // Add new entry and keep only the last 5 entries
    setConversionHistory(prevHistory => [newEntry, ...prevHistory.slice(0, 4)]);
  };

  return (
    <div className="converter-container">
      <div className="converter-card">
        <h1 className="converter-title">Currency Converter</h1>
        
        {/* Exchange Rate Display */}
        <div className="card-section">
          <h2 className="section-title">Current Exchange Rate</h2>
          <div className="rate-display">
            <span>1 EUR = </span>
            <span className="rate-value">
              {isManualRateActive && manualRate ? parseFloat(manualRate).toFixed(4) : exchangeRate.toFixed(4)} USD
            </span>
            {isManualRateActive && <span className="manual-badge">Manual</span>}
          </div>
        </div>

        {/* Warning Message */}
        {warningMessage && (
          <div className="warning-message">
            <svg className="warning-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {warningMessage}
          </div>
        )}
        
        {/* Manual Rate Setting */}
        <div className="card-section">
          <h2 className="section-title">Manual Rate</h2>
          <div className="input-group">
            <input
              type="number"
              value={manualRate}
              onChange={handleManualRateChange}
              placeholder="Enter custom rate"
              className="text-input"
              step="0.0001"
              min="0.0001"
            />
            <button
              onClick={applyManualRate}
              className="primary-button"
            >
              Apply
            </button>
          </div>
          {isManualRateActive && (
            <button
              onClick={() => setIsManualRateActive(false)}
              className="reset-button"
            >
              Reset to real rate
            </button>
          )}
        </div>
        
        {/* Currency Toggle */}
        <div className="card-section">
          <div className="toggle-container">
            <span className={`toggle-label ${isEuroToDollar ? 'active' : ''}`}>EUR → USD</span>
            <button 
              onClick={handleToggle}
              className="toggle-button"
            >
              Switch
            </button>
            <span className={`toggle-label ${!isEuroToDollar ? 'active' : ''}`}>USD → EUR</span>
          </div>
        </div>
        
        {/* Conversion Form */}
        <div className="card-section">
          <h2 className="section-title">Convert Currency</h2>
          <div className="conversion-form">
            <div className="form-group">
              <label className="input-label">
                {isEuroToDollar ? 'Amount (EUR)' : 'Amount (USD)'}
              </label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={inputValue}
                  onChange={handleInputChange}
                  className="text-input"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
                <span className="currency-indicator">{isEuroToDollar ? 'EUR' : 'USD'}</span>
              </div>
            </div>
            
            <div className="form-group">
              <label className="input-label">
                {isEuroToDollar ? 'Amount (USD)' : 'Amount (EUR)'}
              </label>
              <div className="input-with-currency">
                <input
                  type="text"
                  value={outputValue}
                  className="text-input readonly"
                  readOnly
                />
                <span className="currency-indicator">{isEuroToDollar ? 'USD' : 'EUR'}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Conversion History */}
        <div className="card-section">
          <h2 className="section-title">Conversion History</h2>
          {conversionHistory.length > 0 ? (
            <div className="history-table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Real Rate</th>
                    <th>Used Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {conversionHistory.map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.timestamp}</td>
                      <td>{entry.inputAmount} {entry.inputCurrency}</td>
                      <td>{entry.outputAmount} {entry.outputCurrency}</td>
                      <td>{entry.realRate}</td>
                      <td>{entry.usedRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-history">No conversion history yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;