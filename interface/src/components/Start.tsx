
import type { Address, ContractFunctionParameters } from 'viem';
import { useHistory } from 'react-router-dom';

export default function Start({ address }: { address: Address }) {

    const history = useHistory();

    const handleButtonClick = () => {
        history.push('/form');
      };


    return (
      <div className="flex w-[450px]">
        <button onClick={handleButtonClick}>Go to Another Page</button>
      </div>
    );
  }