import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useDispatch } from 'react-redux';
import { removeFriend } from '../../../redux/slices/friendSlice';

import cancel from '../../../assets/icon/cancel.png';
import confirm from '../../../assets/icon/confirm.png';

export default function FriendDelete({
  closeDeleteModal,
  friendId,
  nickname,
}: {
  closeDeleteModal: () => void;
  friendId: number;
  nickname: string;
}) {
  const API_LINK = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.id);

  // 삭제 요청
  const deleteFriend = async () => {
    try {
      await axios.delete(`${API_LINK}/friend/delete`, {
        data: {
          userId: userId,
          friendId: friendId,
        },
      });
      // store 친구 목록 업데이트
      dispatch(removeFriend(friendId));
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <div className="yellow-box min-w-[600px] w-2/5 h-[250px] p-6 px-10 border-[#36EAB5] bg-[#FFFEEE]">
      <div className="mint-title text-5xl mb-8">친구 끊기</div>
      <div className="white-text text-3xl mb-8">
        {nickname} 님과 친구를 끊겠습니까?
      </div>
      <div className="flex justify-between px-36">
        <button>
          <img src={cancel} alt="취소" onClick={closeDeleteModal} />
        </button>
        <button>
          <img src={confirm} alt="친구 삭제" onClick={deleteFriend} />
        </button>
      </div>
    </div>
  );
}
