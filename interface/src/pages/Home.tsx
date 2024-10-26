import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

import TransactionWrapper from "src/components/TransactionWrapper";
import WalletWrapper from "src/components/WalletWrapper";
import { ONCHAINKIT_LINK } from "src/links";
import OnchainkitSvg from "src/svg/OnchainkitSvg";
import { useAccount } from "wagmi";
import LoginButton from "../components/LoginButton";
import SignupButton from "../components/SignupButton";
import SmartContractWrapper from "src/components/SmartContractWrapper";


function HomePage() {
  const { address } = useAccount();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); // Define navigate here

  interface CompiledContract {
    abi: any;
    bytecode: string;
  }


  const handleCreateLegacyPlanClick = () => {
    setShowModal(true);
  };

  const handleConfirmTransaction = () => {
    // Here you would add the logic to actually create the smart contract
    // For now, we'll just hide the modal
    // setShowModal(false);


    // HERE WE SHOULD DEPLOY THE CONTRACT
    // TransactionWrapper(address)
    // 

    // AFTER CONTRACT IS CREATED WE GO TO THE FORM
    // navigate('/add-smart-contract'); 

  };

  return (
    <div>
      <section className="mt-6 mb-6 flex w-full flex-col md:flex-row ">
        <div className="flex w-full flex-row items-center justify-between gap-2 md:gap-0">
          <a
            href={ONCHAINKIT_LINK}
            title="onchainkit"
            target="_blank"
            rel="noreferrer"
          >
            <OnchainkitSvg />
          </a>
          <div className="flex items-center gap-3">
            <SignupButton />
            {!address && <LoginButton />}
          </div>
        </div>
      </section>
      <section className="templateSection flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-gray-100 px-2 py-4 md:grow">
        {address ? (
          <button
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={handleCreateLegacyPlanClick}
          >
            Create Your Legacy Plan
          </button>
        ) : (
          <WalletWrapper
            className="w-[450px] max-w-full"
            text="Connect Wallet"
          />
        )}
      </section>

      {showModal && (
        <div
          className="modal"
          style={{
            display: "block",
            position: "fixed", // Stay in place even if the page is scrolled
            zIndex: 1, // Sit on top of other content
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            overflow: "auto", // Enable scrolling if needed
            backgroundColor: "rgba(0, 0, 0, 0.1)", // Semi-transparent background
          }}
        >
          <div
            className="modal-dialog"
            style={{
                marginTop: "10%",
                boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
                width: "40%",
                height: "auto", 
                zIndex: 11,
                position: "relative", // Add relative positioning to the dialog
                left: "50%",           // Shift it 50% to the right
                transform: "translateX(-50%)", // Shift it back 50% of its own wid
                padding: "1.2em",
                paddingTop: "1.9em",
                paddingBottom: "1.9em",
                borderRadius: "5px",
                backgroundColor: "white"
            }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title bold">
                  Confirm Smart Contract Creation
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>You are about to create a smart contract for your wallet.</p>
                <br></br>
                <p>
                  There's a cost associated with this transaction of: {"0.00001 ETH "}
                  {/* Display transaction cost here */}
                </p>{" "}
                {/* You'll need to calculate and display the actual cost */}
              </div>

              <br></br>

              <TransactionWrapper address={address}/>


              <div className="modal-footer">
                <button
                  style={{
                  marginTop: "20px",
                  padding: "10px",
                  backgroundColor: "#007BFF",
                  color: "#FFF",
                  borderRadius: "5px"
                }}

                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>


              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;