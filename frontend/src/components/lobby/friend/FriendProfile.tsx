import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import Modal from '../../common/Modal';
import FriendDelete from './FriendDelete';
import LevelImg from '../../common/LevelImg';
import LevelText from '../../common/LevelText';
import ProfileImg from '../../common/ProfileImg';
import Experience from '../../common/Experience';

import cancel from '../../../assets/icon/cancel.png';
import kill from '../../../assets/icon/kill.png';

export default function FriendProfile({
  closeProfile,
  friendId,
}: {
  closeProfile: () => void;
  friendId: number;
}) {
  const API_LINK = import.meta.env.VITE_API_URL;

  const [nickname, setNickname] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [level, setLevel] = useState<string>('');
  const [characterName, setCharacterName] = useState<string>('');
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const getFriendProfile = async () => {
    try {
      const response = await axios.get(`${API_LINK}/user/${friendId}`);
      setNickname(response.data.data.nickname);
      setDescription(response.data.data.description);
      setLevel(response.data.data.tierPoint);
      setCharacterName(response.data.data.characterName);
    } catch {}
  };

  // 삭제 확인 모달
  const openDeleteModal = () => setDeleteModal(true);
  const closeDeleteModal = () => setDeleteModal(false);

  useEffect(() => {
    getFriendProfile();
  }, []);

  return (
    <div className="yellow-box min-w-[700px] w-1/2 h-[470px] p-6 px-10 border-[#36EAB5] bg-[#FFFEEE]">
      <div className="flex justify-end" onClick={closeProfile}>
        <button>
          <img src={cancel} alt="프로필 창 닫기" />
        </button>
      </div>
      <div>
        <div className="flex justify-between px-10 mt-4">
          <div className="friend-search-box w-48 h-48 rounded-full overflow-hidden">
            <ProfileImg characterName={characterName} />
          </div>
          <div className="flex flex-col items-center">
            <div className="friend-search-box w-56 h-[100px] rounded-3xl flex-col mt-4">
              <div className="flex items-center mb-2">
                <div className="mr-2 text-xl level-text">
                  <LevelText tierPoint={Number(level)} />
                </div>
                <div className="w-6">
                  <LevelImg tierPoint={Number(level)} />
                </div>
              </div>
              <div className="white-text text-3xl">{nickname}</div>
            </div>
            <Experience tierPoint={Number(level)} />
          </div>
        </div>
        <div className="flex justify-between items-center px-10 mt-12">
          <div className="friend-search-box white-text text-2xl w-10/12 h-[60px] rounded-3xl flex-col">
            {description}
          </div>
          <div className="flex items-center w-12" onClick={openDeleteModal}>
            <button>
              <img src={kill} alt="친구 삭제" />
            </button>
          </div>
        </div>
      </div>
      {deleteModal && (
        <Modal>
          <FriendDelete
            closeDeleteModal={closeDeleteModal}
            friendId={friendId}
            nickname={nickname}
          />
        </Modal>
      )}
    </div>
  );
}
