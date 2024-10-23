import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Modal from '../common/Modal';

import cancel from '../../assets/icon/cancel.png';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { toggleMusic } from '../../redux/slices/musicSlice';

const AUTH_LINK = import.meta.env.VITE_AUTH_URL;

export default function Setting({
  closeSetting,
}: {
  closeSetting: () => void;
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMusicOn = useSelector((state: RootState) => state.music.isMusicOn);
  const [showModal, setShowModal] = useState<boolean>(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const editProfile = () => {
    navigate('/edit/profile');
  };

  const editCharacter = () => {
    navigate('/edit/character');
  };

  const handleLogout = async () => {
    try {
      const accessToken = sessionStorage.getItem('access_token');
      // console.log(accessToken);
      await axios.post(`${AUTH_LINK}/oauth/kakao/logout`, {
        accessToken: accessToken,
      });
    } catch (error) {
      console.log(error);
    }

    try {
      const kakaoAccessToken = sessionStorage.getItem('kakao_access_token');
      //console.log(kakaoAccessToken);
      await axios.post(
        'https://kapi.kakao.com/v1/user/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${kakaoAccessToken}`,
          },
        },
      );
      setShowModal(false);

      // sessionStorage 저장된 것 모두 지우기
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('kakao_access_token');
      sessionStorage.removeItem('persist:root');

      // 로그인 화면으로 이동
      navigate('/');
    } catch (error) {
      // console.log(error);
    }
  };
  return (
    <div className="setting-box min-w-[500px] w-1/3 h-[600px] p-5">
      <div className="relative">
        <div className="setting-text text-4xl">환경 설정</div>
        <button
          className="absolute right-6 top-1/2 transform -translate-y-1/2"
          onClick={closeSetting}
        >
          <img src={cancel} alt="환경설정 닫기" />
        </button>
      </div>
      <div className="">
        <button
          onClick={() => dispatch(toggleMusic())}
          className="audio-on text-3xl w-4/5 my-6 mt-10"
        >
          {isMusicOn ? '배경음악 ON' : '배경음악 OFF'}
        </button>
        <button
          className="setting-list text-3xl w-4/5 my-6"
          onClick={editCharacter}
        >
          캐릭터 수정
        </button>
        <button
          className="setting-list text-3xl w-4/5 my-6"
          onClick={editProfile}
        >
          회원 정보 수정
        </button>
        <button
          className="setting-list text-3xl w-4/5 my-6"
          onClick={openModal}
        >
          로그아웃
        </button>
      </div>
      <div className="version text-2xl mt-6">version 0.0.1</div>

      {showModal && (
        <Modal>
          <div className="yellow-box w-2/5 h-[200px] p-6 bg-[#fffeee] border-[#36EAB5]">
            <div className="mint-title mint-title text-4xl">
              로그아웃 하시겠습니까?
            </div>
            <div className="flex justify-between px-12">
              <button
                onClick={closeModal}
                className="cancel-button w-5/12 h-[50px] text-2xl mt-10"
              >
                취소
              </button>
              <button
                onClick={handleLogout}
                className="logout-button w-5/12 h-[50px] text-2xl mt-10"
              >
                로그아웃
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
