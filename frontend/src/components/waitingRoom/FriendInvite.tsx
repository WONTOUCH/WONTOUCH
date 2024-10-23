import CancelIcon from '../../assets/icon/cancel.png';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { setOnlineFriends } from '../../redux/slices/friendSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import LevelImg from '../common/LevelImg';
import Modal from '../common/Modal';
import AlertModal from '../common/AlertModal';
import SuccessModal from '../common/SuccessModal';

function FriendInvite({ onClose }: { onClose: () => void }) {
  const API_LINK = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.id);
  const roomId = useSelector((state: RootState) => state.room.roomId);
  const onlineFriendsList = useSelector(
    (state: RootState) => state.friend.onlineFriends,
  );
  const [invitedFriends, setInvitedFriends] = useState<boolean[]>([]);
  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    message: '',
  });
  const [successModal, setSuccessModal] = useState({
    isVisible: false,
    message: '',
  });

  // 경고 모달 닫기
  const closeAlterModal = () =>
    setAlertModal({ isVisible: false, message: '' });
  // 성공 모달 닫기
  const closeSuccessModal = () => {
    setSuccessModal({ isVisible: false, message: '' });
  };

  useEffect(() => {
    // 온라인 친구 목록을 API로부터 가져오는 함수
    const fetchOnlineFriends = async (userId: number | null) => {
      try {
        const response = await axios.get(`${API_LINK}/friend/online/${userId}`);

        if (response.data.status === 200) {
          dispatch(setOnlineFriends(response.data.data));
          setInvitedFriends(Array(response.data.data.length).fill(false)); // 초대 상태 초기화
          // console.log(response.data.data);
        }
      } catch (error) {
        // console.error('친구 목록 가져오기 실패: ', error);
      }
    };

    fetchOnlineFriends(userId);
  }, [userId, roomId]);

  const toggleInvite = (index: number) => {
    // 해당 친구의 초대 상태를 토글
    setInvitedFriends((prev) => {
      const newInvites = [...prev];
      newInvites[index] = !newInvites[index];

      // 초대 요청 API 호출
      if (newInvites[index]) {
        inviteFriend(onlineFriendsList[index].friendId);
      }

      return newInvites;
    });
  };

  const inviteFriend = async (friendId: number) => {
    try {
      const response = await axios.post(`${API_LINK}/room/invite`, {
        senderId: userId,
        receiverId: friendId,
        roomId: roomId,
      });
      // console.log(`친구 ${friendId}에게 초대 완료`);
      setSuccessModal({
        isVisible: true,
        message: '친구 초대 완료!',
      });
    } catch (error) {
      setAlertModal({
        isVisible: true,
        message: '초대 요청 실패..',
      });
      // console.error('초대 요청 실패:', error);
    }
  };

  return (
    <div className="yellow-box px-[37px] py-[20px] w-[600px] h-[400px] border-[#36eab5] bg-[#FFFEEE]">
      <div className="relative mb-2">
        <div className="mint-title text-center">게임 초대 가능한 친구</div>
        <button
          onClick={onClose}
          className="absolute top-[10px] right-[10px] bg-none"
        >
          <img src={CancelIcon} alt="닫기 버튼" />
        </button>
      </div>
      <section className="bg-[#E6E2C2] h-4/5 pl-[14px] pr-[30px] py-5 rounded-[10px] overflow-x-hidden overflow-y-scroll">
        <div>
          {onlineFriendsList && onlineFriendsList.length > 0 ? (
            onlineFriendsList.map((friend, index) => (
              <div
                className="w-full mb-1 flex justify-between px-2 items-center"
                key={friend.friendId}
              >
                <div className="ranking-box white-text text-2xl p-1 w-[260px] mb-1 flex justify-between px-2 overflow-hidden">
                  {friend.nickname}
                  <div className="w-6">
                    <LevelImg tierPoint={friend.tierPoint} />
                  </div>
                </div>
                <button
                  onClick={() => !invitedFriends[index] && toggleInvite(index)}
                  className={`ml-2 rounded-xl px-4 py-3 min-w-[100px] text-white ${invitedFriends[index] ? 'bg-gray-400 cursor-default' : 'bg-[#896A65]'}`}
                  style={{
                    pointerEvents: invitedFriends[index] ? 'none' : 'auto',
                  }}
                >
                  {invitedFriends[index] ? '초대완료' : '초대'}
                </button>
              </div>
            ))
          ) : (
            <p className="white-text text-2xl">온라인 친구가 없습니다.</p> // 친구가 없을 때 표시할 메시지
          )}
        </div>
      </section>
      {alertModal.isVisible && (
        <Modal>
          <AlertModal
            message={alertModal.message}
            closeAlterModal={closeAlterModal}
          />
        </Modal>
      )}
      {successModal.isVisible && (
        <Modal>
          <SuccessModal
            message={successModal.message}
            closeSuccessModal={closeSuccessModal}
          />
        </Modal>
      )}
    </div>
  );
}

export default FriendInvite;
