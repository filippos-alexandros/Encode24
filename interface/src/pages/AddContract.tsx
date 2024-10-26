import { useState } from "react";
import { Wallet, Transaction, BaseProvider } from '@coinbase/onchainkit'; // Correct import

function AddContractPage() {
  const [asset, setAsset] = useState("ETH");
  const [percentage, setPercentage] = useState("");
  const [recipientType, setRecipientType] = useState("customAddress");
  const [customAddresses, setCustomAddresses] = useState([""]);
  const [category, setCategory] = useState("unrestrained");
  const [startDateIncluded, setStartDateIncluded] = useState(false);
  const [endDateIncluded, setEndDateIncluded] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [wills, setWills] = useState([]);
  const [warning, setWarning] = useState("");

  // State for total amounts and percentages
  const [totalAmounts, setTotalAmounts] = useState({
    ETH: { amount: 100, percentage: 100, basePercentage: 100 },
    USDT: { amount: 200, percentage: 100, basePercentage: 100 },
    USDC: { amount: 150, percentage: 100, basePercentage: 100 },
  });

  const provider =  BaseProvider// Initialize your provider

  
  const handleSubmit = async () => {
    const newWill = {
      asset,
      percentage,
      recipientType,
      customAddresses: recipientType === "customAddress" ? customAddresses : [],
      category: recipientType === "selectCategory" ? category : "",
      startDate: startDateIncluded ? startDate : null,
      endDate: endDateIncluded ? endDate : null,
      amount: (totalAmounts[asset].amount * percentage) / 100,
    };

    setWills([...wills, newWill]);

    setTotalAmounts((prevAmounts) => {
      const updatedAmount = prevAmounts[asset].amount - (prevAmounts[asset].amount * percentage) / 100;
      const updatedPercentage = prevAmounts[asset].percentage - (prevAmounts[asset].basePercentage * percentage) / 100;
      return {
        ...prevAmounts,
        [asset]: {
          amount: updatedAmount,
          percentage: updatedPercentage,
          basePercentage: prevAmounts[asset].basePercentage,
        },
      };
    });

  // --- SUBMIT TRANSACTION - STARTS -------------

    // OnchainKit Transaction component usage
    try {
      const tx = await Transaction.create(provider, {
        // to: 'YOUR_CONTRACT_ADDRESS', // Replace with your actual contract address
        // data: 'YOUR_CONTRACT_ABI_ENCODED_FUNCTION_CALL', // Encode the function call with your contract ABI
        // value: 'AMOUNT_IN_WEI', // If you need to send ETH with the transaction
      });

      // This will prompt the user to confirm the transaction in their wallet
      const txResponse = await tx.send(); 

      console.log("Transaction response:", txResponse);

      // ... your logic to update state or perform other actions after successful transaction ...

    } catch (error) {
      console.error("Transaction error:", error);
      // Handle the error appropriately (e.g., display an error message to the user)
    }

  // --- SUBMIT TRANSACTION - ENDS ---------------

    setPercentage("");
    setWarning("");
    setCustomAddresses([""]);
    setCategory("unrestrained");
    setStartDate("");
    setEndDate("");
  };

  const handlePercentageChange = (e) => {
    const enteredPercentage = parseFloat(e.target.value);
    const remainingPercentage = totalAmounts[asset].percentage;

    if (enteredPercentage > remainingPercentage) {
      setWarning(`Cannot exceed ${remainingPercentage}% of ${asset} remaining.`);
    } else {
      setWarning("");
    }

    setPercentage(e.target.value);
  };

  const handleAddAddress = () => {
    setCustomAddresses([...customAddresses, ""]);
  };

  return (
    <div
      style={{
        backgroundColor: "",
        padding: "1em",
        borderRadius: "5px",
        margin: "10px",
      }}
    >
      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <td className="align-top" style={{ width: "70%" }}>
              <h1 className="title">Legacy Plan</h1>
              <br />
              <h3 className="subtitle">Select Asset</h3>
              <select
                style={{
                  border: "1px solid #d9d7d7",
                  minWidth: "300px",
                  width: "50%",
                  padding: "5px",
                  margin: "5px",
                  borderRadius: "3px",
                }}
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
              >
                <option value="ETH">ETH</option>
                <option value="USDT">USDT</option>
                <option value="USDC">USDC</option>
              </select>
              <br />
              <br />
              <h3 className="subtitle">Determine Percentage</h3>
              <input
                style={{
                  border: "1px solid #d9d7d7",
                  minWidth: "300px",
                  width: "50%",
                  padding: "5px",
                  margin: "5px",
                  borderRadius: "3px",
                }}
                type="number"
                min="0"
                max="100"
                value={percentage}
                onChange={handlePercentageChange}
                placeholder={`Enter percentage (max ${totalAmounts[asset].percentage}%)`}
              />
              {warning && <p style={{ color: "red" }}>{warning}</p>}
              <br />
              <br />
              <h3 className="subtitle">Define Recipient</h3>
              <div>
                <input
                  type="radio"
                  id="customAddress"
                  value="customAddress"
                  checked={recipientType === "customAddress"}
                  onChange={() => setRecipientType("customAddress")}
                />
                <label htmlFor="customAddress">Add Custom Address</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="selectCategory"
                  value="selectCategory"
                  checked={recipientType === "selectCategory"}
                  onChange={() => setRecipientType("selectCategory")}
                />
                <label htmlFor="selectCategory">Select Category</label>
              </div>

              {recipientType === "customAddress" && (
                <div>
                  {customAddresses.map((address, index) => (
                    <div key={index}>
                      <input
                        style={{
                          border: "1px solid #d9d7d7",
                          minWidth: "300px",
                          width: "50%",
                          padding: "5px",
                          margin: "5px",
                          borderRadius: "3px",
                        }}
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

              {recipientType === "selectCategory" && (
                <div>
                  <h4>Categories</h4>
                  <select
                    style={{
                      border: "1px solid #d9d7d7",
                      minWidth: "300px",
                      width: "50%",
                      padding: "5px",
                      margin: "5px",
                      borderRadius: "3px",
                    }}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    
                    <option value="universities">Universities</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="food">Food</option>
                  </select>
                </div>
              )}
              <br />
              <br />
              <h3 className="subtitle">Select Triggering Rules</h3>
              <p>Rule #1: Asset reallocation will execute only after owner passes</p>
              <br></br>
              <p>Rule #2: Add pre-settled asset reallocation execution timeframe (optional) </p>

              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={startDateIncluded}
                    onChange={() => setStartDateIncluded(!startDateIncluded)}
                  />
                   Include Start Date
                </label>
                <br />
                {startDateIncluded && (
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{
                      border: "1px solid #d9d7d7",
                      minWidth: "300px",
                      width: "50%",
                      padding: "5px",
                      margin: "5px",
                      borderRadius: "3px",
                    }}
                  />
                )}
                <br />
                <label>
                  <input
                    type="checkbox"
                    checked={endDateIncluded}
                    onChange={() => setEndDateIncluded(!endDateIncluded)}
                  />
                  Include End Date
                </label>
                <br />
                {endDateIncluded && (
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{
                      border: "1px solid #d9d7d7",
                      minWidth: "300px",
                      width: "50%",
                      padding: "5px",
                      margin: "5px",
                      borderRadius: "3px",
                    }}
                  />
                )}
              </div>
              <button
                onClick={handleSubmit}
                style={{
                  marginTop: "20px",
                  padding: "10px",
                  backgroundColor: "#007BFF",
                  color: "#FFF",
                  borderRadius: "5px"
                }}
                disabled={Boolean(warning)}
              >
                Submit Intention
              </button>


              <br />
              <br />
              <hr />
              <h2 className="subtitle">Generated Intentions</h2>
              <ul>
                {wills.map((will, index) => (
                  <li
                    key={index}
                    style={{
                      marginBottom: "10px",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "3px",
                    }}
                  >
                    <p>
                      <strong>Asset:</strong> {will.asset}
                    </p>
                    <p>
                      <strong>Percentage:</strong> {will.percentage}%
                    </p>
                    <p>
                      <strong>Amount:</strong> {will.amount.toFixed(2)}
                    </p>
                    <p>
                      <strong>Recipient:</strong>{" "}
                      {will.recipientType === "customAddress"
                        ? "Custom Address"
                        : "Category"}
                    </p>
                    {will.recipientType === "customAddress" && (
                      <p>
                        <strong>Addresses:</strong>{" "}
                        {will.customAddresses.join(", ")}
                      </p>
                    )}
                    {will.recipientType === "selectCategory" && (
                      <p>
                        <strong>Category:</strong> {will.category}
                      </p>
                    )}
                    <p>
                      <strong>Start Date:</strong>{" "}
                      {will.startDate || "Not included"}
                    </p>
                    <p>
                      <strong>End Date:</strong> {will.endDate || "Not included"}
                    </p>
                  </li>
                ))}
              </ul>
            </td>
            <td className="align-top" style={{ width: "30%" }}>
              <h2 className="subtitle">
Remaining Assets Balances</h2>
              <ul>
                {Object.entries(totalAmounts).map(([asset, data]) => (
                  <li key={asset}>
                    <p>
                      <strong>{asset}:</strong> {data.amount.toFixed(2)}{" "}
                      ({data.percentage.toFixed(2)}%)
                    </p>
                  </li>
                ))}
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default AddContractPage;