import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useNavigate } from 'react-router-dom';

import cancel from '../../../assets/icon/cancel.png';
import confirm from '../../../assets/icon/confirm.png';

export default function FindRoom({
  closeFindRoom,
}: {
  closeFindRoom: () => void;
}) {
  const API_LINK = import.meta.env.VITE_API_URL;
  const userId = useSelector((state: RootState) => state.user.id);
  const navigate = useNavigate();

  // 랜덤 방 입장
  const enterRandomRoom = async () => {
    try {
      const response = await axios.post(`${API_LINK}/room/quick-join`, {
        playerId: userId,
      });
      const roomId = response.data.data.roomId;
      navigate(`/wait/${roomId}`);
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <div className="yellow-box min-w-[700px] w-1/2 h-[250px] border-[#36EAB5] bg-[#FFFEEE] p-8">
      <div className="relative">
        <div className="mint-title mb-8 text-5xl">빠른 입장</div>
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2"
          onClick={closeFindRoom}
        >
          <img src={cancel} alt="메일함 닫기" />
        </button>
      </div>
      <div className="white-text text-3xl mb-6">
        랜덤한 방에 바로 입장하시겠습니까?
      </div>
      <button onClick={enterRandomRoom}>
        <img src={confirm} alt="확인" />
      </button>
    </div>
  );
}
