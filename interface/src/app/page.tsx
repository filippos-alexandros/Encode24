'use client';
import Footer from 'src/components/Footer';


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/Home';
import WalletPage from '../pages/Wallet';
import AddContractPage from '../pages/AddContract';



export default function Page() {

  return (
    <div className="flex h-full w-96 max-w-full flex-col px-1 md:w-[1008px] ">


    <BrowserRouter>
      <Routes>

            <Route path="/" element={<HomePage />}/>
   
            <Route path="/wallet" element={<WalletPage />} />
    
            <Route path="/add-smart-contract" element={<AddContractPage />} />

      </Routes>
    </BrowserRouter>


      <Footer />


    </div>
  );
}
