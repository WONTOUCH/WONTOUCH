import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import intro1 from '../../../assets/firstLogin/Frame1.png';
import intro2 from '../../../assets/firstLogin/Frame2.png';
import intro3 from '../../../assets/firstLogin/Frame3.png';
import intro4 from '../../../assets/firstLogin/Frame4.png';
import intro5 from '../../../assets/firstLogin/Frame5.png';
import left from '../../../assets/icon/arrow_left.png';
import right from '../../../assets/icon/arrow_right.png';

function KakaoToSignup() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  // 이미지를 배열에 저장
  const images = [intro1, intro2, intro3, intro4, intro5];

  // 다음 페이지로 이동
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 이전 페이지로 이동
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 회원가입 페이지로 이동
  const goToSignup = async () => {
    navigate('/signup/kakao');
  };

  return (
    <div className="relative w-full h-screen">
      {/* 좌우 버튼 */}
      <div className="pagination-controls flex justify-between items-center absolute top-1/2 transform -translate-y-1/2 w-full px-4">
        <button
          className="absolute left-0 transform -translate-y-1/2 ml-6"
          onClick={handlePrev}
          style={{ display: currentPage === 1 ? 'none' : 'block' }} // 첫 페이지에서 숨김
        >
          <img src={left} alt="이전" className="w-16" />
        </button>
        <button
          className="absolute right-0 transform -translate-y-1/2 mr-6"
          onClick={handleNext}
          style={{ display: currentPage === totalPages ? 'none' : 'block' }} // 마지막 페이지에서 숨김
        >
          <img src={right} alt="다음" className="w-16" />
        </button>
      </div>

      {/* 이미지 */}
      <div className="image-container w-full h-full">
        <img
          src={images[currentPage - 1]}
          alt={`소개 이미지 ${currentPage}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 마지막 페이지에서 캐릭터 생성 버튼 표시 */}
      {currentPage === totalPages && (
        <div className="flex flex-col justify-center items-center absolute bottom-0 w-full p-8 z-10">
          <button
            onClick={goToSignup}
            className="ready-button w-2/5 mx-auto h-[85px]"
          >
            캐릭터 생성
          </button>
        </div>
      )}
    </div>
  );
}

export default KakaoToSignup;
