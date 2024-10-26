import { useState } from 'react';

function AddContractPage() {
  const [asset, setAsset] = useState('ETH');
  const [amount, setAmount] = useState('');
  const [recipientType, setRecipientType] = useState('customAddress');
  const [customAddresses, setCustomAddresses] = useState(['']);
  const [category, setCategory] = useState('unrestrained');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [wills, setWills] = useState([]); // Array to store generated wills

  const handleAddAddress = () => {
    setCustomAddresses([...customAddresses, '']);
  };

  const handleSubmit = () => {
    const newWill = {
      asset,
      amount,
      recipientType,
      customAddresses: recipientType === 'customAddress' ? customAddresses : [],
      category: recipientType === 'selectCategory' ? category : '',
      startDate,
      endDate,
    };

    // Add new will to list of wills and clear form fields
    setWills([...wills, newWill]);
    setAmount('');
    setCustomAddresses(['']);
    setCategory('unrestrained');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div style={{ backgroundColor: "#e7e7e7", padding: "1em", borderRadius: "5px", margin: "10px" }}>
      <h1 className="title">Legacy Plan</h1>
<br></br>
      <h3 className="subtitle">Select Asset</h3>
      <select 
        style={{ minWidth: "300px", width: "50%", padding: "5px", margin: "5px", borderRadius: "3px" }}
         value={asset} onChange={(e) => setAsset(e.target.value)}>
        <option value="ETH">ETH</option>
        <option value="USDT">USDT</option>
        <option value="USDC">USDC</option>
      </select>
<br></br>
<br></br>
      <h3 className="subtitle">Determine Amount</h3>
      <input
        style={{ minWidth: "300px", width: "50%", padding: "5px", margin: "5px", borderRadius: "3px" }}
        type="number"
        min="0"
        max="100"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter percentage (0-100%)"
      />
<br></br>
<br></br>
      <h3 className="subtitle">Define Recipient</h3>
      <div>
        <input
          type="radio"
          id="customAddress"
          value="customAddress"
          checked={recipientType === 'customAddress'}
          onChange={() => setRecipientType('customAddress')}
        />
        <label htmlFor="customAddress">Add Custom Address</label>
      </div>
      <div>
        <input
          type="radio"
          id="selectCategory"
          value="selectCategory"
          checked={recipientType === 'selectCategory'}
          onChange={() => setRecipientType('selectCategory')}
        />
        <label htmlFor="selectCategory">Select Category</label>
      </div>

      {recipientType === 'customAddress' && (
        <div>
          {customAddresses.map((address, index) => (
            <div key={index}>
              <input
                style={{ minWidth: "300px", width: "50%", padding: "5px", margin: "5px", borderRadius: "3px" }}
                type="text"
                value={address}
                onChange={(e) => {
                  const updatedAddresses = [...customAddresses];
                  updatedAddresses[index] = e.target.value;
                  setCustomAddresses(updatedAddresses);
                }}
              />
            </div>
          ))}
          <button onClick={handleAddAddress}>+ Add Address</button>
        </div>
      )}

      {recipientType === 'selectCategory' && (
        <div>
          <h4>Categories</h4>
          <select 
            style={{ minWidth: "300px", width: "50%", padding: "5px", margin: "5px", borderRadius: "3px" }}
            value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="unrestrained">Unrestrained</option>
            <option value="universities">Universities</option>
            <option value="healthcare">Healthcare</option>
            <option value="food">Food</option>
          </select>
        </div>
      )}
<br></br>
<br></br>
      <h3 className="subtitle">Select Triggering Rules</h3>
<div className="table-responsive">
  <table className="table">
    <tbody>
      <tr>
        <td className="align-top" > {/* Add align-top class to the first cell */}
          <div>
            <h2>Rule #1: </h2>
            <input 
              type="radio" id="preSetTimeframe" value="preSetTimeframe" defaultChecked />
            <label htmlFor="preSetTimeframe">Pre-setted execution timeframe</label>
          </div>
        </td>
        <td className="align-top" style={{ padding: "1em" }}> {/* Add align-top class to the second cell */}
          <div>
            <label htmlFor="startDate">Start Date:</label>
            <input 
                  style={{ minWidth: "300px", width: "50%", padding: "5px", margin: "5px", borderRadius: "3px" }}
                  type="date" id="startDate" />
          </div>
          <div>
            <label htmlFor="endDate">End Date:</label>
            <input 
              style={{ minWidth: "300px", width: "50%", padding: "5px", margin: "5px", borderRadius: "3px" }}
              type="date" id="endDate" />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

      <button onClick={handleSubmit} style={{ marginTop: "20px", padding: "10px", backgroundColor: "#007BFF", color: "#FFF" }}>
        Submit Will
      </button>
<br></br>
<br></br>
<hr></hr>
      <h2 className="subtitle">Generated Wills</h2>
      <ul>
        {wills.map((will, index) => (
          <li key={index} style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ccc" }}>
            <p><strong>Asset:</strong> {will.asset}</p>
            <p><strong>Amount:</strong> {will.amount}%</p>
            <p><strong>Recipient:</strong> {will.recipientType === 'customAddress' ? 'Custom Address' : 'Category'}</p>
            {will.recipientType === 'customAddress' && (
              <p><strong>Addresses:</strong> {will.customAddresses.join(', ')}</p>
            )}
            {will.recipientType === 'selectCategory' && (
              <p><strong>Category:</strong> {will.category}</p>
            )}
            <p><strong>Start Date:</strong> {will.startDate}</p>
            <p><strong>End Date:</strong> {will.endDate}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddContractPage;
