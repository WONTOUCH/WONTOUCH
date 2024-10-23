import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from '../../redux/store';
import mint_coin from '../../assets/icon/coin_mint_mini.png';
import coin from '../../assets/icon/coin_gold_mini.png';
import { updateUserStats } from '../../redux/slices/userSlice';

// 추가: CropChangeModal (작물 가격 변동 모달)
import CropChangeModal from './CropChangeModal'; // 가격 변동을 표시하는 컴포넌트 추가

const GameResultModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const results = useSelector((state: RootState) => state.gameResult.results);
  const userId = useSelector((state: RootState) => state.user.id);
  const round = useSelector((state: RootState) => state.time.round); // 현재 라운드를 가져옴
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_URL;

  const [nicknames, setNicknames] = useState<{ [key: string]: string }>({});
  const [showPriceChangeModal, setShowPriceChangeModal] = useState(false); // 가격 변동 모달 상태
  const [showFinalResultModal, setShowFinalResultModal] = useState(false); // 최종 결과 모달 상태

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-[#fdd835]";
      case 2:
        return "text-[#b0bec5]";
      case 3:
        return "text-[#8d6e63]";
      default:
        return "text-white";
    }
  };

  const getRankFont = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-[32px]";
      case 2:
        return "text-[28px]";
      case 3:
        return "text-[24px]";
      default:
        return "text-[20px]";
    }
  };

  const getRankBackground = (rank: number) => {
    return rank <= 3 ? "bg-[#36EAB5]" : "bg-transparent";
  };

  useEffect(() => {
    const fetchNicknames = async () => {
      try {
        const promises = results.map(async (player) => {
          const response = await axios.get(`${API_URL}/user/${player.playerId}`);
          if (response.data && response.data.data && response.data.data.nickname) {
            return { playerId: player.playerId, nickname: response.data.data.nickname };
          } else {
            return { playerId: player.playerId, nickname: 'Unknown' };
          }
        });

        const nicknameResults = await Promise.all(promises);

        const nicknameMap = nicknameResults.reduce((acc, { playerId, nickname }) => {
          acc[playerId] = nickname;
          return acc;
        }, {} as { [key: string]: string });

        setNicknames(nicknameMap);
      } catch (error) {
        console.error("닉네임을 불러오는 중 오류 발생:", error);
      }
    };

    if (results.length > 0) {
      fetchNicknames();
    }
  }, [results]);

  useEffect(() => {
    if (!userId) return;

    const playerStat = results.find((player) => player.playerId === String(userId));

    if (playerStat) {
      dispatch(updateUserStats({
        tierPoint: playerStat.tierPoint,
        mileage: playerStat.mileage,
      }));
    }

    // 추가: 5라운드일 때 가격 변동 모달을 먼저 보여주기
    if (round === 5) {
      setShowPriceChangeModal(true);
    } else {
      setShowFinalResultModal(true); // 5라운드가 아니면 바로 결과 모달을 보여줌
    }
  }, []);

  const sortedResults = [...results].sort((a, b) => a.rank - b.rank);

  // 가격 변동 모달을 닫고 최종 결과 모달을 띄우기
  const handleClosePriceChangeModal = () => {
    setShowPriceChangeModal(false);
    setShowFinalResultModal(true);
  };

  return (
    <>
      {/* 5라운드일 때 가격 변동 모달 */}
      {showPriceChangeModal && <CropChangeModal onClose={handleClosePriceChangeModal} />}

      {/* 가격 변동 모달이 닫히면 최종 결과 모달을 띄움 */}
      {showFinalResultModal && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50" onClick={onClose}></div>

          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="relative p-8 rounded-lg shadow-lg w-[90%] h-auto bg-[#0D7B5B] z-30 bg-opacity-30 ">

              <div className="relative z-20">
                <h2 className="text-5xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#FFEE00] to-[#36EAB5] drop-shadow-md result-textborder">
                  게임 결과
                </h2>

                <div className="grid grid-cols-5 gap-2 text-center font-bold text-lg text-white result-userborder">
                  <div className="col-span-5 grid grid-cols-5">
                    <div className='text-[26px] mb-2'>순위</div>
                    <div className='text-[26px]'>닉네임</div>
                    <div className='text-[26px]'>최종 자산</div>
                    <div className='text-[26px]'>경험치</div>
                    <div className='text-[26px]'>마일리지</div>
                  </div>

                  {sortedResults.map((result) => (
                    <React.Fragment key={result.playerId}>
                      <div className={`col-span-5 grid grid-cols-5 py-2 px-3 ${getRankBackground(result.rank)} bg-opacity-30`}>
                        <div className={` ${getRankColor(result.rank)} ${getRankFont(result.rank)} `}>
                          {result.rank}
                        </div>
                        <div className="">{nicknames[result.playerId] || '불러오는 중...'}</div>
                        <div className="text-[#fbc02d] flex justify-center">
                          <img src={coin} className='mr-2' /> {result.totalGold.toLocaleString()}
                        </div>
                        <div className="">{result.tierPoint}</div>
                        <div className="flex justify-center">
                          <img src={mint_coin} className='mr-2' />{result.mileage}
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    className="px-6 py-3 bg-[#e0e0e0] text-black font-semibold rounded-lg hover:bg-[#bdbdbd] mx-2"
                    onClick={onClose}
                  >
                    나가기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default GameResultModal;
