import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import cancle from '../../assets/icon/cancel.png';

interface CropChangeModalProps {
  onClose: () => void;
}

const CropChangeModal: React.FC<CropChangeModalProps> = ({ onClose }) => {
  const cropResults = useSelector((state: RootState) => state.cropResult);
  const round = useSelector((state: RootState) => state.time.round);

  const getChangeRate = (cropName: string) => {
    const originalPrice = cropResults.originPriceMap[cropName];
    const newPrice = cropResults.newPriceMap[cropName];
    if (originalPrice && newPrice) {
      return ((newPrice - originalPrice) / originalPrice * 100).toFixed(2);
    }
    return 'N/A';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="bg-[#fff4e1] p-8 rounded-lg shadow-2xl w-[85%] max-w-5xl relative border-[6px] border-[#b88c4a]">
        {/* 타이틀 */}
        <h2 className="text-4xl yellow-text font-extrabold text-center mb-6 yellow-text2 drop-shadow-lg">
          {round}R 결과
        </h2>

        {/* 닫기 버튼 */}
        <button
          className="absolute top-4 right-4 text-[#ff6565] font-bold text-2xl"
          onClick={onClose}
        >
          <img src={cancle} />
        </button>

        {/* 작물 변동률 목록 */}
        <div className="overflow-y-auto max-h-60 grid grid-cols-2 gap-4 px-4 py-4">
          {Object.keys(cropResults.newPriceMap).length > 0 ? (
            Object.keys(cropResults.newPriceMap).map(cropName => (
              <div key={cropName} className="flex items-center justify-between p-4 bg-[#ffeac2] rounded-lg shadow-md border-[2px] border-[#b88c4a]">
                <span className="font-bold text-lg text-[#805300]">{cropName}</span>
                {/* 텍스트 크기 조정 */}
                <span className={`text-base font-semibold ${Number(getChangeRate(cropName)) >= 0 ? 'text-red-600' : 'text-blue-600'}`}>
                  {cropResults.originPriceMap[cropName].toLocaleString()}원 → {cropResults.newPriceMap[cropName].toLocaleString()}원
                </span>
                <span className={`ml-4 font-semibold text-base ${Number(getChangeRate(cropName)) >= 0 ? 'text-red-600' : 'text-blue-600'}`}>
                  {getChangeRate(cropName)}%
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-2">작물 변동률 정보가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropChangeModal;
