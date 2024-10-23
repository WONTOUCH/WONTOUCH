import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { CheckNicknameDuplicate } from '../../../utils/CheckNicknameDuplicate';
import { CheckSetNickname } from '../../../utils/CheckSetNickname';
import Modal from '../../common/Modal';
import AlertModal from '../../common/AlertModal';
import SuccessModal from '../../common/SuccessModal';

import boy from '../../../assets/background/characters/stand/boy.png';

function SignupWithKakao() {
  const API_LINK = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const [nickname, setNickname] = useState('');
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<
    boolean | null
  >(null);
  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    message: '',
  });
  const [successModal, setSuccessModal] = useState({
    isVisible: false,
    message: '',
  });

  const handleCheckNickname = async () => {
    const availability = await CheckNicknameDuplicate(nickname);
    if (availability === 'isOK') {
      setIsNicknameAvailable(true);
    } else if (!nickname) {
      setAlertModal({ isVisible: true, message: '닉네임을 입력해주세요.' });
    } else {
      setAlertModal({
        isVisible: true,
        message: '닉네임 중복 확인이 불가능합니다.',
      });
    }
  };

  // store에 저장된 userId와 입력받은 nickname을 이용해서 회원가입 진행
  const userId = useSelector((state: RootState) => state.user.id);

  const signupWithKakao = async () => {
    event?.preventDefault(); // 새로고침 방지

    if (!nickname) {
      setAlertModal({
        isVisible: true,
        message: '닉네임을 입력해주세요.',
      });
      return;
    }

    if (isNicknameAvailable === false) {
      setAlertModal({
        isVisible: true,
        message: '중복된 닉네임입니다. 다른 닉네임을 입력해주세요.',
      });
      return;
    }

    // 닉네임 유효성 검사
    const checkNickname = CheckSetNickname(nickname);
    if (checkNickname !== 'isOK') {
      setAlertModal({
        isVisible: true,
        message: checkNickname,
      });
      setIsNicknameAvailable(null);
      return;
    }

    try {
      await axios.post(`${API_LINK}/user-profile/join`, {
        userId: userId,
        nickname: nickname,
      });
      sessionStorage.removeItem('access_token');
      setSuccessModal({
        isVisible: true,
        message: '회원가입에 성공하였습니다!',
      });
    } catch (error) {
      setAlertModal({
        isVisible: true,
        message: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.',
      });
      navigate('/login');
    }
  };

  // 경고 모달 닫기
  const closeAlterModal = () =>
    setAlertModal({ isVisible: false, message: '' });
  // 성공 모달 닫기
  const closeSuccessModal = () => {
    setSuccessModal({ isVisible: false, message: '' });
    navigate('/');
  };

  return (
    <div className="items-center h-screen justify-center pt-16">
      <div className="mint-title text-5xl mb-8">캐릭터생성</div>
      <div className="yellow-box flex flex-col items-center w-[800px] h-[480px] my-0 mx-auto">
        <div className="profile-img w-[230px] h-[230px] flex items-center justify-center p-4">
          <img
            className="w-full h-full object-contain"
            src={boy}
            alt="기본 캐릭터"
          />
        </div>

        <form onSubmit={signupWithKakao}>
          <div className="flex items-center justify-between mt-6">
            <label htmlFor="nickname" className="text-[#10AB7D] text-3xl mr-8">
              닉네임
            </label>
            <input
              className="font-['Galmuri11'] w-[420px] mr-6 p-3 signup-input"
              id="nickname"
              placeholder="한글 6자, 영어 10자, 숫자 10자, 혼용 8자 제한"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
            />
            <button
              type="button"
              className="ready-button w-[150px] h-[15px] text-2xl border-[#10AB7D] border-4"
              onClick={handleCheckNickname}
            >
              중복확인
            </button>
          </div>

          <div className="text-left ml-32 font-['Galmuri11'] min-h-[24px]">
            {isNicknameAvailable === true && (
              <p className="text-green-600">중복되지 않은 닉네임입니다.</p>
            )}
            {isNicknameAvailable === false && (
              <p className="text-red-600">이미 사용 중인 닉네임입니다.</p>
            )}
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="ready-button w-[200px] h-[30px] text-3xl border-[#10AB7D] border-4"
            >
              생성
            </button>
          </div>
        </form>
      </div>
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

export default SignupWithKakao;
