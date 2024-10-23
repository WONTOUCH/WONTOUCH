import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import Modal from '../common/Modal';

import cancel from '../../assets/icon/cancel.png';
import confirm from '../../assets/icon/confirm.png';

export default function DeleteUser({
  closeDeleteModal,
}: {
  closeDeleteModal: () => void;
}) {
  const API_LINK = import.meta.env.VITE_API_URL;
  const userId = useSelector((state: RootState) => state.user.id);
  const [finish, setFinish] = useState<boolean>(false);
  const navigate = useNavigate();

  const deleteUser = async () => {
    try {
      const response = await axios.delete(`${API_LINK}/user/delete/${userId}`);

      if (response) {
        setFinish(true);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const goLogin = async () => {
    setFinish(false);
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('kakao_access_token');
    sessionStorage.removeItem('persist:root');
    navigate('/');
  };

  return (
    <div className="yellow-box w-1/2 h-[300px] border-[#36EAB5] bg-[#FFFEEE] p-8">
      <div className="mint-title text-5xl mb-8">회원 탈퇴</div>
      <div className="white-text text-2xl">정말 탈퇴하실껀가요?</div>
      <div className="white-text text-2xl mb-8">
        회원님의 모든 정보가 삭제됩니다.
      </div>
      <div className="flex justify-between px-52">
        <button onClick={closeDeleteModal}>
          <img src={cancel} alt="" />
        </button>
        <button onClick={deleteUser}>
          <img src={confirm} alt="" />
        </button>
      </div>

      {finish && (
        <Modal>
          <div className="yellow-box w-1/2 h-[200px] border-[#36EAB5] bg-[#FFFEEE] p-8">
            <div className="white-text text-4xl mb-10">
              회원 탈퇴가 완료되었습니다.
            </div>
            <button onClick={goLogin}>
              <img src={confirm} alt="" />
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
