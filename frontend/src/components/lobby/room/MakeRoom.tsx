import { useState } from 'react';
import axios from 'axios';
import { RootState } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setHostId,
  setRoomId,
  setRoomName,
  setIsPrivate,
  setPassword,
} from '../../../redux/slices/roomSlice';
import Modal from '../../common/Modal';
import AlertModal from '../../common/AlertModal';

import cancel from '../../../assets/icon/cancel.png';
import confirm from '../../../assets/icon/confirm.png';
import lock from '../../../assets/icon/lock.png';
import unLock from '../../../assets/icon/unlock.png';

export default function MakeRoomModal({
  closeMakeRoom,
}: {
  closeMakeRoom: () => void;
}) {
  // api 주소
  const API_LINK = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    message: '',
  });

  // UUID 먼저 발급
  const getUUID = async () => {
    try {
      const res = await axios.get(`${API_LINK}/room/create/random-uuid`);
      const UUID = res.data.data;
      return UUID; // UUID 값을 반환
    } catch (error) {
      setAlertModal({ isVisible: true, message: '다시 시도해주세요.' });
    }
  };

  // store에 저장된 userId
  const userId = useSelector((state: RootState) => state.user.id);

  const [roomNameState, setRoomNameState] = useState<string>('');
  const [isPrivateState, setIsPrivateState] = useState<boolean>(false);
  const [passwordState, setPasswordState] = useState<string>('');

  const handleMakeRoom = async () => {
    if (userId === null) {
      setAlertModal({
        isVisible: true,
        message: '사용자 ID를 찾을 수 없습니다.',
      });
      return;
    }

    if (!roomNameState) {
      setAlertModal({
        isVisible: true,
        message: '방 제목을 입력하세요!',
      });
      return;
    }

    try {
      // UUID 발급
      const UUID = await getUUID();
      if (!UUID) {
        setAlertModal({
          isVisible: true,
          message: '다시 시도해주세요.',
        });
        return;
      }

      // 방 생성 요청
      const res = await axios.post(`${API_LINK}/room`, {
        roomId: UUID,
        roomName: roomNameState,
        hostPlayerId: userId,
        isPrivate: isPrivateState,
        password: isPrivateState ? passwordState : '', // 비공개 방일 경우에만 비밀번호를 설정
      });

      const createdRoomId = res.data.data.roomId;

      //방 생성 성공 시 store에 저장
      dispatch(setRoomId(createdRoomId));
      dispatch(setRoomName(roomNameState));
      dispatch(setHostId(userId));
      dispatch(setIsPrivate(isPrivateState));
      dispatch(setPassword(passwordState));

      // 바로 생성한 방으로 이동
      await axios.post(`${API_LINK}/room/join/${createdRoomId}`, {
        playerId: userId,
        password: passwordState,
      });
      navigate(`/wait/${createdRoomId}`);
    } catch (error) {
      setAlertModal({
        isVisible: true,
        message: '다시 시도해주세요.',
      });
    }
  };

  // 경고 모달 닫기
  const closeAlterModal = () =>
    setAlertModal({ isVisible: false, message: '' });

  return (
    <div className="yellow-box min-w-[700px] w-1/2 h-[460px] border-[#36EAB5] bg-[#FFFEEE] p-8 px-20">
      <div className="mint-title mb-6">방 만들기</div>
      <div>
        <input
          type="text"
          placeholder="방 제목"
          className="input-tag font-['Galmuri11'] w-full h-[80px] p-4 text-2xl mb-12"
          value={roomNameState}
          onChange={(e) => {
            setRoomNameState(e.target.value); // roomNameState 업데이트
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span>
          <img
            src={isPrivateState ? lock : unLock}
            alt={isPrivateState ? '비밀번호 있는 방' : '비밀번호 없는 방'}
          />
        </span>
        <input
          type="text"
          placeholder="비밀번호"
          className="input-tag font-['Galmuri11'] w-10/12 h-[80px] p-4 text-2xl"
          value={passwordState} // passwordState로 value 설정
          onChange={(e) => {
            setPasswordState(e.target.value); // 로컬 상태 업데이트
            setIsPrivateState(e.target.value !== ''); // 비밀번호 존재 여부에 따라 isPrivateState 업데이트
          }}
        />
      </div>
      <div className="mt-12 mx-6 flex justify-evenly">
        <button onClick={closeMakeRoom}>
          <img src={cancel} alt="모달 닫기" />
        </button>
        <button onClick={handleMakeRoom}>
          <img src={confirm} alt="방 생성하기" />
        </button>
      </div>

      {alertModal.isVisible && (
        <Modal>
          <AlertModal
            message={alertModal.message}
            closeAlterModal={closeAlterModal}
          />
        </Modal>
      )}
    </div>
  );
}
