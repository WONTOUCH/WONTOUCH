import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  setUserId,
  setUserNickname,
  setUserDescription,
  setUserCharacterName,
  setUserMileage,
  setUserTierPoint,
} from '../../../redux/slices/userSlice';
import { jwtDecode } from 'jwt-decode';
import Modal from '../../common/Modal';
import AlertModal from '../../common/AlertModal';

import girlLogin from '../../../assets/background/characters/walk/girl_login_walk.gif';

interface DecodedToken {
  userId: number;
}

function KakaoLoginHandler() {
  const AUTH_LINK = import.meta.env.VITE_AUTH_URL;
  const API_LINK = import.meta.env.VITE_API_URL;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    message: '',
  });

  const getToken = async () => {
    const code = new URL(window.location.href).searchParams.get('code'); // 인가코드 추출

    try {
      // 백엔드로부터 access token을 받아옴
      const userRes = await axios.post(`${AUTH_LINK}/oauth/kakao`, {
        code: code,
      });

      // access token, kakao access token을 local storage에 저장
      const accessToken = userRes.data.data.accessToken;
      const kakaoAccessToken = userRes.data.data.kakaoAccessToken;
      sessionStorage.setItem('access_token', accessToken);
      sessionStorage.setItem('kakao_access_token', kakaoAccessToken);

      // access token을 디코딩해 userId 추출, store에 저장
      const decodedToken = jwtDecode<DecodedToken>(accessToken);
      const userId = decodedToken.userId;
      dispatch(setUserId(userId));

      // 회원가입이 필요한 경우
      if (userRes.data.data.firstLogin === true) {
        setTimeout(() => {
          navigate('/signup');
        }, 1500);
      } else {
        setTimeout(() => {
          // 이미 가입된 유저인 경우 사용자 정보 store에 저장 후, sse 연결하고 로비로 이동
          getUserData(userId, accessToken);
        }, 1500);
      }
    } catch (error) {
      // console.log(error);
      setAlertModal({
        isVisible: true,
        message: '로그인 중 오류가 발생했습니다. 다시 시도해주세요.',
      });
    }
  };

  // 사용자 정보 가져오기
  const getUserData = async (userId: number, accessToken: string) => {
    try {
      // 사용자 정보 요청
      const response = await axios.get(`${API_LINK}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      dispatch(setUserNickname(response.data.data.nickname));
      dispatch(setUserDescription(response.data.data.description));
      dispatch(setUserCharacterName(response.data.data.characterName));
      dispatch(setUserMileage(response.data.data.mileage));
      dispatch(setUserTierPoint(response.data.data.tierPoint));

      // 로비로 이동
      navigate('/lobby');
    } catch (error) {
      // console.log('Error fetching user data:', error);
    }
  };

  // useEffect를 사용하여 getToken 함수 호출
  useEffect(() => {
    getToken();
  }, []);

  // 경고 모달 닫기
  const closeAlterModal = () =>
    setAlertModal({ isVisible: false, message: '' });

  return (
    <div className="pt-60">
      <div className="w-[500px] mx-auto pb-3">
        <img src={girlLogin} alt="" className="w-full" />
      </div>
      <div className="text-5xl white-title">유저 정보 확인 중 . . .</div>
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

export default KakaoLoginHandler;
