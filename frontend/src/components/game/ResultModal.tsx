import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import CropChangeModal from './CropChangeModal';
import board from '../../assets/game/board.png'; // board 이미지 추가
import { ResultModalProps } from './types';

const ResultModal: React.FC<ResultModalProps> = ({ round, onNextRound }) => {
  const articleResults = useSelector((state: RootState) => state.articleResult.articleResults);
  const preparationTime = useSelector((state: RootState) => state.time.preparationTime);

  const [expandedArticleIndex, setExpandedArticleIndex] = useState<number | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const toggleArticleExpansion = (index: number) => {
    setExpandedArticleIndex(expandedArticleIndex === index ? null : index);
  };

  const handleClick = () => {
    setIsButtonDisabled(true);
    onNextRound();
  };

  const openCropModal = () => {
    setIsCropModalOpen(true);
  };

  const closeCropModal = () => {
    setIsCropModalOpen(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative bg-white p-6 lg:p-8 rounded-lg shadow-lg w-full max-w-4xl bg-cover bg-center border-4 border-[#6e4f2e]" style={{ backgroundImage: `url(${board})` }}>
        <h2 className="text-4xl font-extrabold text-center yellow-text2 mb-6 pixel-font drop-shadow-md">Round {round} 종료!</h2>
        <p className="text-center mb-6 text-lg font-bold white-text">{preparationTime}초 뒤, 다음 라운드로 넘어갑니다.</p>

        <div className="space-y-6 overflow-y-auto max-h-96 bg-[#fff3d7] p-4 border-2 border-[#d4b68b] rounded-lg">
          {articleResults.length > 0 ? (
            articleResults.map((article, index) => (
              <div
                key={index}
                className="p-4 border-2 border-[#d4b68b] rounded-lg bg-[#faf3e0] shadow-md hover:bg-[#f7e9d0] transition-all"
              >
                <h3
                  className="text-lg font-semibold yellow-text2 cursor-pointer hover:underline"
                  onClick={() => toggleArticleExpansion(index)}
                >
                  {article?.title}
                </h3>
                <p className="text-gray-700 mt-2">
                  <span className="font-semibold white-text">변동률: </span>
                  {article?.change_rate >= 0 ? (
                    <span className="text-red-600">{article?.change_rate}%</span>
                  ) : (
                    <span className="text-blue-600">{article?.change_rate}%</span>
                  )}
                </p>
                {article?.sub_crops?.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-semibold white-text">관련 작물:</h4>
                    <ul className="list-disc list-inside">
                      {article?.sub_crops?.map((crop, cropIndex) => (
                        <li key={cropIndex}>
                          {crop.change_rate >= 0 ? (
                            <span className="text-red-600">{crop.name}: {crop.change_rate}%</span>
                          ) : (
                            <span className="text-blue-600">{crop.name}: {crop.change_rate}%</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {expandedArticleIndex === index && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800">기사 내용:</h4>
                    <p className="text-gray-600">{article.body}</p>
                    <p className="text-gray-500 mt-2 text-sm">작성자: {article.author}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="white-text text-center">기사 결과가 없습니다.</p>
          )}
        </div>

        {/* 작물 변동률과 준비 완료 버튼을 한 줄에 배치 */}
        <div className="flex justify-between mt-6">
          <button
            className="bg-[#896A65] white-text px-6 py-3 w-[48%] text-xl hover:bg-[#5e4440] rounded-lg shadow-md pixel-font"
            onClick={openCropModal}
          >
            작물 변동률 보기
          </button>

          <button
            className={`bg-[#54a8ec] white-text px-6 py-3 w-[48%] text-xl ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#1e88e5]'} rounded-lg shadow-md pixel-font`}
            onClick={handleClick}
            disabled={isButtonDisabled}
          >
            준비 완료!
          </button>
        </div>
      </div>

      {/* CropChangeModal 모달 표시 */}
      {isCropModalOpen && <CropChangeModal onClose={closeCropModal} />}

    </div>
  );
};

export default ResultModal;
