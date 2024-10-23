import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { decreaseNotificationCount } from '../../redux/slices/notificationSlice';
import { addFriend } from '../../redux/slices/friendSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from './Modal';
import SuccessModal from './SuccessModal';
import AlertModal from './AlertModal';
import ProfileImg from './ProfileImg';
import LevelImg from './LevelImg';
import LevelText from './LevelText';

import mail from '../../assets/icon/mail.png';
import cancel from '../../assets/icon/cancel.png';
import confirm from '../../assets/icon/confirm.png';
import { setPassword } from '../../redux/slices/roomSlice';

// 알림 전체 조회
interface Notification {
  id: string;
  senderId: number;
  senderNickname: string;
  notificationType: string;
  content: string;
}

// 친구 신청 알림 상세 조회
interface friendRequestInfo {
  fromUserId: number;
  fromUserNickname: string;
  fromUserTierPoint: number;
  fromUserCharacterName: string;
}

// 친구 추가
interface Friend {
  friendId: number;
  nickname: string;
  description: string;
  characterName: string;
  tierPoint: number;
  online: boolean;
}

// 게임 초대 알림 상세 조회
interface gameInviteInfo {
  roomId: string;
  senderNickname: string;
  password: string | null;
}

export default function Mail({ closeMail }: { closeMail: () => void }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const API_LINK = import.meta.env.VITE_API_URL;
  const userId = useSelector((state: RootState) => state.user.id);
  const accessToken = sessionStorage.getItem('access_token');

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [friendRequestInfo, setFriendRequestInfo] =
    useState<friendRequestInfo>();
  const [gameInviteInfo, setGameInviteInfo] = useState<gameInviteInfo>();
  const [gameInviteInfoNotificationId, setGameInviteInfoNotificationId] =
    useState<string>();
  const [successModal, setSuccessModal] = useState({
    isVisible: false,
    message: '',
  });
  const [alertModal, setAlertModal] = useState({
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

  // 1. 알림 불러오기
  const getNotifications = async () => {
    try {
      const response = await axios.get(
        `${API_LINK}/notification/list/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      // 데이터가 있으면 state 변경
      const data = response.data.data;
      // console.log(data);
      if (data) {
        setNotifications(data);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  // 2. 알림 클릭 시 상세 요청 보기
  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification); // 선택된 알림
    if (notification.notificationType === 'FRIEND_REQUEST') {
      getFriendRequestInfo(notification.senderId); // 친구 신청 상세 요청 api
    } else {
      getInviteRequestInfo(notification.id); // 게임 초대 상세 요청 api
    }
    setShowModal(true); // 알림 오픈
  };

  // 3-1. 친구 신청 상세
  const getFriendRequestInfo = async (senderId: number) => {
    try {
      const response = await axios.get(`${API_LINK}/friend/request/detail`, {
        params: {
          fromUserId: senderId,
          toUserId: userId,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // console.log(response.data.data);
      setFriendRequestInfo(response.data.data);
    } catch (error) {
      // console.error(error);
    }
  };

  // 3-2. 게임 초대 상세
  const getInviteRequestInfo = async (notificationId: string) => {
    try {
      const response = await axios.get(
        `${API_LINK}/notification/detail/${notificationId}`,
      );
      // console.log(response.data.data);
      setGameInviteInfo(response.data.data);
      setGameInviteInfoNotificationId(notificationId); // 알림 id
    } catch (error) {
      // console.error(error);
    }
  };

  // 4-1. 친구 요청 수락
  const acceptFriendRequest = async (
    senderId: number,
    notificationId: string,
  ) => {
    try {
      await axios.post(
        `${API_LINK}/friend/request-accept`,
        {
          userId: userId,
          fromUserId: senderId,
          notificationId: notificationId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      // 친구 상세 정보 불러오기
      const response = await axios.get(`${API_LINK}/user/${senderId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const newFriend: Friend = {
        friendId: response.data.data.userId,
        nickname: response.data.data.nickname,
        description: response.data.data.description,
        characterName: response.data.data.characterName,
        tierPoint: response.data.data.tierPoint,
        online: response.data.data.online,
      };

      setShowModal(false);

      // 읽은 알림 화면에서 삭제
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId),
      );

      // 알림 수 변경
      dispatch(decreaseNotificationCount());

      // 친구 수 변경
      dispatch(addFriend(newFriend));

      // 확인 모달
      setSuccessModal({
        isVisible: true,
        message: '친구 요청을 수락했습니다!',
      });
    } catch (error) {
      // console.log(error);
    }
  };

  // 4-2. 게임 초대 요청 수락
  const acceptInviteRequest = async (
    UUID: string,
    notificationId: string,
    password: string,
  ) => {
    dispatch(setPassword(password));

    await axios.post(`${API_LINK}/room/join/${UUID}`, {
      playerId: userId,
      password: password,
    });
    setShowModal(false);

    // 읽은 알림 화면에서 삭제
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId),
    );

    // 알림 수 변경
    dispatch(decreaseNotificationCount());

    // 알림 삭제(알림 아이디로)
    await axios.delete(`${API_LINK}/notification/delete`, {
      data: { id: notificationId, userId: userId },
    });

    navigate(`/wait/${UUID}`);
  };

  // 5-1. 친구 요청 거절
  const rejectFriendRequest = async (
    senderId: number,
    notificationId: string,
  ) => {
    try {
      await axios.delete(`${API_LINK}/friend/request-reject`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          userId: userId,
          fromUserId: senderId,
          notificationId: notificationId,
        },
      });
      setShowModal(false);

      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId),
      );

      // 알림 수 변경
      dispatch(decreaseNotificationCount());

      // 확인 모달
      setAlertModal({
        isVisible: true,
        message: '친구 요청을 거절했습니다!',
      });
    } catch (error) {
      // console.log(error);
    }
  };

  // 5-2. 게임 초대 요청 거절
  // 알림 삭제만 하자
  const rejectInviteRequest = async (notificationId: string) => {
    // 알림 삭제(알림 아이디로)
    await axios.delete(`${API_LINK}/notification/delete`, {
      data: { id: notificationId, userId: userId },
    });

    // 알림 수 변경
    dispatch(decreaseNotificationCount());

    // 화면에서 제거
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId),
    );

    setShowModal(false);
  };

  return (
    <div className="yellow-box min-w-[800px] w-1/2 h-[470px] p-6 px-10 pb-10 border-[#36EAB5] bg-[#fffeee]">
      <div className="relative mb-4">
        <div className="flex justify-center mint-title text-5xl">메일함</div>
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2"
          onClick={closeMail}
        >
          <img src={cancel} alt="메일함 닫기" />
        </button>
      </div>

      <div className="list-box h-5/6 p-4">
        {/* 알림 데이터가 있을 경우 렌더링 */}
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <button
              className="flex p-4 relative"
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
            >
              <div>
                <img src={mail} alt="" />
              </div>
              <div className="flex items-center white-text text-xl mx-5">
                {notification.content}
              </div>
            </button>
          ))
        ) : (
          <div className="white-text text-3xl">받은 알림이 없습니다.</div>
        )}
      </div>

      {/* 모달 */}
      {showModal && selectedNotification && (
        <Modal>
          {selectedNotification.notificationType === 'FRIEND_REQUEST' ? (
            <div className="yellow-box min-w-[800px] w-1/2 h-[400px] p-6 border-[#36EAB5] bg-[#fffeee]">
              <div className="mint-title mb-5">친구 요청</div>
              <div className="mb-5 flex justify-center items-center">
                <div className="friend-search-box w-36 h-36 rounded-full mr-10 p-5">
                  {friendRequestInfo?.fromUserCharacterName && (
                    <ProfileImg
                      characterName={friendRequestInfo.fromUserCharacterName}
                    />
                  )}
                </div>
                <div className="friend-search-box w-56 h-[100px] rounded-3xl flex items-center justify-center">
                  {friendRequestInfo?.fromUserNickname && (
                    <div>
                      <div className="flex justify-between items-center">
                        <div className="text-xl level-text mr-2">
                          <LevelText
                            tierPoint={friendRequestInfo.fromUserTierPoint}
                          />
                        </div>
                        <div className="w-8 ">
                          <LevelImg
                            tierPoint={friendRequestInfo.fromUserTierPoint}
                          />
                        </div>
                      </div>
                      <div className="white-text text-2xl">
                        {friendRequestInfo.fromUserNickname}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="white-text text-3xl mb-8">
                친구 요청을 수락하시겠어요?
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() =>
                    rejectFriendRequest(
                      selectedNotification.senderId,
                      selectedNotification.id,
                    )
                  }
                  className="mr-32"
                >
                  <img src={cancel} alt="취소" />
                </button>
                <button
                  onClick={() =>
                    acceptFriendRequest(
                      selectedNotification.senderId,
                      selectedNotification.id,
                    )
                  }
                >
                  <img src={confirm} alt="취소" />
                </button>
              </div>
            </div>
          ) : (
            <div className="yellow-box min-w-[800px] w-1/2 h-[300px] p-6 border-[#36EAB5] bg-[#fffeee]">
              <div className="mint-title mb-8 text-5xl">게임 초대</div>
              <div className="white-text text-3xl mb-6">
                {gameInviteInfo?.senderNickname} 님이 게임에 초대하였습니다.
              </div>
              <div className="level-text text-3xl">입장하시겠어요?</div>
              <div className="mt-6">
                <button
                  className="mr-32"
                  onClick={() => {
                    if (
                      gameInviteInfo?.roomId &&
                      gameInviteInfoNotificationId &&
                      gameInviteInfo.password
                    ) {
                      acceptInviteRequest(
                        gameInviteInfo.roomId,
                        gameInviteInfoNotificationId,
                        gameInviteInfo.password,
                      );
                    }
                  }}
                >
                  <img src={confirm} alt="확인" />
                </button>
                <button
                  className="ml-4"
                  onClick={() => {
                    if (gameInviteInfoNotificationId) {
                      rejectInviteRequest(gameInviteInfoNotificationId);
                    }
                  }}
                >
                  <img src={cancel} alt="취소" />
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}
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
