import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import coin from '../../assets/icon/coin_gold_mini.png';

const BalanceDisplay: React.FC = () => {
  const balance = useSelector((state: RootState) => state.balance.balance);

  return (
    <div className="fixed top-6 right-0 py-4 px-10 rounded-lg z-50 flex justify-between items-center">
      <img src={coin} className='mr-3 w-10 h-10' />
      <p className="yellow-text2 font-semibold text-[28px]" >{balance.toLocaleString()}</p>
    </div>
  );
};

export default BalanceDisplay;
