import React from 'react';
import cancle from '../../assets/icon/cancel.png';
import confirmImg from '../../assets/icon/confirm.png';
import mileage from '../../assets/icon/coin_mint_mini.png';

interface ConfirmPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  price: number; // 가격 정보를 prop으로 받음
}

const ConfirmPurchaseModal: React.FC<ConfirmPurchaseModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  price,
}) => {
  if (!isOpen) return null;

  return (
    <div className="yellow-box yellow-box min-w-[500px] w-1/3 p-6 px-10 border-[#36EAB5] bg-[#FFFEEE]">
      <h2 className="mint-title mb-7">구매 확인</h2>
      <div className="white-text mb-10 text-[1.4rem]">
        <div className="flex justify-center items-center">
          <span className="mileage-text text-[1.4rem]">{price}</span>
          <div>
            <img src={mileage} alt="마일리지" className="ml-1" />
          </div>
        </div>
        구매하시겠습니까?
      </div>
      <button onClick={onClose} className="mr-20">
        <img src={cancle} alt="취소" />
      </button>
      <button onClick={onConfirm}>
        <img src={confirmImg} alt="확인" />
      </button>
    </div>
  );
};

export default ConfirmPurchaseModal;
