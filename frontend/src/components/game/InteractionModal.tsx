import React, { useEffect, useRef, useState } from 'react';
//import lock from '../../assets/icon/lock.png';
import board from '../../assets/game/board.png';
import npc from '../../assets/background/npc.png';
import up from '../../assets/icon/arrow_up.png';
import down from '../../assets/icon/arrow_up-1.png';
import cancle from '../../assets/icon/cancel.png';
import confirm from '../../assets/icon/confirm.png';
import leftArrow from '../../assets/icon/arrow_left.png'; // 좌측 화살표 이미지
import rightArrow from '../../assets/icon/arrow_right.png'; // 우측 화살표 이미지
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { ModalProps, Article } from './types';
import { updateCount } from '../../redux/slices/cropQuantitySlice';


// 이미지 파일을 동적으로 가져오기
const cropImages = import.meta.glob('../../assets/crops/*.png');

const InteractionModal: React.FC<ModalProps> = ({ houseNum, closeModal, gameSocket, cropList, dataChart }) => {
  const [count, setCount] = useState(1);
  const countRef = useRef(count);
  const [purchaseModal, setPurchaseModal] = useState(false);
  const userId = useSelector((state: RootState) => state.user.id);

  //작물 인덱스 보기
  const [currentCropIndex, setCurrentCropIndex] = useState(0);
  const [currentImageSrc, setCurrentImageSrc] = useState<string | null>(null);
  // cropList 배열 생성 (Object.entries를 사용하여 객체를 배열로 변환)
  const crops = Object?.entries(cropList ?? {});
  const allCrops = useSelector((state: RootState) => state.crop.crops);

  const [chartArray, setChartArray] = useState<number[]>([]); // chartArray를 상태로 관리
  const [checkModal, setCheckModal] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null); // 선택된 기사 상태
  const [articleDetailModal, setArticleDetailModal] = useState<boolean>(false);

  // 현재 작물의 수량을 Redux에서 가져옴
  const cropQuantities = useSelector((state: RootState) => state.cropQuantity.cropsQuantities);

  //기사 가져오기
  const dispatch = useDispatch();

  const purchasedArticles = useSelector((state: RootState) => state.article.purchasedArticles);

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const articlesPerPage = 2; // 한 페이지에 보여줄 기사 수

  // 총 페이지 수 계산
  const totalPages = Math.ceil(purchasedArticles.length / articlesPerPage);

  const playerCropList = useSelector((state: RootState) => state.playerCrop.crops);

  // 현재 페이지에 해당하는 기사들만 슬라이싱
  const currentArticles = purchasedArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  // 다음 페이지로 이동
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 이전 페이지로 이동
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    countRef.current = count;
    //console.log(countRef.current);
  }, [count])


  useEffect(() => {
    if (dataChart) {
      const chartValues = Object.values(dataChart);
      setChartArray(chartValues); // chartArray 업데이트
    }
  }, [dataChart]); // dataChart가 변경될 때마다 업데이트

  // houseNum에 맞는 작물 필터링
  const getFilteredCropsByHouse = (houseNum: number | null) => {
    let townType = '';
    switch (houseNum) {
      case 1:
        townType = 'DOMESTIC_FRUITS';
        break;
      case 2:
        townType = 'VEGETABLES_1';
        break;
      case 3:
        townType = 'MUSHROOMS_MEDICINAL';
        break;
      case 4:
        townType = 'IMPORTED_FRUITS';
        break;
      case 5:
        townType = 'VEGETABLES_2';
        break;
      default:
        townType = 'GRAINS_NUTS';
        break;
    }
    return allCrops.filter((crop) => crop.type === townType);
  };

  const filteredCrops = getFilteredCropsByHouse(houseNum);
  const currentCrop = filteredCrops[currentCropIndex] || { name: '', price: 0 };

  //현재 작물 가져오기
  const currentCropQuantity = cropQuantities.find(crop => crop.id === currentCrop.id)?.quantity ?? 0;

  useEffect(() => {
    //console.log(currentCropIndex);
  }, [currentCropIndex]);

  const handlePrev = () => {
    if (currentCropIndex > 0) {
      setCurrentCropIndex(currentCropIndex - 1);
      setCount(1);
    }
  };

  const handleNext = () => {
    if (currentCropIndex < crops.length - 1) {
      // 마지막 작물에서 다음으로 가려면 첫 번째 작물로 이동
      setCurrentCropIndex(currentCropIndex + 1);
      setCount(1);
    }
    //console.log(currentCropIndex);
  };

  const closePurchaseModal = () => {
    setPurchaseModal(false);
  };

  // const closePurchaseModal = () => {
  //   setPurchaseModal(false);
  // }

  const sentCropChartRef = useRef<string | null>(null);  // 요청 상태를 추적

  // 이미지 동적 로딩
  useEffect(() => {
    if (filteredCrops.length > 0 && houseNum !== null && houseNum > 0) {
      const cropName = currentCrop.id;

      const loadImage = async () => {
        const imagePath = cropImages[`../../assets/crops/${cropName}.png`];
        if (imagePath) {
          const imageModule = await (imagePath as () => Promise<{ default: string }>)();
          setCurrentImageSrc(imageModule.default);
        }
      };

      // 요청이 아직 전송되지 않았거나 다른 작물로 변경된 경우에만 CROP_CHART 요청 전송
      if (gameSocket?.readyState === 1 && sentCropChartRef.current !== cropName) {
        const cropChart = {
          type: "CROP_CHART",
          cropId: currentCrop.id
        };

        gameSocket?.send(JSON.stringify(cropChart));
        sentCropChartRef.current = cropName;  // 요청 전송 후 상태 업데이트
        //console.log(sentCropChartRef.current);
      }

      loadImage();
    }
  }, [currentCropIndex, filteredCrops, gameSocket, currentCrop]);

  useEffect(() => {
    if (houseNum !== null && houseNum !== 0 && gameSocket) {
      let townName = '';
      switch (houseNum) {
        case 1:
          townName = 'DOMESTIC_FRUITS';
          break;
        case 2:
          townName = "VEGETABLES_1";
          break;
        case 3:
          townName = "MUSHROOMS_MEDICINAL";
          break;
        case 4:
          townName = "IMPORTED_FRUITS";
          break;
        case 5:
          townName = "VEGETABLES_2";
          break;
        default:
          townName = "GRAINS_NUTS";
          break;
      }
      //console.log(townName);

      // 모달이 열렸을 때, TOWN_CROP_LIST 요청 전송
      const townCropMessage = {
        type: "TOWN_CROP_LIST",
        townName: townName
      };

      if (gameSocket?.readyState === WebSocket.OPEN) {
        gameSocket.send(JSON.stringify(townCropMessage));
        //console.log("내가 보낸 집은", houseNum);
      } else {
        console.error("WebSocket이 연결되어 있지 않습니다.");
      }
    }
  }, [houseNum, gameSocket]);

  const minusCount = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  const plusCount = () => {
    setCount(count + 1);
  };

  const clearCount = () => {
    setCount(1);
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeModal();
      setCount(0);
    }
  };

  useEffect(() => {
    // 이벤트 등록
    window.addEventListener('keydown', handleKeyDown);

    // 모달 닫히면 이벤트 제거
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (houseNum === null || crops.length === 0) return null;

  const sellCrop = () => {
    //수량 0이면 리턴
    if (countRef.current === 0) {
      return;
    }
    const cropName = filteredCrops[currentCropIndex].id; // 현재 작물의 ID를 가져옴
    //판매 양식
    const reqSellCrop = {
      type: "SELL_CROP",
      cropId: cropName,
      quantity: countRef.current,
      playerId: userId
    };

    if (gameSocket?.readyState === WebSocket.OPEN) {
      // 수량 업데이트
      dispatch(updateCount({ id: cropName, newCount: countRef.current }));
      // 웹소켓으로 메시지 전송
      gameSocket?.send(JSON.stringify(reqSellCrop));
    } else {
      console.error("WebSocket이 열려있지 않습니다.");
    }
  };

  const buyCrop = () => {
    //수량 0이면 리턴
    if (countRef.current === 0) {
      return;
    }
    const cropName = filteredCrops[currentCropIndex].id; // 현재 작물의 ID를 가져옴
    //구매 양식
    const reqBuyCrop = {
      type: "BUY_CROP",
      cropId: cropName,
      quantity: countRef.current,
      playerId: userId
    };
    //console.log(reqBuyCrop);

    if (gameSocket?.readyState === WebSocket.OPEN) {
      dispatch(updateCount({ id: cropName, newCount: countRef.current }));
      // 웹소켓으로 메시지 전송
      gameSocket.send(JSON.stringify(reqBuyCrop));
    } else {
      console.error("WebSocket이 열려있지 않습니다.");
    }
  };

  const handleRandomPurchase = () => {
    setCheckModal(true);
  }

  const isPurchaseReally = () => {
    const message = {
      type: "BUY_RANDOM_ARTICLE",
    };

    if (gameSocket?.OPEN) {
      //랜덤구매 기사 메세지
      gameSocket.send(JSON.stringify(message));
    }

    setCheckModal(false);
  }

  const closeCheckModal = () => {
    setCheckModal(false);
  }

  // 기사 클릭 시 호출되는 함수
  const showArticle = (article: Article) => {
    setSelectedArticle(article); // 선택된 기사 저장
    setArticleDetailModal(true); // 모달 열기
  };

  const closeShowArticle = () => {
    setArticleDetailModal(false); // 모달 닫기
    setSelectedArticle(null); // 선택된 기사 초기화
  }

  const formatVillage = (town: string) => {
    switch (town) {
      case "DOMESTIC_FRUITS":
        return "탱글숲";
      case "VEGETABLES_1":
        return "채밭골";
      case "MUSHROOMS_MEDICINAL":
        return "약초골";
      case "IMPORTED_FRUITS":
        return "과즙비";
      case "VEGETABLES_2":
        return "푸름채";
      case "GRAINS_NUTS":
        return "황금들녘";
    }
  }

  const formatVillageNum = (houseNum: number) => {
    switch (houseNum) {
      case 1:
        return "탱글숲";
      case 2:
        return "채밭골";
      case 3:
        return "약초골";
      case 4:
        return "과즙비";
      case 5:
        return "푸름채";
      case 6:
        return "황금들녘";
    }
  }

  return (
    <>
      {/* 모달 뒤에 어두운 배경 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-1000"
        onClick={closeModal}
      ></div>

      {/* 모달 창 */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* 거래소가 아닐 때 */}
        {houseNum !== 0 ? (
          <div className="relative p-6 rounded-lg shadow-lg w-[60%] h-auto z-30 bg-transparent mb-[10%]">
            {/* 보드 이미지 */}
            <img
              src={board}
              alt="보드 이미지"

              className="absolute top-0 left-[25%] w-full h-full z-10"
            />

            {/* 아이템 정보 (보드 위에 텍스트 배치) */}
            <div className="relative z-20 p-6 left-[25%] ml-4">
              <div className="flex justify-end items-center">
                <button
                  className="text-gray-600 hover:text-gray-800"
                  onClick={closeModal}
                >
                  <img src={cancle} />
                </button>
              </div>

              {/* 작물 정보 */}
              <div className="flex items-center justify-start mb-[5%]">
                <img
                  src={currentImageSrc ?? undefined} // 현재 작물에 맞는 이미지를 선택해야 함
                  alt={`${filteredCrops[currentCropIndex].id} 이미지`}
                  className="w-[20%] h-[20%] border border-black p-8 rounded-md"
                />
                <div className="ml-[5%]">
                  <p className="text-[36px] font-semibold white-text">{filteredCrops[currentCropIndex].name}</p> {/* 작물 이름 */}
                  <p className='yellow-text text-[24px]'>{filteredCrops[currentCropIndex].description}</p>
                  <p className="text-2xl">남은 수량: {currentCropQuantity} 상자</p> {/* 남은 수량 */}
                  <p className="text-[32px] font-bold yellow-text2">{chartArray[chartArray.length - 1] * count} 코인</p> {/* 가격은 임의 */}
                  <p>현재 보유량 : {playerCropList[filteredCrops[currentCropIndex].id]}개</p>
                </div>

              </div>

              {/* 좌우 화살표 추가 */}
              <div className="flex justify-between items-center mb-8">
                <button onClick={handlePrev}>
                  <img src={leftArrow} alt="이전 작물" />
                </button>

                <button onClick={handleNext}>
                  <img src={rightArrow} alt="다음 작물" />
                </button>
              </div>

              <div>
                {/* 매수/매도 버튼 */}
                <div>
                  <div className="flex justify-between">
                    <div className="flex-col">
                      <div className="flex items-center space-x-2 justify-between">
                        <button
                          className="bg-gray-300 text-gray-600 px-3 rounded-full text-[32px] mr-3"
                          onClick={minusCount}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="text-[32px] w-[80px] text-center bg-transparent border-none focus:outline-none"
                          value={count}
                          onChange={(e) => {
                            const newValue = parseInt(e.target.value) || 1;
                            if (newValue <= 50) {
                              setCount(newValue); // 50 이하일 때만 상태를 업데이트
                            }
                          }}
                          max={50} // 입력을 위한 기본 최대값 설정
                        />

                        <button
                          className="bg-gray-300 text-gray-600 px-3 rounded-full text-[32px]"
                          onClick={plusCount}
                        >
                          +
                        </button>
                      </div>
                      <div className="mt-4 flex items-center ml-1 mr-auto w-full white-text">
                        <button className="bg-blue-500 text-white py-1 px-3 rounded-2xl" onClick={sellCrop}>
                          매도
                        </button>
                        <button
                          className="bg-gray-500 text-white py-1 px-3 rounded-2xl ml-1"
                          onClick={clearCount}
                        >
                          초기화
                        </button>
                        <button className="bg-red-500 text-white py-1 px-3 rounded-2xl ml-1" onClick={buyCrop}>
                          매수
                        </button>
                      </div>
                    </div>
                    {/* 가격 변화 */}
                    <div className={`flex mt-4 px-2 py-4 ${((chartArray[chartArray.length - 1] - chartArray[chartArray.length - 2]) / chartArray[chartArray.length - 2] * 100).toFixed(1)} % ${chartArray[chartArray.length - 1] - chartArray[chartArray.length - 2] < 0 ? 'bg-blue-600' : 'bg-red-600'} rounded-lg ml-[10%] w-[60%] items-center justify-center`}>
                      <p className="white-text font-semibold text-[24px] text-end">
                        전날에 비해
                        <span className="semi-bold text-[28px] ml-3">
                          {chartArray.length === 1
                            ? '변동 없음'
                            : `${((chartArray[chartArray.length - 1] - chartArray[chartArray.length - 2]) / chartArray[chartArray.length - 2] * 100).toFixed(1)} % ${chartArray[chartArray.length - 1] - chartArray[chartArray.length - 2] < 0 ? '하락' : '상승'
                            }`}
                        </span>

                      </p>
                      <img src={chartArray[chartArray.length - 1] - chartArray[chartArray.length - 2] < 0 ? down : up} className="ml-5 w-[60px] h-[60px]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative p-6 rounded-lg shadow-lg w-[60%] h-auto z-30 bg-transparent mb-[10%]">
            {/* 보드 이미지 */}
            <img
              src={board}
              alt="보드 이미지"
              className="absolute top-0 left-[25%] w-full h-full z-10"
            />

            {/* 아이템 정보 (보드 위에 텍스트 배치) */}
            <div className="relative z-20 p-6 left-[25%] ml-4">
              <div className="flex justify-end items-center mb-4">
                <button
                  className="text-gray-600 hover:text-gray-800"
                  onClick={closeModal}
                >
                  <img src={cancle} />
                </button>
              </div>

              <div className="relative bg-[#faf3e0] p-8 rounded-lg shadow-lg w-[100%] h-auto z-30 mx-auto border-2 border-[#b88c4a]">
                <h2 className="text-3xl font-bold text-center mb-6 white-text">구매한 기사 목록</h2>

                {currentArticles.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {currentArticles.map((article, index) => (
                      <div
                        key={index}
                        className="border-2 border-[#d4b68b] rounded-lg p-4 bg-[#f9ecd3] shadow-md hover:bg-[#f4e3c1] transition-all"
                      >
                        <button
                          onClick={() => showArticle(article)}
                          className="flex flex-col text-lg font-semibold text-gray-800 hover:text-[#ffa726]"
                        >
                          <span className="font-bold white-text text-xl mb-2">
                            ({formatVillage(article.town)}마을)
                          </span>
                          <span className="text-[18px] truncate yellow-text2">
                            {article.info?.title || "제목 없음"}
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">구매한 기사가 없습니다.</p>
                )}

                {/* 페이지네이션 버튼 */}
                <div className="flex justify-between items-center mt-6">
                  <button
                    className={`p-3 bg-gray-300 white-text rounded-lg transition-colors ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400"
                      }`}
                    onClick={prevPage}
                    disabled={currentPage === 1 || currentPage === 0}
                  >
                    이전
                  </button>

                  {purchasedArticles.length > 0 && (
                    <span className="white-text">
                      {currentPage} / {totalPages}
                    </span>
                  )}

                  <button
                    className={`p-3 bg-gray-300 white-text rounded-lg transition-colors ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400"
                      }`}
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                  >
                    다음
                  </button>
                </div>

                {/* 랜덤 기사 구매 버튼 */}
                <button
                  className="mt-6 p-4 bg-[#6f4e1c] white-text text-xl rounded-lg w-full hover:bg-[#523c1b] transition-colors font-semibold"
                  onClick={handleRandomPurchase}
                >
                  랜덤 기사 구매
                </button>
              </div>
            </div>
          </div>
        )}
      </div >

      {/* NPC 이미지 */}
      < div className="fixed top-[75%] z-40 flex items-end w-[95%] h-[20%] shadow-lg" >
        <div className="flex-col">
          <p className="text-white text-[36px] text-center ml-[15%] yellow-text3">
            {houseNum === 0 ? '거래소' : `${formatVillageNum(houseNum)}마을 상점`}
          </p>
          <img
            src={npc}
            alt="마을 상인"
            className="w-[460px] h-[560px] ml-[10%]"
          />
        </div>
        <div className="bg-[#f4e2c7] p-4 rounded-lg flex flex-col items-start w-full h-full">
          <div className="font-bold text-lg border border-amber-900 rounded-2xl p-2 right-2">
            {houseNum === 0 ? '거래소 상인' : '마을 상인'}
          </div>
          <div className="text-md mt-7 w-full ml-[3%]">
            {houseNum === 0
              ? '어서오시게! 어느 마을의 소식이 궁금한가?'
              : '어서오시게! 무엇을 살텐가? 수량은 제한되어 있으니 빨리 사야 할거야~'}
          </div>
        </div>
      </div >

      {purchaseModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="relative p-6 rounded-lg shadow-lg w-[60%] h-auto bg-white z-30">
            {/* 보드 이미지 */}
            <img
              src={board}
              alt="보드 이미지"
              className="absolute top-0 left-0 w-full h-full z-10"
            />

            {/* 아이템 정보 (보드 위에 텍스트 배치) */}
            <div className="relative z-20 p-6">
              <div className="flex justify-end items-center mb-4">

                <button
                  onClick={closePurchaseModal}
                >
                  <img src={cancle} alt='아이이잉' />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {checkModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="relative p-6 rounded-lg shadow-lg w-[60%] h-auto bg-white z-30">
            {/* 보드 이미지 */}
            <img
              src={board}
              alt="보드 이미지"
              className="absolute top-0 left-0 w-full h-full z-10"
            />

            {/* 아이템 정보 (보드 위에 텍스트 배치) */}
            <div className="relative z-20 p-6">
              <div className="flex justify-end items-center mb-4 text-center">

                <button
                  onClick={closeCheckModal}
                >
                  <img src={cancle} alt='아이이잉' />
                </button>
              </div>
            </div>
            <div className='relative z-20 pb-6 flex flex-col justify-center items-center'>
              <p className='text-[28px]'>정말로 구매하실건가요?</p>
              <button className='mt-11' onClick={isPurchaseReally}>
                <img src={confirm} alt="확인버튼" />
              </button>
            </div>

          </div>
        </div>
      )}

      {articleDetailModal && selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative p-8 rounded-lg shadow-lg w-[60%] h-auto bg-white z-30">
            <img
              src={board}
              alt="보드 이미지"
              className="absolute top-0 left-0 w-full h-full z-10 opacity-20"
            />
            <div className="relative z-20 p-4">
              {/* 모달 닫기 버튼 */}
              <div className="flex justify-end">
                <button onClick={closeShowArticle} className="text-gray-500 hover:text-red-500">
                  <img src={cancle} alt="닫기" className="w-8 h-8" />
                </button>
              </div>
            </div>

            <div className="relative z-20 pb-6 flex flex-col justify-center items-center">
              {/* 기사 정보 */}
              <h2 className="text-3xl font-bold mb-4">{selectedArticle.info?.title}</h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">{selectedArticle.info?.body}</p>
              <p className="text-sm text-gray-500">작성자: {selectedArticle.info?.author}</p>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default InteractionModal;
