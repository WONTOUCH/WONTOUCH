import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { decrementDuration, decrementPreparationTime } from '../../redux/slices/timeSlice';
import bl from '../../assets/icon/selectbox_bl.png';
import br from '../../assets/icon/selectbox_br.png';
import tl from '../../assets/icon/selectbox_tl.png';
import tr from '../../assets/icon/selectbox_tr.png';

const TimerModal: React.FC = () => {
  const { duration, round, preparationTime, isPreparation } = useSelector((state: RootState) => state.time);
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setInterval(() => {
      if (isPreparation) {
        dispatch(decrementPreparationTime());
      } else {
        dispatch(decrementDuration());
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch, isPreparation]);

  // 시간을 "00:00" 형식으로 변환하는 함수
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-6 left-[50%] translate-x-[-50%] w-[160px] h-[70px] z-50">

      {/* 모서리 이미지들 */}
      <img src={tl} className="absolute top-[-10px] left-[-10px] w-8 h-8 z-[60]" alt="Top Left" />
      <img src={tr} className="absolute top-[-10px] right-[-10px] w-8 h-8 z-[60]" alt="Top Right" />
      <img src={bl} className="absolute bottom-[-10px] left-[-10px] w-8 h-8 z-[60]" alt="Bottom Left" />
      <img src={br} className="absolute bottom-[-10px] right-[-10px] w-8 h-8 z-[60]" alt="Bottom Right" />

      {/* 타이머 박스 */}
      <div className="w-full h-full bg-[#d9b48f] border-4 border-[#4e342e] shadow-lg rounded-lg flex flex-col items-center justify-center relative">

        {/* 라운드 글자 */}
        <div className="absolute top-[-20px] yellow-text3 text-3xl font-extrabold">
          {isPreparation ? '준비' : `${round}R`}
        </div>

        {/* 타이머 */}
        <div className="text-white text-3xl font-extrabold pixel-font mt-auto mb-2 white-text">
          {isPreparation ? formatTime(preparationTime) : formatTime(duration)}
        </div>
      </div>
    </div>
  );
};

export default TimerModal;
