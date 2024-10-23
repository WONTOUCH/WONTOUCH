import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setAvatars } from '../../redux/slices/avatarSlice';
import AvatarBox from './AvatarBox';
import AvatarInfo from './AvatarInfo';
import Modal from '../common/Modal';
import AlertModal from '../common/AlertModal';
import { postUserMileage } from '../../redux/slices/userSlice';
import ConfirmPurchaseModal from './ConfirmPurchaseModal';

interface Avatar {
  characterName: string;
  description: string | undefined;
  price: number | 0;
  equipped: boolean;
  owned: boolean;
}

function EditCharacter() {
  const dispatch = useDispatch();
  const API_LINK = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('acess_token');
  const userId = useSelector((state: RootState) => state.user.id);
  const mileage = useSelector((state: RootState) => state.user.mileage);
  const avatars = useSelector((state: RootState) => state.avatar.avatars);

  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [isWalkingAvatar, setIsWalkingAvatar] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태
  const [priceToBuy, setPriceToBuy] = useState(0); // 구매할 가격 저장
  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    message: '',
  });

  // 경고 모달 닫기
  const closeAlterModal = () =>
    setAlertModal({ isVisible: false, message: '' });

  useEffect(() => {
    const fetchCharacterInfo = async () => {
      try {
        const response = await axios.get(`${API_LINK}/avatar/list/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const avatarsResponse = response.data.data;
        // console.log('캐릭터 정보', response.data.data);
        dispatch(setAvatars(avatarsResponse));

        // 장착된 아바타를 찾고 설정
        const equippedAvatar = avatarsResponse.find(
          (avatar: Avatar) => avatar.equipped,
        );
        if (equippedAvatar) {
          // console.log(equippedAvatar);
          // dispatch(setAvatars(equippedAvatar));
          setSelectedAvatar(equippedAvatar);
        }
      } catch (error) {
        // console.error('아바타 불러오는 중 오류 발생: ', error);
      }
    };
    fetchCharacterInfo();
  }, [userId, mileage]);

  const handleAvatarClick = (avatar: Avatar) => {
    setSelectedAvatar(avatar);
    setIsWalkingAvatar(false); // 다른 아바타를 클릭할 때 대기 상태로 초기화
  };

  const handlePurchaseClick = (price: number) => {
    if (mileage < price) {
      setAlertModal({
        isVisible: true,
        message: '마일리지가 부족합니다..',
      });
    } else {
      setPriceToBuy(price);
      setIsModalOpen(true); // 모달 열기
    }
  };

  const handleConfirmPurchase = async () => {
    try {
      // 구매 API 호출
      await axios.post(
        `${API_LINK}/avatar/purchase`,
        {
          userId: userId,
          characterName: selectedAvatar?.characterName, // 선택된 아바타의 이름
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // 마일리지 차감
      dispatch(postUserMileage(priceToBuy)); // 마일리지 차감
      setIsModalOpen(false); // 모달 닫기
      // 추가적인 로직: 구매 후 아바타 소유 상태 변경 등
    } catch (error) {
      // console.error('아바타 구매 중 오류 발생: ', error);
    }
  };

  // 캐릭터 구입 시, 마일리지 차감은
  // userSlice에 구현해둔 postUserMileage를 사용하시면 됩니당
  // dispatch(postUserMileage(10000))
  // 이 예시는 10000원짜리 캐릭터를 사는 로직입니다!!
  // store에 바로 값을 반영해줘야 새로고침 없이 화면에 리렌더링 됨!!

  return (
    <div className="p-10">
      <h1 className="mint-title mb-6">캐릭터 수정</h1>

      {/* 아바타 상세보기 */}
      <section className="yellow-box w-[45rem] items-center mb-6 mx-auto p-8">
        {/* 선택된 아바타 정보를 props로 전달 */}
        {avatars.map(
          (avatar) =>
            // avatar.characterName과 selectedAvatar.characterName이 일치할 때만 AvatarInfo를 호출
            avatar.characterName === selectedAvatar?.characterName && (
              <AvatarInfo
                key={avatar.characterName}
                avatar={avatar}
                isWalkingAvatar={isWalkingAvatar}
                setIsWalkingAvatar={setIsWalkingAvatar}
                onPurchaseClick={handlePurchaseClick}
              />
            ),
        )}
      </section>

      {/* 아바타 목록 */}
      <section className="yellow-box w-[70rem] my-0 mx-auto overflow-x-scroll">
        <button className="flex flex-nowrap px-10 py-6 justify-between">
          {avatars.map((avatar) => (
            <AvatarBox
              key={avatar.characterName}
              characterName={avatar.characterName}
              description={avatar.description}
              equipped={avatar.equipped}
              owned={avatar.owned}
              onClick={() => handleAvatarClick(avatar)}
            />
          ))}
        </button>
      </section>

      {isModalOpen ? (
        <Modal>
          <ConfirmPurchaseModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirmPurchase}
            price={priceToBuy}
          />
        </Modal>
      ) : (
        ''
      )}

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

export default EditCharacter;
