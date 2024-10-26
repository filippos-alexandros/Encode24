import { Link } from 'react-router-dom';

import TransactionWrapper from 'src/components/TransactionWrapper';
import WalletWrapper from 'src/components/WalletWrapper';
import { ONCHAINKIT_LINK } from 'src/links';
import OnchainkitSvg from 'src/svg/OnchainkitSvg';
import { useAccount } from 'wagmi';
import LoginButton from '../components/LoginButton';
import SignupButton from '../components/SignupButton';
import SmartContractWrapper from 'src/components/SmartContractWrapper';

function HomePage() {
  const { address } = useAccount();
  return (
    <div>
      <h1 class="title">Home Page</h1>


{/*      <hr></hr>
      <Link to="/wallet">Go to Wallet</Link>
      <hr></hr>
      <Link to="/add-smart-contract">Add Smart Contract</Link>
      <hr></hr>*/}

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
        {/* <div className="flex h-[450px] w-[450px] max-w-full items-center justify-center rounded-xl bg-[#030712]">
          <div className="rounded-xl bg-[#F3F4F6] px-4 py-[11px]">
            <p className="font-normal text-indigo-600 text-xl not-italic tracking-[-1.2px]">
              npm install @coinbase/onchainkit
            </p>
          </div>
        </div> */}
        {address ? (
          // <SmartContractWrapper address={address} />
           <Link to="/add-smart-contract">
            <button style={{ 
              backgroundColor: '#007bff', 
              color: 'white', 
              padding: '10px 20px', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer' 
            }}>Create Your Legacy Plan</button>
          </Link>

        ) : (
          <WalletWrapper
            className="w-[450px] max-w-full"
            text="Sign in to manage your asset plan"
          />
        )}
      </section>

    </div>
  );
}

export default HomePage;
