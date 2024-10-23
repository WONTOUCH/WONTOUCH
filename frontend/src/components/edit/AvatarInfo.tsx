import { useState } from 'react';
import { characterImages, walkImages } from '../../assets/avatarImages';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  setAvatars,
  updateAvatarEquipped,
} from '../../redux/slices/avatarSlice';
import Modal from '../common/Modal';
import AlertModal from '../common/AlertModal';
import SuccessModal from '../common/SuccessModal';
import mileage from '../../assets/icon/coin_mint_mini.png';
import { RootState } from '../../redux/store';
import { setUserCharacterName } from '../../redux/slices/userSlice';

interface Avatar {
  characterName: string;
  description: string | undefined;
  price: number | 0;
  equipped: boolean;
  owned: boolean;
}

interface AvatarInfoProps {
  avatar: Avatar;
  isWalkingAvatar: boolean;
  setIsWalkingAvatar: (isWalking: boolean) => void;
  onPurchaseClick: (price: number) => void;
}

function AvatarInfo({
  avatar,
  isWalkingAvatar,
  setIsWalkingAvatar,
  onPurchaseClick,
}: AvatarInfoProps) {
  const dispatch = useDispatch();
  const API_LINK = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('acess_token');
  const userId = useSelector((state: RootState) => state.user.id);

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

  // ✅ 걷는 모습
  const handleClickWalk = () => {
    setIsWalkingAvatar(true);
  };

  // ✅ 대기 모습
  const handleClickStand = () => {
    setIsWalkingAvatar(false);
  };

  // ✅ 장착 저장 API
  const handleSaveClick = async () => {
    try {
      await axios.patch(
        `${API_LINK}/avatar/update`,
        {
          userId: userId,
          characterName: avatar.characterName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // 아바타 목록 업데이트 API
      const response = await axios.get(`${API_LINK}/avatar/list/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log(response.data.data);

      dispatch(setAvatars(response.data.data)); // Redux 상태 업데이트
      dispatch(setUserCharacterName(avatar.characterName));
      dispatch(updateAvatarEquipped(avatar.characterName));

      setSuccessModal({
        isVisible: true,
        message: '장착에 성공했습니다!',
      });
    } catch (error) {
      // console.error('아바타 변경 중 오류 발생: ', error);
      setAlertModal({
        isVisible: true,
        message: '장착에 실패했습니다..',
      });
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="ml-36">
          {isWalkingAvatar ? (
            <img
              src={walkImages[avatar.characterName]}
              alt={avatar.description}
              className="h-[130px] object-contain"
            />
          ) : (
            <img
              src={characterImages[avatar.characterName]}
              alt={avatar.description}
              className="h-[130px] object-contain"
            />
          )}
        </div>
        <div className="ml-20">
          <button
            onClick={handleClickStand}
            className="block py-1 px-4 bg-[#36EAB5] rounded-[20px] mileage-text mb-2"
          >
            대기
          </button>
          <button
            onClick={handleClickWalk}
            className="block py-1 px-4 bg-[#36EAB5] rounded-[20px] mileage-text"
          >
            걷기
          </button>
        </div>
      </div>
      {avatar.owned ? (
        avatar.equipped ? (
          <button className="white-text block text-[1.4rem] mx-auto rounded-[30px] mt-3 bg-[#aaa] px-10 py-2 border-[3px] border-[#555]">
            장착 중
          </button>
        ) : (
          <button
            onClick={handleSaveClick}
            className="mileage-text block text-[1.4rem] mx-auto rounded-[30px] mt-3 bg-[#36EAB5] px-10 py-2 border-[3px] border-[#10AB7D]"
          >
            장착하기
          </button>
        )
      ) : (
        <button
          onClick={() => onPurchaseClick(avatar.price)}
          className="yellow-text text-[1.4rem] mx-auto rounded-[30px] mt-3 bg-[#FE0] px-10 py-2 border-[3px] border-[#EBA900] flex justify-between items-center"
        >
          {avatar.price}
          <div>
            <img src={mileage} alt="마일리지" className="ml-1" />
          </div>
        </button> // 구매버튼
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
    </>
  );
}

export default AvatarInfo;
